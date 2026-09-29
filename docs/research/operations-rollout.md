# หลักฐานสำหรับแผนปฏิบัติการ Production + Standby

วันที่ค้นคว้า: 28 กันยายน 2026
ขอบเขต: การปล่อยระบบ, secrets, การกู้คืน/สลับระบบ, runbook, บทบาท และเกณฑ์ยอมรับ สำหรับ RayongCoop Digital Portal

> เอกสารนี้ใช้แหล่งข้อมูลเจ้าของมาตรฐานหรือผลิตภัณฑ์โดยตรงเท่านั้น และแยกให้ชัดเจนระหว่าง “ข้อเท็จจริงจากแหล่งอ้างอิง” กับ “ข้อเสนอแนะสำหรับระบบนี้”

## ข้อเท็จจริงที่นำไปใช้ได้

### 1. การปล่อยระบบและการกำกับ release

- GitHub Actions รองรับ environment แยก เช่น `production`, `staging` และ `development`; สามารถกำหนดผู้อนุมัติ, จำกัด branch/tag ที่ deploy ได้, ใช้ protection rules และจำกัดการเข้าถึง secrets ตาม environment ได้ [GitHub: Deployment environments](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments)
- Job ที่อ้างอิง environment จะเข้าถึง environment secrets ได้เมื่อผ่าน protection rules และถูกส่งไปยัง runner แล้ว จึงเหมาะกับการแยก secret ของ Production ออกจากขั้น build/test [GitHub: Deployment environments](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments)

**ข้อเสนอแนะ:** ใช้ release tag/commit เดียวกันสร้าง artifact ของ React (`npm ci` และ `npm run build`) แล้ว deploy artifact เดียวกันทั้ง Production และ Standby; ให้ Production มี approval อย่างน้อยหนึ่งคนที่ไม่ใช่ผู้เริ่ม deploy และบันทึก deployment history. เอกสารนี้เสนอขั้นตอน ไม่ได้อ้างว่า GitHub เป็นข้อบังคับของโครงการ

### 2. Secrets และการตั้งค่า environment

- GitHub ระบุว่า secret ระดับ environment จะถูกอ่านเมื่อ job ที่อ้างอิง environment เริ่มทำงาน ขณะที่ repository/organization secrets ถูกอ่านตั้งแต่ workflow ถูก queue [GitHub: Secrets reference](https://docs.github.com/en/actions/reference/security/secrets)
- GitHub แนะนำไม่ใช้ structured data เป็นค่า secret เพื่อให้การ redact ใน log ทำงานได้ดีขึ้น และระบุว่า secret ชื่อเดียวกันหลายระดับจะยึดค่าระดับที่เจาะจงที่สุด [GitHub: Secrets reference](https://docs.github.com/en/actions/reference/security/secrets)

**ข้อเสนอแนะ:** เก็บค่า `.env` จริงนอก Git และแจกจ่ายจาก secret manager หรือ environment secrets เท่านั้น แยก credential ตามบทบาท (application, migration, backup, replication) และห้ามพิมพ์ secret/connection string ใน log. สำหรับระบบหลาย node ให้กำหนดและทดสอบค่า key ที่จำเป็นต่อการตรวจสอบ/ถอดรหัสร่วมกันอย่างระมัดระวัง โดยแยกรหัสผ่านฐานข้อมูลของแต่ละบทบาท.

### 3. ข้อมูลสำรองและการสลับฐานข้อมูล

- MySQL traditional replication เป็นรูปแบบ source-to-replica: source/primary commit transaction ก่อน และ transaction ถูกส่งไป replica แบบ asynchronous ภายหลัง ดังนั้น replica อาจตามหลัง source ได้ [MySQL Reference Manual: Source to Replica Replication](https://dev.mysql.com/doc/refman/8.4/en/group-replication-primary-secondary-replication.html) [MySQL Reference Manual: Replication overview](https://dev.mysql.com/doc/refman/8.4/en/replication.html)
- MySQL ระบุว่า semisynchronous replication เพิ่มจุด synchronization โดย primary รอ acknowledgment ว่า secondary ได้รับ transaction ก่อนจึงดำเนินการ commit ต่อ แต่ไม่ได้แทนการตรวจวัด replication lag และการทดสอบ failover [MySQL: Semisynchronous Replication](https://dev.mysql.com/doc/refman/8.4/en/replication-semisync-interface.html)
- NIST SP 800-34 Rev. 1 ระบุให้มีขั้นตอนตรวจสอบและยืนยันว่าข้อมูลถูกต้องและทันสมัย รวมถึงทดสอบการทำงานก่อนประกาศกลับสู่ normal operations; หลัง recovery ควรทำ full backup ใหม่และจัดเก็บนอกสถานที่ [NIST SP 800-34 Rev. 1, หน้า 79–80](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-34r1.pdf)

**ข้อเสนอแนะ:** วัด replication lag เทียบกับ RPO ทุกเวลา, ตั้ง Standby เป็น read-only ก่อน promote, และห้ามประกาศ failover สำเร็จจนกว่าจะผ่าน data validation และ smoke test ของ login, API, transaction และ upload. สำรอง database และ uploads ไปยังที่เก็บนอก VPS และทดสอบ restore บน environment แยก.

### 4. การซ้อมกู้คืน, Runbook และการประกาศกลับสู่บริการ

- NIST ระบุว่า validation ต้องครอบคลุมทั้ง data validity และ functionality; ตัวอย่าง functional test คือ login และทำงาน/ธุรกรรมจริงตามบทบาทผู้ใช้ [NIST SP 800-34 Rev. 1, หน้า 79](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-34r1.pdf)
- หลัง test และ validation ผ่าน ผู้มีอำนาจที่กำหนดควรประกาศ recovery complete; จากนั้นแจ้งผู้ใช้และผู้ประสานงานธุรกิจ/เทคนิคตามช่องทางที่กำหนดไว้ล่วงหน้า [NIST SP 800-34 Rev. 1, หน้า 79–80](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-34r1.pdf)
- NIST ระบุให้บันทึก recovery events: ผู้ปฏิบัติ, เวลาเริ่ม/จบ, ปัญหา, ผล data/functionality test, lessons learned และ after-action report พร้อมกำหนดความรับผิดชอบในการเก็บและอนุมัติเอกสาร [NIST SP 800-34 Rev. 1, หน้า 80](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-34r1.pdf)

**ข้อเสนอแนะ:** ซ้อม restore อย่างน้อยรายเดือนและซ้อม failover/failback รายไตรมาส โดยจับเวลาจริงเทียบ RTO/RPO. Runbook ต้องระบุผู้อนุมัติ switch, ผู้ทำ promotion, ผู้ทดสอบ, ช่องทางแจ้งสมาชิก, เงื่อนไข rollback และหลักฐานที่ต้องเก็บ.

### 5. เหตุโจมตีและการฟื้นฟูอย่างปลอดภัย

- CISA แบ่งวงจรตอบสนองเหตุเป็น preparation, detection and analysis, containment, eradication and recovery และ post-incident activities [CISA: Federal Government Cybersecurity Incident Response Playbooks](https://www.cisa.gov/sites/default/files/2024-08/Federal_Government_Cybersecurity_Incident_and_Vulnerability_Response_Playbooks_508C.pdf)
- CISA ระบุว่าเมื่อ containment สำเร็จควรเก็บรักษาหลักฐาน, ปรับ detection tools, แล้วจึงไปสู่ eradication; ในการ eradication อาจต้อง reimage จาก clean/gold source, สแกนยืนยันการกำจัด และเฝ้าระวังการกลับเข้ามา [CISA: Incident and Vulnerability Response Playbooks](https://www.cisa.gov/sites/default/files/publications/Cybersecurity_Incident_Vulnerability_Response_Playbooks_508C.pdf)
- CISA แนะนำให้ restore จาก offline/encrypted backup ตามลำดับความสำคัญของบริการ และระวังไม่ให้นำการติดเชื้อกลับเข้าสู่ระบบสะอาด; หลังเหตุให้บันทึก lessons learned เพื่อปรับแผนและการซ้อมครั้งต่อไป [CISA: #StopRansomware Guide](https://www.cisa.gov/stopransomware/ransomware-guide)

**ข้อเสนอแนะ:** แยก runbook “เครื่องล่ม” ออกจาก “สงสัยถูกเจาะ” โดยกรณีถูกเจาะต้อง isolate เครื่อง, เก็บหลักฐาน, หมุน credential และยืนยันว่า Standby/backup ปลอดภัยก่อน promote ไม่ควร failover ตาม health check เพียงอย่างเดียว.

## บทบาทที่ต้องกำหนดใน Runbook

| บทบาท | สิทธิ์และผลลัพธ์ที่ต้องรับผิดชอบ |
|---|---|
| Incident commander / เจ้าของระบบ | ประกาศระดับเหตุ, อนุมัติ failover/recovery declaration และการสื่อสารผู้ใช้ |
| DevOps | ดูแล deployment, DNS/load balancer, server health, promotion ตาม runbook และ rebuild node เดิม |
| DBA | ตรวจ replication lag/ความครบถ้วนของข้อมูล, promote database และยืนยัน restore |
| Security lead | ตัดสินใจ isolate, รักษาหลักฐาน, หมุน credential, ตรวจขอบเขตและความสะอาดก่อนกลับบริการ |
| Application QA | ทดสอบ data/functionality หลัง deploy และหลัง failover; ส่งผลยืนยันแก่ incident commander |
| Communications/Helpdesk | ส่งข้อความสถานะตาม template และเก็บผลกระทบที่ผู้ใช้แจ้ง |

บทบาทข้างต้นเป็นการนำหลักการ “กำหนดทีม/ผู้รับผิดชอบสำหรับ validation, notification และ event documentation” ของ NIST มาปรับใช้กับทีมนี้ ไม่ใช่รายชื่อตำแหน่งที่ NIST บังคับใช้.

## Runbook ขั้นต่ำที่ควรผ่านการซ้อม

1. **Production outage ที่ไม่ใช่เหตุความปลอดภัย:** ตรวจ health, ยืนยัน Standby และ lag อยู่ใน RPO, รับอนุมัติ, promote/switch, ทำ smoke test, ประกาศ recovery, บันทึกเหตุ และสร้าง Standby ใหม่
2. **Security incident:** isolate/contain, เก็บหลักฐาน, หยุด deploy, หมุน credential, ตรวจว่า Standby หรือ restore point สะอาด, กู้จาก trusted source, test, เฝ้าระวัง และทำ after-action review
3. **Backup/replication failure:** เปิด incident เมื่อเกิน RPO, แก้สาเหตุ, ทำ backup ใหม่, restore validation และไม่ปิดเหตุจนตรวจว่า artifact กู้ได้
4. **Release rollback:** ระงับ release ที่ผิดปกติ, กลับไป release artifact ก่อนหน้า, ใช้ migration ที่มีแผนย้อนหลังได้, ทำ smoke test และบันทึก version ที่ใช้งานจริง

## Acceptance criteria ที่ตรวจได้

- [ ] Production และ Standby เป็นคนละ VPS และมี baseline/เวอร์ชันระบบเดียวกัน
- [ ] ระบบ deploy จาก release ที่ระบุ commit/tag และมีผล build/test ก่อน deploy; Production ได้รับ approval ตามนโยบาย
- [ ] secrets ไม่อยู่ใน repository หรือ artifact และแต่ละ environment/บทบาทใช้สิทธิ์เท่าที่จำเป็น
- [ ] Database replica, backup และ upload backup มีสถานะที่ตรวจสอบได้; replication lag ไม่เกิน RPO ที่อนุมัติ
- [ ] กู้ข้อมูลบน environment แยกสำเร็จและ QA ยืนยัน data validity กับ functionality
- [ ] ซ้อม failover/failback ผ่านภายใน RTO และมีบันทึกเวลา, ผู้ปฏิบัติ, ผลทดสอบ และ RPO จริง
- [ ] เหตุโจมตีจำลองผ่านขั้น isolate, evidence retention, credential rotation, clean recovery และ post-incident review
- [ ] มีรายชื่อ on-call, authority matrix และช่องทางสื่อสารที่ทดสอบแล้ว

## ข้อจำกัดและการตัดสินใจที่ยังต้องอนุมัติ

- ต้องกำหนด RTO/RPO โดยเจ้าของธุรกิจก่อนเลือก replication แบบ asynchronous หรือ semisynchronous และก่อนกำหนดความถี่ backup
- ต้องเลือกผู้ให้บริการ DNS/load balancer, WAF/CDN, secret manager, object storage และระบบ monitoring ก่อนเขียนคำสั่ง deployment ที่ใช้งานจริง
- เอกสารโครงการปัจจุบันกล่าวถึง single-server backup/deployment เท่านั้น; ข้อเสนอข้างต้นยังไม่ใช่การยืนยันว่า session, uploads, cron หรือ MySQL configuration ปัจจุบันรองรับ multi-node แล้ว ต้องตรวจและปรับก่อนเปิด failover อัตโนมัติ
