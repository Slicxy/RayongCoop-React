# แนวทางป้องกันและติดตามความปลอดภัยของเว็บ PHP/MySQL

> เอกสารวิจัย ณ 28 กันยายน 2026 — ใช้สำหรับออกแบบ Production และระบบสำรองบน VPS แยกกัน ไม่ใช่คู่มือคำสั่งติดตั้งฉบับสมบูรณ์

## ข้อสรุปสำหรับการตัดสินใจ

วาง CDN/WAF ไว้หน้าระบบ, ปิดไม่ให้ Internet เข้าถึง origin โดยตรง, เก็บบันทึกเหตุการณ์จาก WAF/เว็บ/แอป/ระบบปฏิบัติการไว้ศูนย์กลางที่แยกจาก VPS, และตั้งการแจ้งเตือนจาก “ค่าปกติ” ของระบบเป็นลำดับแรก.  การมีเครื่องสำรองที่ replicate แบบทันทีช่วยเรื่อง availability แต่ **ไม่ใช่ backup**: การลบข้อมูลหรือ ransomware อาจถูก replicate ตามไปด้วย จึงต้องมี backup แบบ versioned/immutable แยกต่างหากและทดสอบการกู้คืน.

## 1. WAF/CDN และขอบเขตเครือข่าย

- ให้ DNS ของเว็บไซต์ชี้ไป CDN/WAF และบังคับ HTTPS ทุกเส้นทาง. TLS ช่วยปกปิดข้อมูล ป้องกันการแก้ไขระหว่างทาง และยืนยันตัวตนของปลายทางเว็บตาม [OWASP TLS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).
- เปิดกฎ WAF สำหรับการโจมตีเว็บทั่วไป และตั้ง rate limit รายเส้นทางอย่างน้อย `/login`, `/password-reset`, API ที่เขียนข้อมูล และ upload. เอกสาร [Cloudflare Rate Limiting Rules](https://developers.cloudflare.com/waf/rate-limiting-rules/) ระบุโดยตรงว่ากฎชนิดนี้ใช้ลดการ abuse, ป้องกัน brute force ที่ login และจำกัด API calls ต่อ client ได้.
- อนุญาต inbound ที่ origin VPS เฉพาะ IP range ของ CDN/WAF (รวมถึงช่องทางบริหารที่เป็น VPN หรือ allow-list) เพื่อป้องกันการยิงตรงข้าม WAF. อย่าเปิด MySQL ต่อ Internet; ให้เข้าถึงได้เฉพาะ private network/host ที่จำเป็น.
- กำหนด connection timeout, ขนาด request/upload, concurrency และอัตรารับส่งข้อมูลให้เหมาะกับทรัพยากร. [OWASP DoS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html) แนะนำ rate limit, timeout, load/bandwidth limit และให้ใช้ log สร้าง baseline ของทราฟฟิกจริงก่อนปรับค่า.

## 2. Hardening ที่สัมพันธ์กับ PHP/MySQL

- ใช้ SSH key, ปิด direct root login และ password login, จำกัดช่องทาง SSH, แยกบัญชี deploy/admin และเปิด MFA สำหรับบัญชีผู้ดูแลของ VPS, DNS, CDN/WAF และ Git. เก็บ secret ใน secret store หรือ environment ที่ควบคุมสิทธิ์ ไม่เก็บใน Git หรือ log.
- แอปต้องตรวจ authentication และ authorization ที่ฝั่ง server ของทุก API. หน้า login และหน้าที่ authenticated ต้องเป็น TLS ทั้งหมด; [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) อธิบายว่า TLS ที่ขาดหายทำให้ credential หรือ session ID ถูกดักได้.
- สำหรับ PHP: ปิด production debug/stack trace ที่เปิดเผยข้อมูล, validate input ที่ขอบเขตระบบ, จำกัด CORS ตาม origin ที่จำเป็น, ใช้ cookie `Secure`, `HttpOnly`, `SameSite`, และจำกัดชนิด/ขนาดไฟล์ upload ก่อนประมวลผล.
- สำหรับ MySQL replication: ใช้การเชื่อมต่อเข้ารหัส, เข้ารหัส binary/relay log เมื่อเหมาะสม และให้ privilege ของ replication เท่าที่จำเป็น. [MySQL Replication Security](https://dev.mysql.com/doc/refman/8.4/en/replication-security.html) ระบุมาตรการทั้งสามนี้ชัดเจน.

## 3. Centralized logging ที่ต้องเก็บ

ส่ง log ผ่านช่องทางเข้ารหัสไปยังที่เก็บที่อยู่นอก VPS ทั้ง Production และ Standby และจำกัดสิทธิ์แก้ไข/ลบ. CISA แนะนำให้เปิดและรวม log จาก server, firewall, endpoint และ cloud services เพื่อให้ค้นหาความผิดปกติได้ง่ายขึ้นใน [Use Logging on Business Systems](https://www.cisa.gov/audiences/small-and-medium-businesses/secure-your-business/use-logging-on-business-systems). แหล่งข้อมูลขั้นต่ำคือ:

| แหล่ง | เหตุการณ์/ข้อมูลสำคัญ |
|---|---|
| CDN/WAF | request count, ประเทศ/ASN/IP, action allow/challenge/block, rule ที่ match, rate-limit event |
| Reverse proxy/web server | method, path, status, latency, response size, client IP ที่เชื่อถือได้, user agent, request ID |
| PHP/application | login สำเร็จ/ล้มเหลว, access-control failure, validation error, session/JWT failure, admin action, export, upload, เปลี่ยนข้อมูลสำคัญ |
| VPS/OS | SSH success/failure, sudo, account/authorized-key change, service restart, firewall change, process และ disk error |
| MySQL/backup/replication | replication lag/error, backup success/failure, restore test, privileged DB action ที่จำเป็น |

OWASP ระบุว่าการบันทึกเพียง access log ของ web server ไม่พอ และเสนอให้เก็บ authentication/authorization failures, input/output validation failures, application/system events, ผู้กระทำ, object, severity และเวลาใน [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html). ต้อง **ไม่** บันทึกรหัสผ่าน, session cookie, access token หรือข้อมูลส่วนบุคคลเต็มค่า; ป้องกัน log จากการแก้ไข/ลบ และทำเวลา NTP ให้ตรงกัน.

## 4. Metrics, dashboard และ alerts

แยก “metrics เพื่อเห็นสุขภาพ” ออกจาก “logs เพื่อสืบสวน” แล้วรวมมุมมองไว้ dashboard เดียว. เครื่องมือเลือกตามงบได้ เช่น Uptime Kuma สำหรับ external health check; Prometheus + Grafana สำหรับ metrics; Loki/ELK/OpenSearch สำหรับ log search. เครื่องมือเป็นตัวเลือก ไม่ใช่ข้อกำหนด—สาระคือมีข้อมูลครบและ alert ไปถึงผู้รับผิดชอบ.

| หมวด | ตัววัด/แจ้งเตือนที่ควรเริ่ม |
|---|---|
| Availability | HTTP/HTTPS/API probe ล้มเหลว, certificate ใกล้หมดอายุ, DNS/WAF เปลี่ยนแปลง |
| Performance | request rate, p95 latency, 4xx/5xx rate, active connections, CPU/RAM/disk/inode/network สูงต่อเนื่อง |
| Security | WAF block/challenge พุ่ง, login fail burst, account lockout, admin login หรือ privilege change ผิดปกติ |
| Data resilience | backup ล้มเหลว/เก่าเกิน SLA, replication stopped/lag เกิน RPO, restore test ไม่ผ่าน, log forwarding หยุด |

เริ่มจาก baseline อย่างน้อย 2–4 สัปดาห์ แล้วค่อยตั้ง threshold ราย endpoint/ช่วงเวลา เพื่อเลี่ยง false positive. CISA แนะนำทั้งการ centralize log, ตั้ง alert สำหรับ failed logins และ privilege escalation, และการ monitor log เป็นประจำใน [เอกสารเดียวกัน](https://www.cisa.gov/audiences/small-and-medium-businesses/secure-your-business/use-logging-on-business-systems).

## 5. Indicators of attack ที่ควรตรวจจับ

รายการต่อไปเป็น “สัญญาณสำหรับ triage” ไม่ใช่ข้อพิสูจน์ว่าโดนโจมตี:

1. login ล้มเหลวถี่จาก IP เดียว, หลายบัญชีจาก IP เดียว หรือบัญชีเดียวจากหลาย IP ภายในเวลาสั้น (brute force/credential stuffing)
2. 401/403/404 หรือ request ไปยัง `.env`, phpMyAdmin, path traversal, SQLi/XSS pattern เพิ่มจาก baseline
3. request/connection/POST body หรือ upload เพิ่มทันที พร้อม latency, 5xx, CPU, memory หรือ bandwidth สูง (DoS/resource exhaustion)
4. admin login จากบริบทใหม่, เพิ่มสิทธิ์/สร้างบัญชี, export ข้อมูลจำนวนมาก, เปลี่ยน DNS/WAF/secret หรือ API key
5. SSH/sudo/account/authorized-key เปลี่ยน, process หรือ service ผิดคาด, outbound traffic ผิดปกติ, backup/logging ถูกหยุดหรือลบ

ให้จัดระดับ alert ตามผลกระทบและประสานข้อมูลหลายแหล่ง. OWASP ย้ำว่า alerting ต้องผูกกับกระบวนการ incident response และ log ต้องป้องกันการรั่วไหล/การแก้ไขใน [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

## 6. Incident response runbook

เตรียมรายชื่อผู้ตัดสินใจและช่องทางแจ้งเหตุ, พร้อม runbook ที่ซ้อมอย่างน้อยทุก 3–6 เดือน:

1. **Triage/รักษาหลักฐาน** — ยืนยัน alert, ระบุขอบเขตและเวลา, เก็บ WAF/app/OS/DB logs และ snapshot ตามนโยบาย.
2. **Contain** — block/challenge ที่ WAF, revoke session/token, จำกัด network หรือ isolate VPS ที่สงสัย. อย่าสลับ failover ไปเครื่องสำรองจนตรวจว่า artefact และ credentials ปลอดภัย.
3. **Eradicate** — ปิดช่องโหว่, ลบ persistence/บัญชีที่ไม่พึงประสงค์, rotate secret, key และ password ที่อาจรั่ว.
4. **Recover** — deploy จาก artefact ที่เชื่อถือได้, restore ข้อมูลที่ผ่านการตรวจ, ทดสอบการทำงานและเฝ้าระวังเพิ่ม.
5. **Post-incident** — ทำ timeline/root cause, ปรับ WAF rule/alert/runbook และสื่อสารตามหน้าที่/ข้อกำหนด.

[CISA StopRansomware Guide](https://www.cisa.gov/stopransomware/ransomware-guide) ให้หลักฐานรองรับการทำ centralized log management, สร้าง baseline ของ traffic, เก็บ log อย่างเพียงพอต่อการสืบสวน และ containment ก่อนการฟื้นฟู. หากมีความเสี่ยง ransomware ให้เก็บ backup นอกระบบหลักและตรวจหาการฝังตัวก่อน restore.

## 7. ความเกี่ยวข้องกับระบบสำรอง MySQL

MySQL replication คัดลอกข้อมูลจาก source ไป replica และค่าเริ่มต้นเป็น asynchronous; จึงต้อง monitor replication lag/error และกำหนด RPO ตามที่ธุรกิจยอมรับ. [MySQL Replication Manual](https://dev.mysql.com/doc/refman/8.4/en/replication.html) ระบุว่า GTID ช่วยทำงาน replication หลายกรณีง่ายขึ้น และมี delayed replica ได้. Delayed replica มีประโยชน์ในการดูข้อมูลก่อนช่วงที่เกิดความผิดพลาด แต่ไม่ทดแทน backup ที่แยกและกู้คืนได้.

## ลำดับทำงานที่แนะนำ

1. เปิด CDN/WAF + HTTPS + origin firewall, harden admin access และตั้ง encrypted offsite backup/restore test.
2. ส่ง log สำคัญออกศูนย์กลาง, สร้าง health/performance/security dashboard และ alert ที่มีเจ้าของชัดเจน.
3. ตั้ง MySQL replication ที่เข้ารหัส, monitor lag/failure, เขียนและซ้อม failover/incident runbook.
4. ทำ baseline, ปรับ rate limit/alert, สแกน dependency และทดสอบ restore/failover เป็นรอบ.

## แหล่งอ้างอิงทางการ

- [OWASP — Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OWASP — Denial of Service Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [OWASP — Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP — Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
- [CISA — Use Logging on Business Systems](https://www.cisa.gov/audiences/small-and-medium-businesses/secure-your-business/use-logging-on-business-systems)
- [CISA — StopRansomware Guide](https://www.cisa.gov/stopransomware/ransomware-guide)
- [MySQL 8.4 — Replication](https://dev.mysql.com/doc/refman/8.4/en/replication.html)
- [MySQL 8.4 — Replication Security](https://dev.mysql.com/doc/refman/8.4/en/replication-security.html)
- [Cloudflare — Rate limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/)
