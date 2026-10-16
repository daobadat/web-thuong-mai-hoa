#Requires -Version 5.1
<#
.SYNOPSIS
  Build Angular production -> dong bo vao NodeJS-Core-main/public -> zip de upload hosting.
.EXAMPLE
  .\build-deploy.ps1
  .\build-deploy.ps1 -SkipUploads    # lan deploy sau: khong dong goi public/uploads
#>
[CmdletBinding()]
param(
    [string]$AngularDirName = 'angular-app',
    [string]$NodeDirName    = 'NodeJS-Core-main',
    [switch]$SkipUploads
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Root       = $PSScriptRoot
$AngularDir = Join-Path $Root $AngularDirName
$NodeDir    = Join-Path $Root $NodeDirName
$NodePublic = Join-Path $NodeDir 'public'
$ZipOutput  = Join-Path $Root 'kflowervn-deploy.zip'

function Write-Step([string]$Msg) { Write-Host "`n$Msg" -ForegroundColor Yellow }

function Invoke-Native([string]$What, [scriptblock]$Cmd) {
    & $Cmd
    if ($LASTEXITCODE -ne 0) { throw "$What that bai (exit code $LASTEXITCODE)." }
}

try {
    Write-Host "`n====================================" -ForegroundColor Cyan
    Write-Host '   KFlowerVN Deploy Script'              -ForegroundColor Cyan
    Write-Host '   Domain: kflowervn.site'               -ForegroundColor Cyan
    Write-Host '===================================='    -ForegroundColor Cyan

    foreach ($p in @($AngularDir, $NodeDir)) {
        if (-not (Test-Path -LiteralPath $p)) { throw "Khong tim thay thu muc: $p" }
    }

    # ---------- [1/4] Build Angular ----------
    Write-Step '[1/4] Build Angular production...'
    Push-Location -LiteralPath $AngularDir
    try {
        Invoke-Native 'Angular build' { npm run build -- --configuration production }
    }
    finally { Pop-Location }

    # Tim thu muc chua index.html (Angular 16: dist/<app>, Angular 17+: dist/<app>/browser)
    $indexFile = Get-ChildItem -LiteralPath (Join-Path $AngularDir 'dist') -Recurse -File -Filter 'index.html' |
        Sort-Object { $_.FullName.Length } | Select-Object -First 1
    if (-not $indexFile) { throw 'Khong thay index.html trong dist (build loi hoac bat SSR?).' }
    $AngularDist = $indexFile.DirectoryName
    Write-Host "  Nguon dist: $AngularDist"

    # ---------- [2/4] Dong bo vao public/ (giu uploads) ----------
    Write-Step '[2/4] Dong bo dist -> NodeJS-Core-main/public/ (giu uploads)...'
    New-Item -ItemType Directory -Force -Path $NodePublic | Out-Null
    & robocopy $AngularDist $NodePublic /MIR /XD uploads /NFL /NDL /NJH /NJS /NP | Out-Null
    if ($LASTEXITCODE -ge 8) { throw "robocopy loi (exit code $LASTEXITCODE)." }   # 0-7 = thanh cong
    $global:LASTEXITCODE = 0
    if (-not (Test-Path -LiteralPath (Join-Path $NodePublic 'index.html'))) {
        throw 'public/ khong co index.html sau khi dong bo.'
    }
    Write-Host '  Copy OK!' -ForegroundColor Green

    # ---------- [3/4] Zip bang .NET (Unicode-safe, entry dung "/") ----------
    Write-Step '[3/4] Zip NodeJS-Core-main (bo node_modules, .env, .git, logs)...'
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem

    $excludeDirs  = @('node_modules', '.git', 'logs', 'coverage')
    $excludeFiles = @('.env', '.env.local', '.env.development')

    if (Test-Path -LiteralPath $ZipOutput) { Remove-Item -LiteralPath $ZipOutput -Force }

    $basePath = (Resolve-Path -LiteralPath $NodeDir).Path.TrimEnd('\') + '\'
    $added   = 0
    $current = ''
    $zip     = $null
    try {
        $zip   = [System.IO.Compression.ZipFile]::Open($ZipOutput, [System.IO.Compression.ZipArchiveMode]::Create)
        $stack = New-Object 'System.Collections.Generic.Stack[string]'
        $stack.Push($basePath.TrimEnd('\'))

        while ($stack.Count -gt 0) {
            $dir = $stack.Pop()
            foreach ($d in [System.IO.Directory]::GetDirectories($dir)) {
                if ($excludeDirs -notcontains [System.IO.Path]::GetFileName($d)) { $stack.Push($d) }
            }
            foreach ($f in [System.IO.Directory]::GetFiles($dir)) {
                $name = [System.IO.Path]::GetFileName($f)
                if ($excludeFiles -contains $name -or $name -like '*.log') { continue }
                $entry = $f.Substring($basePath.Length).Replace('\', '/')
                if ($SkipUploads -and $entry -like 'public/uploads/*') { continue }
                $current = $f
                [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                    $zip, $f, $entry, [System.IO.Compression.CompressionLevel]::Optimal)
                $added++
            }
        }
    }
    catch {
        if ($zip) { $zip.Dispose(); $zip = $null }
        if (Test-Path -LiteralPath $ZipOutput) { Remove-Item -LiteralPath $ZipOutput -Force }
        throw "Zip that bai tai file '$current': $($_.Exception.Message)"
    }
    finally { if ($zip) { $zip.Dispose() } }
    Write-Host "  Zip OK: $added file" -ForegroundColor Green

    # ---------- [4/4] Kiem tra noi dung zip ----------
    Write-Step '[4/4] Kiem tra noi dung zip...'
    $bad   = New-Object 'System.Collections.Generic.List[string]'
    $names = New-Object 'System.Collections.Generic.HashSet[string]'
    $za = [System.IO.Compression.ZipFile]::OpenRead($ZipOutput)
    try {
        foreach ($e in $za.Entries) {
            $n = $e.FullName
            [void]$names.Add($n)
            if ($n -match '(^|/)node_modules/' -or $n -match '(^|/)\.git/' -or $n -match '(^|/)\.env$') {
                $bad.Add($n)
            }
        }
    }
    finally { $za.Dispose() }

    if ($bad.Count -gt 0) {
        $bad | Select-Object -First 10 | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
        throw 'Zip chua file khong mong muon (node_modules / .git / .env).'
    }
    foreach ($req in @('server.js', 'package.json', 'public/index.html')) {
        if (-not $names.Contains($req)) { throw "Zip thieu file bat buoc: $req" }
    }

    $zipSize = [math]::Round((Get-Item -LiteralPath $ZipOutput).Length / 1MB, 2)
    Write-Host '  Kiem tra OK: khong co node_modules/.env/.git, du file bat buoc.' -ForegroundColor Green
    Write-Host "  Zip: $ZipOutput ($zipSize MB)" -ForegroundColor White
    if ($zipSize -gt 50) {
        Write-Host '  CANH BAO: zip > 50 MB. Kiem tra public/uploads, hoac dung -SkipUploads.' -ForegroundColor Red
    }

    Write-Host "`n====================================" -ForegroundColor Green
    Write-Host '  DONE! San sang upload len hosting'     -ForegroundColor Green
    Write-Host '====================================='   -ForegroundColor Green
    Write-Host @'

Buoc tiep theo:
  1. Upload kflowervn-deploy.zip len cPanel > File Manager (app root NGOAI public_html), giai nen
  2. cPanel > MySQL Databases: tao DB + user
  3. Local: mysqldump -u root -p --routines --single-transaction flower_shop > flower_shop.sql
     roi import vao phpMyAdmin tren hosting
  4. Tao .env tren server (tu .env.production, dien thong tin that)
  5. cPanel > Setup Node.js App: Node 20+, production, startup file server.js
  6. Run NPM Install > Restart
  7. Kiem tra: https://kflowervn.site/api/products
'@ -ForegroundColor White
}
catch {
    Write-Host "`nLOI: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}