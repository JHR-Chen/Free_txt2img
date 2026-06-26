@echo off
set "APP_DIR=D:\Project\Free_txt2img\app"
set "APP_URL=http://localhost:8765"

cd /d "%APP_DIR%"
start "" cmd /c "npm start"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$url = '%APP_URL%';" ^
  "for ($i = 0; $i -lt 60; $i++) {" ^
  "  try {" ^
  "    $res = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 1;" ^
  "    if ($res.StatusCode -eq 200) { Start-Process $url; exit 0 }" ^
  "  } catch {}" ^
  "  Start-Sleep -Seconds 1" ^
  "}" ^
  "exit 1"
