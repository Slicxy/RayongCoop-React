# หลักฐานประกอบการออกแบบ High Availability และ Disaster Recovery

> ขอบเขต: เว็บไซต์ PHP + MySQL ที่ติดตั้งบน VPS สองเครื่อง โดยต้องการมี
> Production/Standby, การสำรองข้อมูลนอกเครื่อง และการสลับระบบเมื่อเกิดเหตุ
> เอกสารนี้สรุปจากเอกสารผู้ผลิต/ผู้ให้บริการโดยตรงเท่านั้น (ตรวจเมื่อ 2026-09-28)
> ไม่ใช่คู่มือคำสั่ง deploy ที่พร้อมรัน และควรทดสอบในสภาพแวดล้อม staging ก่อนเสมอ

## ข้อสรุปสำหรับระบบนี้

แนะนำรูปแบบ **active-passive (warm standby)**: ให้เว็บและ PHP runtime พร้อมทำงานบน
VPS ทั้งสอง, ให้มี MySQL source เพียงตัวเดียวสำหรับงานเขียน และ MySQL replica แบบ
GTID บน VPS สำรอง. ให้ load balancer ที่มี health monitor ส่งทราฟฟิกไปยัง Production
เป็นปกติ แล้วค่อยสลับไป Standby หลังทำขั้นตอน failover ที่ควบคุมได้. ห้ามให้ทั้งสอง
ฐานข้อมูลรับ write พร้อมกันในรูปแบบ traditional replication เพราะเป็น one-way
source-to-replica และต้องออกแบบ conflict resolution เองหากใช้หลาย source
([MySQL: traditional replication](https://dev.mysql.com/doc/refman/8.4/en/group-replication-primary-secondary-replication.html),
[MySQL: multi-source limitation](https://dev.mysql.com/doc/refman/8.4/en/replication-multi-source.html)).

สำหรับไฟล์อัปโหลดและ backup ให้ใช้ object storage ที่อยู่นอก VPS เป็นแหล่งข้อมูลร่วม
หรืออย่างน้อยเป็นสำเนานอกเครื่อง โดยเปิด versioning และตั้ง retention ที่แก้ไข/ลบไม่ได้
ตามระยะเวลาที่องค์กรอนุมัติ. ใน Amazon S3 ตัวอย่างที่อ้างอิงได้คือ Object Lock
**compliance mode** ซึ่งห้ามเขียนทับหรือลบ object version ที่ถูกป้องกันได้ แม้เป็น root
account จนกว่าจะครบ retention ([AWS S3 Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html)).
ต้องพิจารณาอย่างรอบคอบก่อนเปิด เพราะเมื่อเปิด Object Lock แล้ว AWS ระบุว่าปิด Object
Lock หรือ suspend versioning ของ bucket นั้นไม่ได้
([AWS Object Lock considerations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-managing.html)).

## หลักฐานและผลต่อการออกแบบ

| ประเด็น | ข้อเท็จจริงจากเอกสารทางการ | ผลที่ควรนำไปใช้ |
|---|---|---|
| MySQL replication | MySQL replication ปกติเป็น asynchronous; source รับ write และ replica ได้รับ event ภายหลัง จึงอาจมี replication lag. | วัด lag ตลอดเวลา และกำหนด RPO ให้ไม่เล็กกว่าค่า lag ที่ยอมรับได้. อย่าอ้างว่า async replica ให้ RPO = 0. ([MySQL Replication](https://dev.mysql.com/doc/refman/8.4/en/replication.html)) |
| GTID | GTID ระบุ transaction แบบเฉพาะเจาะจง, ทำ auto-positioning/failover ง่ายขึ้น และความสอดคล้องตรวจได้เมื่อ replica apply ทุก transaction ของ source แล้ว. MySQL แนะนำ row-based replication เพื่อผลลัพธ์ที่ดี. | เปิดใช้ GTID และ row-based binlog สำหรับคู่ primary/replica; ตรวจ executed GTID และ lag ก่อน promote. ([MySQL GTID replication](https://dev.mysql.com/doc/refman/8.4/en/replication-gtids.html)) |
| ลดความเสี่ยงสูญหาย | Semisynchronous replication ทำให้ source รอจน replica อย่างน้อยหนึ่งตัวตอบรับว่าได้รับและบันทึก event แล้วก่อนตอบ session. แต่การ apply/commit บน replica ยังแยกจากกัน. | เป็นทางเลือกเมื่อยอมแลก latency เพื่อ RPO ที่ดีขึ้น; ต้องติดตามสถานะ semisync และไม่ตีความว่าเป็น synchronous commit ทุกชั้น. ([MySQL semisynchronous replication](https://dev.mysql.com/doc/refman/8.4/en/replication.html)) |
| กู้ข้อมูลย้อนหลัง | Point-in-time recovery (PITR) คือ restore full backup ก่อน แล้ว apply binary log จนถึงเวลา/จุดที่เลือก. | เก็บ full backup และ binary log นอกเครื่องตาม retention; ใช้ PITR รับมือการลบหรือแก้ข้อมูลผิดที่ replication อาจคัดลอกไปยัง standby ด้วย. ([MySQL PITR](https://dev.mysql.com/doc/refman/8.4/en/point-in-time-recovery.html)) |
| backup | MySQL ระบุว่า backup ป้องกันเหตุ system crash, hardware failure และการลบข้อมูลผิดพลาด; เอกสารครอบคลุม scheduling, compression และ encryption. | เปลี่ยนจากการเก็บ SQL dump plaintext บน VPS เครื่องเดียว เป็น backup ที่บีบอัด/เข้ารหัส, ส่ง offsite, มี retention และตรวจ restore สำเร็จ. ([MySQL Backup and Recovery](https://dev.mysql.com/doc/refman/8.4/en/backup-and-recovery.html)) |
| immutable offsite copy | S3 Object Lock ปกป้องเป็นราย object version; compliance mode ไม่ให้ผู้ใช้ใด—including root—overwrite/delete ก่อนหมด retention. | แยก credential ของ backup จาก production และใช้ bucket/account ที่ไม่ใช่จุดล้มเหลวเดียวกับ VPS. ทดสอบ restore โดยไม่แก้ retention. ([AWS S3 Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html)) |
| health-check failover | Cloudflare Load Balancing monitor ตรวจ endpoint เป็นช่วง ๆ; เมื่อ pool unhealthy ระบบนำ pool ออกจาก endpoint rotation. เวลา interval/timeout/retry มีผลต่อเวลาตรวจพบและ failover. | ทำ endpoint เช่น `/healthz` ที่ตรวจ dependency สำคัญแต่ไม่เปิดข้อมูลลับ; ตั้ง expected HTTP `2xx`, interval/timeout/retry ตาม RTO และทดสอบ false positive. ([Cloudflare monitors](https://developers.cloudflare.com/load-balancing/monitors/), [การตั้ง monitor](https://developers.cloudflare.com/load-balancing/monitors/create-monitor/)) |
| RTO/RPO | RPO คือช่องว่างข้อมูลสูงสุดที่ยอมรับได้ระหว่าง DR site กับข้อมูลล่าสุดขณะเกิดภัยพิบัติ; RTO คือเวลาหยุดให้บริการสูงสุดที่ยอมรับได้ก่อนกู้บริการ. | ให้เจ้าของธุรกิจกำหนดค่าเป็นนาที/ชั่วโมงต่อ workflow สำคัญก่อนเลือกระดับ standby, backup frequency และ automation. ([AWS DR glossary](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-of-on-premises-applications-to-aws/appendix-a-glossary.html)) |

## แบบสถาปัตยกรรมที่แนะนำ

```text
ผู้ใช้
  |
  v
DNS/CDN/WAF + Load Balancer + Health monitor
  |                         |
  | ปกติ                    | เมื่อ Production unhealthy
  v                         v
VPS-A: PHP/Nginx (active)   VPS-B: PHP/Nginx (warm standby)
  | write                       | write หลัง promote เท่านั้น
  v                             v
MySQL-A: source  -- GTID replication -->  MySQL-B: read-only replica
  |
  +---------- encrypted/versioned offsite object storage ----------+
       database backup + binary logs + uploads + deployment artifact
```

ข้อกำหนดที่ประกอบกัน:

1. **แยก failure domain** — VPS-A และ VPS-B ควรแยก availability zone หรือผู้ให้บริการ
   หากความเสี่ยงและงบรองรับ; backup ต้องอยู่นอกทั้งสอง VPS.
2. **แยก state ของแอป** — app ทั้งสองใช้ release เดียวกันและ environment-specific secrets;
   session และไฟล์อัปโหลดต้องเป็น shared/replicated state. ถ้ายังใช้ file-based PHP session
   อยู่ ผู้ใช้ที่สลับเครื่องอาจต้อง login ใหม่; ต้องเลือกว่าจะยอมรับพฤติกรรมนี้ชั่วคราว หรือ
   ย้าย session ไป Redis/database ที่เหมาะกับ HA.
3. **ป้องกัน split brain** — ก่อน promote MySQL-B ให้ fence/quarantine MySQL-A และถอน
   เครื่องเก่าออกจาก load balancer เพื่อไม่ให้สอง node รับ write พร้อมกัน. จากนั้นตรวจ
   replication health/GTID, promote และเปลี่ยน application DB role. GTID ช่วยระบุและ
   ติดตาม transaction แต่ไม่ทดแทน runbook หรือ quorum/fencing.
4. **ไม่ใช้ replica แทน backup** — replication สามารถส่งการลบผิดพลาดหรือข้อมูลเสียไปยัง
   replica ได้; จึงยังต้องมี backup ที่แยกอยู่และ PITR.

## เป้าหมายบริการที่เสนอเพื่อใช้ตัดสินใจ

ตัวเลขต่อไปนี้เป็น **ข้อเสนอเริ่มต้น** ไม่ใช่ SLA ที่มาจากผู้ให้บริการ:

| ระดับ | กลไก | RTO เป้าหมาย | RPO เป้าหมาย | เหมาะเมื่อ |
|---|---|---:|---:|---|
| ขั้นต่ำ | backup offsite + runbook กู้คืนด้วยมือ | 4–8 ชั่วโมง | 24 ชั่วโมง หรือตามรอบ backup | ระบบข้อมูลไม่เปลี่ยนบ่อยและรับ downtime ได้ |
| Warm standby | VPS สำรองพร้อมแอป, async GTID replica, LB/manual approval | 30–60 นาที | ไม่เกิน 15 นาที (ต้อง monitor lag ให้พิสูจน์ได้) | พอร์ทัลสมาชิก/งานธุรการทั่วไป |
| แนะนำ | warm standby + monitored failover + shared object storage/session + full backup และ binlog offsite | 10–15 นาที | 5–15 นาที | บริการสมาชิกที่ต้องกลับมาเร็วและต้องลดข้อมูลสูญหาย |
| ความสำคัญสูง | managed multi-AZ/cluster หรือออกแบบ consensus ที่เหมาะสม + automation ผ่านการซ้อม | ต้องวัดจาก drill | ใกล้ศูนย์ตาม SLA ที่เลือก | ธุรกรรมที่ไม่ยอมเสียข้อมูล; ต้องประเมินงบ/ความซับซ้อน |

RTO/RPO เป็นเป้าหมายธุรกิจ ไม่ใช่คุณสมบัติที่เกิดขึ้นเองจากการมี VPS สองเครื่อง; AWS
แนะนำให้กำหนด objective ก่อนเพื่อใช้วัดความทนทานของ workload และให้ทดสอบ DR
implementation เพื่อยืนยันว่าเป็นไปตามที่ออกแบบ
([AWS resilience objectives](https://docs.aws.amazon.com/prescriptive-guidance/latest/resilience-lifecycle-framework/stage-1.html),
[AWS Reliability Pillar PDF](https://docs.aws.amazon.com/pdfs/wellarchitected/latest/reliability-pillar/wellarchitected-reliability-pillar.pdf)).

## Runbook failover ที่ควรมี

1. Alert/ผู้ปฏิบัติยืนยันว่าเป็น failure จริง ไม่ใช่ health-check ผิดพลาด; บันทึกเวลาเริ่มเหตุ.
2. สำหรับเหตุ compromise ให้ตัด Production ออกจาก WAF/load balancer และเครือข่ายก่อน;
   อย่า promote โดยไม่ประเมินว่า credential หรือข้อมูลถูกโจมตีไปถึง Standby หรือไม่.
3. Fence primary เดิม: ปิดเส้นทาง write และยืนยันว่า MySQL เดิมจะไม่กลับมารับ write.
4. ตรวจ replication thread, replication lag และ executed GTID ของ replica; บันทึก RPO
   ที่คาดว่าจะสูญหาย.
5. Promote standby, เปลี่ยน DB endpoint/role ของแอป, และอนุญาต write ที่ node ใหม่เพียงตัวเดียว.
6. ให้ load balancer route ไป Standby; ทำ smoke test อย่างน้อยหน้าเว็บ, API read,
   login, transaction write และ upload/download.
7. หลังระบบเสถียร ให้ rebuild เครื่องเก่าเป็น replica ของ primary ใหม่, rotate secrets ที่
   เกี่ยวข้อง และทำ reconciliation/audit. ห้าม failback ก่อนข้อมูล sync และผ่านการตรวจสอบ.

## Checklist การทดสอบและหลักฐานรับมอบ

- [ ] คืน full backup ไปยัง MySQL เครื่องใหม่ แล้วเปรียบเทียบ schema, row count และ
  flow สำคัญ; ทดสอบ PITR จาก binary log ไปยังเวลาที่กำหนด.
- [ ] กู้ไฟล์ upload และตรวจ version/retention ของ object storage; ทดสอบว่าการลบ object
  ถูกป้องกันตาม policy โดยไม่พยายามทำลายข้อมูลจริง.
- [ ] จำลอง Nginx/PHP ล่ม, MySQL source ล่ม และ network isolation; วัด detection,
  fence, promote และ user-visible recovery time.
- [ ] ยืนยันว่า alert ส่งถึงเจ้าหน้าที่: site/API down, replication lag, backup ล้มเหลวหรือ
  backup เก่าเกินเกณฑ์, disk เต็ม และ certificate ใกล้หมดอายุ.
- [ ] ทดสอบ WAF/rate-limit และยืนยัน origin firewall รับเฉพาะ WAF/load balancer และ
  ช่องทางผู้ดูแลที่อนุญาต.
- [ ] บันทึกค่า RTO/RPO ที่วัดจริงจาก drill, ช่องว่างจากเป้าหมาย, ผู้รับผิดชอบ และวันซ้อม
  ครั้งถัดไป. ควรทำ restore test อย่างน้อยรายเดือน และ DR/failover drill รายไตรมาส.

## ข้อสังเกตเฉพาะ repository ณ วันที่ตรวจ

- `DEPLOYMENT.md` ระบุ Nginx + PHP-FPM 8.4 + MySQL 8+ และ cron เรียก
  `php bin/console backup:run` วันละครั้ง.
- `bin/console` เขียน SQL dump แบบ plaintext ลง `storage/backups` ใน local VPS;
  จึงต้องย้าย responsibility การเข้ารหัส, offsite upload, retention และ restore verification
  ไปยัง backup workflow ที่ได้รับการดูแล.
- `app/Core/Session.php` ใช้ native `session_start()` โดยยังไม่ได้กำหนด session store
  แบบ shared; ต้องตัดสินใจเรื่อง session continuity ก่อนเปิด active-active application routing.
- ไฟล์ upload มีทั้งเส้นทาง `storage/uploads` และ `public/storage/uploads` ในโค้ด;
  ควรทำให้มี source of truth เดียวก่อนออกแบบ replication/object storage.
