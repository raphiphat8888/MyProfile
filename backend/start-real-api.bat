@echo off
setlocal

echo Starting SSH tunnel to the real Cloud MySQL database...
start "SSH MySQL Tunnel" cmd /k "ssh -p 2222 -o ExitOnForwardFailure=yes -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -N -L 3307:127.0.0.1:3306 std6730202386@119.59.102.161"

echo.
echo Enter the SSH password in the new tunnel window.
echo Wait until the tunnel is connected, then press any key here.
pause

echo Starting the real API on http://localhost:3037 ...
npm.cmd start

endlocal
