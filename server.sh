#!/data/data/com.termux/files/usr/bin/bash

# ============================================================
# FOYSAL TOOLS - TERMUX QUICK-LAUNCH SERVER
# ============================================================

PORT=8080
DIR="/data/data/com.termux/files/home/foysal-tools"

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
PURPLE='\033[0;35m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear
echo -e "${CYAN}======================================================"
echo -e "       ⚡ FOYSAL TOOLS - CYBER ADMIN PANEL ⚡         "
echo -e "======================================================${NC}"
echo -e "${PURPLE}[+] Environment: Termux / Android Local Host${NC}"
echo -e "${PURPLE}[+] Target Path: ${DIR}${NC}"
echo ""

cd "$DIR" || exit 1

# Check if port is in use, if so increment
is_port_in_use() {
    if command -v python3 >/dev/null 2>&1; then
        python3 -c "import socket, sys; s = socket.socket(); sys.exit(0 if s.connect_ex(('127.0.0.1', int(sys.argv[1]))) == 0 else 1)" "$1" 2>/dev/null
    elif command -v netstat >/dev/null 2>&1; then
        netstat -tuln 2>/dev/null | grep -q ":$1 "
    else
        return 1
    fi
}

while is_port_in_use "$PORT"; do
    PORT=$((PORT + 1))
done

# Detect local IP
LOCAL_IP="127.0.0.1"
if command -v ifconfig >/dev/null 2>&1; then
    WLAN_IP=$(ifconfig wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}' | tr -d 'addr:')
    if [ -n "$WLAN_IP" ]; then
        LOCAL_IP="$WLAN_IP"
    fi
fi

# Check available web servers: PHP or Python
SERVER_CMD=""

if command -v python3 >/dev/null 2>&1 && [ -f "$DIR/backend.py" ]; then
    echo -e "${GREEN}[✔] Python 3 Engine detected! Launching Foysal Tools Native Python 3 Server...${NC}"
    SERVER_CMD="python3 $DIR/backend.py $PORT"
elif command -v php >/dev/null 2>&1; then
    echo -e "${GREEN}[✔] PHP detected! Launching with PHP Development Server...${NC}"
    SERVER_CMD="php -S 0.0.0.0:$PORT"
elif command -v python3 >/dev/null 2>&1; then
    echo -e "${GREEN}[✔] Python 3 detected! Launching with Python HTTP Server...${NC}"
    SERVER_CMD="python3 -m http.server $PORT"
else
    echo -e "${YELLOW}[!] Neither PHP nor Python is installed.${NC}"
    echo -e "${CYAN}[*] Installing Python automatically in Termux...${NC}"
    pkg install -y python
    SERVER_CMD="python3 $DIR/backend.py $PORT"
fi

echo ""
echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}  Foysal Tools Server is RUNNING successfully!${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "${YELLOW}  👉 Localhost:   http://localhost:$PORT${NC}"
echo -e "${YELLOW}  👉 Localhost:   http://127.0.0.1:$PORT${NC}"
if [ "$LOCAL_IP" != "127.0.0.1" ]; then
echo -e "${YELLOW}  👉 Network LAN: http://$LOCAL_IP:$PORT${NC}"
fi
echo -e "${CYAN}------------------------------------------------------${NC}"
echo -e "  To open in HopWeb: Open folder ~/foysal-tools and run."
echo -e "  Press ${RED}[CTRL + C]${NC} to stop the server."
echo -e "${GREEN}======================================================${NC}"
echo ""

# Execute server
$SERVER_CMD
