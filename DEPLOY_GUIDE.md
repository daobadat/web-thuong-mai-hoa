# 🌸 Hướng dẫn Deploy KFlowerVN lên kflowervn.site

## Tổng quan kiến trúc

```
kflowervn.site
    └── Node.js App (cPanel Node.js App Manager)
          ├── /public/          ← Angular build (frontend)
          ├── /routes/          ← API routes
          ├── /modules/         ← Business logic
          ├── server.js         ← Entry point
          └── .env              ← Cấu hình production
```

---

## BƯỚC 1: Build Angular + Chuẩn bị files (Máy Local)

```powershell
# Mở PowerShell tại thư mục gốc, chạy script
.\build-deploy.ps1
```

---

## BƯỚC 2: Tạo Database trên Hosting

1. Đăng nhập **cPanel** → https://103.124.95.161:2083
2. **MySQL Databases** → Tạo database mới: `nhkflopj_flower_shop`
3. Tạo user MySQL mới + gán vào database với **All Privileges**
4. **phpMyAdmin** → chọn database → **Import** file `thuong_mai_hoa.sql`

---

## BƯỚC 3: Upload Files lên Hosting

### Nén thư mục (KHÔNG bao gồm node_modules, .env)
```powershell
# Nén để upload
Compress-Archive -Path "NodeJS-Core-main\*" -DestinationPath "kflowervn-deploy.zip" -CompressionLevel Optimal
```

### Upload qua cPanel File Manager
1. cPanel → **File Manager** → `/home/nhkflopj/`
2. Upload `kflowervn-deploy.zip` → Giải nén
3. Đổi tên thành `NodeJS-Core-main` (hoặc tên bạn muốn)

### Upload qua FTP
- **Host:** 103.124.95.161 | **Port:** 21
- **Username:** nhkflopj

---

## BƯỚC 4: Cấu hình Node.js App trên cPanel

1. cPanel → **"Setup Node.js App"**
2. **"Create Application"**:
   - **Node.js version:** 20.x
   - **Application mode:** Production
   - **Application root:** `/home/nhkflopj/NodeJS-Core-main`
   - **Application URL:** `kflowervn.site`
   - **Application startup file:** `server.js`
3. Click **Create**

---

## BƯỚC 5: Tạo file `.env` trên server

Trong File Manager, tạo file `.env` tại `/home/nhkflopj/NodeJS-Core-main/.env`:

```env
DEBUG=false
NODE_ENV=production

DATABASE_ENV=production
PROD_DB_HOSTNAME=localhost
PROD_DB_PORT=3306
PROD_DB_NAME=nhkflopj_flower_shop
PROD_DB_USERNAME=nhkflopj_user
PROD_DB_PASSWORD=MAT_KHAU_DB_CUA_BAN

JWT_SECRET_KEY=5bcd48da6f71070e031452ac8b5bb17a4eabd99f789ac98656a331978dfe7991

FRONTEND_URL=https://kflowervn.site
DATABASE_SOCKET=
```

---

## BƯỚC 6: Cài Dependencies & Khởi động

Trong cPanel Node.js App → click **"Run NPM Install"**  
→ Sau đó click **"Restart"**

---

## BƯỚC 7: Kiểm tra

| URL | Kết quả |
|-----|---------|
| https://kflowervn.site | Trang Angular (Frontend) |
| https://kflowervn.site/api-docs | Swagger Docs |
| https://kflowervn.site/auth/login (POST) | API Login |

---

## Troubleshooting

| Vấn đề | Giải pháp |
|--------|-----------|
| App không start | Node.js version >= 20 trong cPanel |
| Lỗi database connection | Kiểm tra .env - user phải có ALL PRIVILEGES |
| Angular 404 khi F5 | Đã được xử lý bằng SPA fallback trong index.js |
| CORS error | Thêm domain vào FRONTEND_URL trong .env |
