@echo off
echo Setting up SSH tunnel for MySQL connection...
echo Local port 3307 will forward to remote MySQL port 3306
echo.
echo Command: ssh -p 2222 -N -L 3307:localhost:3306 std6730202386@119.59.102.161
echo.
echo Keep this window open while using the application
echo Press Ctrl+C to stop the tunnel
echo.

ssh -p 2222 -o ExitOnForwardFailure=yes -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -N -L 3307:127.0.0.1:3306 std6730202386@119.59.102.161
