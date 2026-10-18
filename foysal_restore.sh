#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# FOYSAL TOOLS - 1-CLICK DISASTER RECOVERY & LAUNCH SCRIPT
# ============================================================
clear
echo -e "\033[0;36m======================================================"
echo -e "       ⚡ FOYSAL TOOLS - FULL RESTORE & LAUNCH ⚡     "
echo -e "======================================================\033[0m"
echo -e "\033[0;32m[+] Starting automatic recovery process...\033[0m"

# 1. Ensure storage permission
if [ ! -d "$HOME/storage" ]; then
    echo -e "\033[1;33m[*] Requesting Termux storage permission...\033[0m"
    termux-setup-storage -y 2>/dev/null || true
    sleep 1
fi

# 2. Install required packages
echo -e "\033[0;36m[*] Verifying Python and Tar packages...\033[0m"
pkg update -y 2>/dev/null || true
pkg install -y python python-pip git tar curl
pip install requests 2>/dev/null || true

# 3. Locate backup archive on device internal storage
ARCHIVE=""
for p in "/sdcard/Download/foysal-tools-backup.tar.gz" "/sdcard/foysal-tools-backup.tar.gz" "$HOME/storage/downloads/foysal-tools-backup.tar.gz" "/storage/emulated/0/Download/foysal-tools-backup.tar.gz"; do
    if [ -f "$p" ]; then
        ARCHIVE="$p"
        break
    fi
done

if [ -n "$ARCHIVE" ]; then
    echo -e "\033[0;32m[✔] Found permanent phone backup archive:\033[0m $ARCHIVE"
    cd "$HOME" || exit 1
    tar -xzf "$ARCHIVE"
    echo -e "\033[0;32m[✔] All Foysal Tools files restored cleanly!\033[0m"
else
    echo -e "\033[0;31m[!] No backup archive found in Download. Checking existing directory...\033[0m"
fi

# 4. Launch server
if [ -d "$HOME/foysal-tools" ]; then
    cd "$HOME/foysal-tools" || exit 1
    chmod +x server.sh
    echo -e "\033[0;32m======================================================"
    echo -e "  [✔] Recovery Complete! Starting Foysal Tools Server..."
    echo -e "======================================================\033[0m"
    ./server.sh
else
    echo -e "\033[0;31m[✘] Could not locate ~/foysal-tools. Please ensure foysal-tools-backup.tar.gz is in /sdcard/Download/\033[0m"
fi
