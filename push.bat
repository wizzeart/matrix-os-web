@echo off
set msg=%~1
if "%msg%"=="" (
    set msg="Auto commit: Actualizacion de modulos Matrix OS"
)
git add .
git commit -m "%msg%"
git push origin main
echo ==================================================
echo SYNCHRONIZATION WITH THE MOTHERBOARD COMPLETE.
pause
