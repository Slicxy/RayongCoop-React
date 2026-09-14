# Installation Guide — RayongCoop Digital Portal
### คู่มือการติดตั้งระบบสำหรับ Local Development & Test Server

คู่มือนี้แนะนำขั้นตอนการติดตั้งระบบ **RayongCoop Digital Portal** ทั้งในส่วน **React Frontend Application** และ **PHP / MySQL Backend Services** บนสภาพแวดล้อม Local Development (XAMPP / Laragon / Node.js)

---

## 1. ข้อกำหนดของระบบ (System Requirements)

- **Node.js**: เวอร์ชัน 18.x หรือ 20.x+ (แนะนำ LTS ล่าสุด)
- **NPM**: เวอร์ชัน 9.x+ หรือ 10.x+
- **PHP**: เวอร์ชัน 8.2 หรือ 8.4
  - ส่วนขยายที่ต้องเปิดใช้งาน: `pdo_mysql`, `openssl`, `mbstring`, `fileinfo`, `curl`, `json`, `gd`
- **Database**: MySQL 8.0+ หรือ MariaDB 10.4+
- **Composer**: เวอร์ชัน 2.x
- **Web Server (Backend / API)**: Apache 2.4+ (XAMPP) หรือ Nginx 1.24+

---

## 2. ขั้นตอนการติดตั้ง Frontend (React + Vite)

### 2.1 ติดตั้ง Node Modules
เปิด Terminal / PowerShell ในโฟลเดอร์โปรเจกต์:
```bash
npm install
```

### 2.2 เริ่มต้น Development Server
```bash
npm run dev
```
หลังจากรันคำสั่ง ระบบจะเปิด Development Server ที่:
👉 `http://localhost:5173/`

### 2.3 สร้าง Production Build (เมื่อต้องการ Deploy)
```bash
npm run build
```
ไฟล์ที่ผ่านการ Optimize และ Minify จะถูกสร้างขึ้นในโฟลเดอร์ `dist/`

---

## 3. ขั้นตอนการติดตั้ง Backend & Database (PHP MVC + MySQL)

### 3.1 ติดตั้ง PHP Dependencies และ Autoloader
```bash
composer install
composer dump-autoload
```

### 3.2 กำหนดค่าสภาพแวดล้อม (.env)
คัดลอกไฟล์ `.env.example` เป็น `.env` และตั้งค่าการเชื่อมต่อฐานข้อมูล MySQL:
```ini
APP_NAME="RayongCoop Digital Portal"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost/rayongcoop/public

DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rayongcoop_db
DB_USERNAME=root
DB_PASSWORD=
```

### 3.3 สร้างฐานข้อมูลและรัน Migration & Seeder
ใช้คำสั่ง CLI `bin/console`:
```bash
# 1. สร้างฐานข้อมูล
php bin/console db:create

# 2. นำเข้าโครงสร้างตารางทั้งหมด (36 ตาราง)
php bin/console db:migrate

# 3. นำเข้าข้อมูลเริ่มต้น (Roles, Permissions, Super Admin, Products, Rates, Welfare)
php bin/console db:seed
```

---

## 4. บัญชีผู้ใช้งานเริ่มต้นสำหรับการทดสอบ (Default Test Accounts)

| บทบาท (Role) | Username / Email | รหัสผ่าน (Password) | สิทธิ์การใช้งาน (Permissions) |
|---|---|---|---|
| **Super Admin** | `admin` / `admin@rayongcoop.com` | `Admin@RayongCoop2026!` | เข้าถึงแดชบอร์ดผู้บริหารและจัดการระบบทั้งหมด |
| **Staff / Officer** | `staff` / `staff@rayongcoop.com` | `Staff@RayongCoop2026!` | Maker-Checker ตรวจสอบและอนุมัติคำขอกู้/สวัสดิการ |
| **Member** | `member` / `02541` (เลขสมาชิก) | `Member@RayongCoop2026!` | ตรวจสอบยอดเงินกู้ หุ้น เงินฝาก และยื่นคำขอ |

---

## 5. เอกสารคู่มืออื่นๆ ที่เกี่ยวข้อง
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) — คู่มือการนำขึ้นระบบ Production (Ubuntu + Nginx)
- 🔒 [SECURITY.md](./SECURITY.md) — นโยบายความมั่นคงปลอดภัยและ PDPA
- 💾 [BACKUP.md](./BACKUP.md) — คู่มือการสำรองข้อมูลและ Disaster Recovery
