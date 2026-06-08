@echo off
echo Removing node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f package-lock.json
echo Running npm install...
call npm install
if errorlevel 1 (
  echo.
  echo Install failed. If you see ERR_INVALID_ARG_TYPE, rename this folder
  echo so the path has NO apostrophe, e.g. Yanis-Blessings-Website
  exit /b 1
)
echo Done.
exit /b 0