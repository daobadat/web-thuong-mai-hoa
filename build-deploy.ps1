#!/usr/bin/env pwsh
# =========================================================
# Script Deploy: Build Angular → Copy vào NodeJS/public
# Chạy tại thư mục gốc: .\build-deploy.ps1
# =========================================================

$ErrorActionPreference = "Stop"

$ROOT_DIR     = Split-Path -Parent $MyInvocation.MyCommand.Path
$ANGULAR_DIR  = Join-Path $ROOT_DIR "angular-app"
$NODEJS_DIR   = Join-Path $ROOT_DIR "NodeJS-Core-main"
$ANGULAR_DIST = Join-Path $ANGULAR_DIR "dist\angular-app"
$NODEJS_PUBLIC = Join-Path $NODEJS_DIR "public"

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   KFlowerVN Deploy Script" -ForegroundColor Cyan
Write-Host "   Domain: kflowervn.site" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build Angular Production
Write-Host "[1/3] Building Angular production..." -ForegroundColor Yellow
Set-Location $ANGULAR_DIR
npm run build -- --configuration production
if ($LASTEXITCODE -ne 0) {
    Write-Host "Angular build FAILED!" -ForegroundColor Red
    exit 1
}
Write-Host "Angular build OK!" -ForegroundColor Green

# Step 2: Xóa public cũ, copy dist mới
Write-Host ""
Write-Host "[2/3] Copying dist to NodeJS-Core-main/public..." -ForegroundColor Yellow
if (Test-Path $NODEJS_PUBLIC) {
    Remove-Item -Recurse -Force $NODEJS_PUBLIC
    Write-Host "Cleaned old public/ folder"
}
Copy-Item -Recurse $ANGULAR_DIST $NODEJS_PUBLIC
Write-Host "Copy OK!" -ForegroundColor Green

# Step 3: Thống kê
$fileCount = (Get-ChildItem $NODEJS_PUBLIC -Recurse -File).Count
Write-Host ""
Write-Host "[3/3] Summary:" -ForegroundColor Yellow
Write-Host "  Angular files in public/: $fileCount files" -ForegroundColor White
Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "  DONE! San sang upload len hosting" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Buoc tiep theo:" -ForegroundColor Cyan
Write-Host "  1. Zip toan bo thu muc NodeJS-Core-main/" -ForegroundColor White
Write-Host "  2. Upload len hosting qua cPanel File Manager hoac FTP" -ForegroundColor White
Write-Host "  3. Tao database MySQL trong cPanel > MySQL Databases" -ForegroundColor White
Write-Host "  4. Import file thuong_mai_hoa.sql vao phpMyAdmin" -ForegroundColor White
Write-Host "  5. Tao file .env tren server (xem DEPLOY_GUIDE.md)" -ForegroundColor White
Write-Host "  6. Cai Node.js App trong cPanel, startup file: server.js" -ForegroundColor White
Write-Host "  7. Run NPM Install tren cPanel" -ForegroundColor White
Write-Host ""
Write-Host "Xem huong dan chi tiet: DEPLOY_GUIDE.md" -ForegroundColor Yellow
