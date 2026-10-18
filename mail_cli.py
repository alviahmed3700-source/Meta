#!/usr/bin/env python3
"""
FOYSAL TOOLS - AUTO MAIL & OTP CLI ENGINE (ULTRA ENTERPRISE)
Compatible with Termux & Linux
Syncs automatically with Foysal Tools Web Admin Panel & Meta Horizon Hub
"""

import os
import sys
import json
import time
import uuid
import re
import argparse
from datetime import datetime

try:
    import requests
except ImportError:
    print("\033[1;31m[!] 'requests' library not found. Installing via pip...\033[0m")
    os.system("pip install requests")
    import requests

# ANSI COLORS
CYAN = '\033[0;36m'
BOLD_CYAN = '\033[1;36m'
GREEN = '\033[0;32m'
BOLD_GREEN = '\033[1;32m'
YELLOW = '\033[1;33m'
RED = '\033[1;31m'
PURPLE = '\033[1;35m'
BLUE = '\033[0;34m'
NC = '\033[0m'

META_DIR = os.path.expanduser('~/META-HORIZONE')
CONFIG_FILE = os.path.join(META_DIR, 'mail_config.json')
HISTORY_FILE = os.path.join(META_DIR, 'mail_history.json')
ACCOUNTS_JSON = os.path.join(META_DIR, 'accounts', 'accounts.json')
ACCOUNTS_TXT = os.path.join(META_DIR, 'accounts', 'accounts.txt')

DEFAULT_HOTMAIL_KEY = "e47bd8443425bb40b48239f0e5befddfa8f86e3205909c0b"

def load_config():
    cfg = {
        'hotmail_api_key': DEFAULT_HOTMAIL_KEY,
        'default_product_id': 14,
        'auto_save_to_meta': True,
        'auto_watch_otp': True,
        'otp_timeout_sec': 60
    }
    if os.path.isfile(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                saved = json.load(f)
                if isinstance(saved, dict):
                    cfg.update(saved)
        except Exception: pass
    return cfg

def save_config(cfg):
    os.makedirs(META_DIR, exist_ok=True)
    with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
        json.dump(cfg, f, indent=2, ensure_ascii=False)

def load_history():
    if not os.path.isfile(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
            d = json.load(f)
            return d if isinstance(d, list) else []
    except Exception:
        return []

def save_history(history):
    os.makedirs(META_DIR, exist_ok=True)
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=2, ensure_ascii=False)

def sync_to_meta_hub(email, password, combo):
    if not email: return
    os.makedirs(os.path.join(META_DIR, 'accounts'), exist_ok=True)
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # JSON Hub
    accs = []
    if os.path.isfile(ACCOUNTS_JSON):
        try:
            with open(ACCOUNTS_JSON, 'r', encoding='utf-8') as f:
                accs = json.load(f)
        except Exception: pass

    if not any(a.get('uid') == email or a.get('number') == email for a in accs):
        accs.append({
            'uid': email,
            'name': 'Mail Account',
            'number': email,
            'password': password,
            'cookie': combo or 'MAIL_ORDERED',
            'created_at': now_str
        })
        with open(ACCOUNTS_JSON, 'w', encoding='utf-8') as f:
            json.dump(accs, f, indent=2, ensure_ascii=False)

    # TXT Hub
    with open(ACCOUNTS_TXT, 'a', encoding='utf-8') as f:
        f.write(f"{email}|{password}|{combo}|{email}|Mail Account|{now_str}\n")

def get_balance(api_key):
    try:
        r = requests.get(
            "https://hotmail143.com/api/v1/me",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            timeout=8
        )
        if r.status_code == 200:
            d = r.json()
            if d.get('success'):
                return d.get('data')
    except Exception as e:
        print(f"{RED}[!] Balance check error: {e}{NC}")
    return None

def get_products(api_key):
    try:
        r = requests.get(
            "https://hotmail143.com/api/v1/products",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            timeout=10
        )
        if r.status_code == 200:
            d = r.json()
            return d.get('data', [])
    except Exception as e:
        print(f"{RED}[!] Products fetch error: {e}{NC}")
    return []

def buy_mail(product_id=14, quantity=1, cfg=None):
    if not cfg: cfg = load_config()
    api_key = cfg.get('hotmail_api_key') or DEFAULT_HOTMAIL_KEY
    buy_url = "https://hotmail143.com/api/v1/orders"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Idempotency-Key": str(uuid.uuid4())
    }
    payload = {"product_id": int(product_id), "quantity": int(quantity)}

    print(f"\n{YELLOW}[*] Sending purchase request to Hotmail143 (PID: {product_id}, Qty: {quantity})...{NC}")
    try:
        resp = requests.post(buy_url, headers=headers, json=payload, timeout=60)
        data = resp.json() if resp.text.strip() else {}
        if not data.get('success'):
            err = data.get('error') or data.get('message') or resp.text
            print(f"{RED}[!] Order failed: {err}{NC}")
            return None

        accounts = data.get('data', {}).get('accounts', [])
        if not accounts:
            print(f"{RED}[!] No accounts returned from server.{NC}")
            return None

        history = load_history()
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        bought_items = []

        for raw in accounts:
            parts = str(raw).split('|')
            em = parts[0].strip() if len(parts) > 0 else ''
            pw = parts[1].strip() if len(parts) > 1 else ''
            rt = parts[2].strip() if len(parts) > 2 else ''

            entry = {
                'id': f"mail_{int(time.time()*1000)}_{len(bought_items)}",
                'email': em,
                'password': pw,
                'raw_account': str(raw).strip(),
                'product_id': product_id,
                'created_at': now_str,
                'otp_status': 'WAITING',
                'last_otp': '',
                'saved_to_meta': True
            }
            bought_items.append(entry)
            history.insert(0, entry)
            sync_to_meta_hub(em, pw, str(raw).strip())

        save_history(history)
        print(f"{BOLD_GREEN}[✔] Successfully purchased {len(bought_items)} account(s)!{NC}")
        for b in bought_items:
            print(f"  {CYAN}📧 Email:{NC}    {BOLD_GREEN}{b['email']}{NC}")
            print(f"  {CYAN}🔑 Password:{NC} {YELLOW}{b['password']}{NC}")
            print(f"  {CYAN}📄 Combo:{NC}    {b['raw_account']}")
        return bought_items[0] if bought_items else None

    except Exception as e:
        print(f"{RED}[!] Connection error: {e}{NC}")
        return None

def check_otp(email, cfg=None):
    if not cfg: cfg = load_config()
    api_key = cfg.get('hotmail_api_key') or DEFAULT_HOTMAIL_KEY

    email_str = str(email or '').strip()
    if '|' in email_str:
        email = email_str.split('|')[0].strip()
    else:
        email = email_str

    found_otp = None
    status_val = "WAITING"
    messages = []
    error_msg = None

    # Hotmail143 Native OTP Lookup
    # Endpoint: https://hotmail143.com/api/v1/otp-orders/lookup?email={email}
    try:
        h_url = f"https://hotmail143.com/api/v1/otp-orders/lookup?email={email}"
        h_headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        h_resp = requests.get(h_url, headers=h_headers, timeout=15)
        if h_resp.status_code == 200 and h_resp.text.strip():
            h_data = h_resp.json()
            if h_data.get('success'):
                order_info = h_data.get('data', {})
                code_val = str(order_info.get('code', '')).strip()
                status_val = str(order_info.get('status', 'PENDING')).strip()
                messages.append({"subject": f"Hotmail143 [{status_val.upper()}]", "body": f"Code: {code_val}"})
                if code_val and code_val.lower() not in ['none', 'null', '']:
                    found_otp = code_val
            else:
                error_msg = h_data.get('error', {}).get('message') or h_data.get('message', 'No order found')
        else:
            error_msg = f"HTTP {h_resp.status_code}"
    except Exception as e:
        error_msg = str(e)

    # Update history if found
    if found_otp or status_val != 'WAITING':
        history = load_history()
        for h in history:
            if h.get('email', '').lower() == email.lower():
                if found_otp:
                    h['last_otp'] = found_otp
                    h['otp_status'] = 'COMPLETED'
                else:
                    h['otp_status'] = status_val.upper()
                h['last_checked_at'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                break
        save_history(history)

    return {
        'found': bool(found_otp),
        'otp': found_otp or '',
        'code': found_otp or '',
        'status': status_val,
        'email': email,
        'messages': messages,
        'error': error_msg
    }

def auto_create_and_watch(product_id=14, cfg=None):
    if not cfg: cfg = load_config()
    bought = buy_mail(product_id=product_id, quantity=1, cfg=cfg)
    if not bought or not bought.get('email'):
        return

    email = bought['email']
    print(f"\n{YELLOW}[*] Waiting 20 seconds for Hotmail143 order propagation...{NC}")
    for i in range(20, 0, -1):
        sys.stdout.write(f"\r  ⏳ Checking in {i:2d} seconds... ")
        sys.stdout.flush()
        time.sleep(1)
    print("\r  ✔ 20s propagation elapsed. Starting Hotmail143 OTP poller!       \n")

    max_polls = 15
    for p in range(1, max_polls + 1):
        print(f"{CYAN}[Poll {p}/{max_polls}] Querying Hotmail143 for {email}...{NC}")
        res = check_otp(email, cfg=cfg)
        st = res.get('status', 'PENDING')
        if res.get('found') and res.get('otp'):
            print(f"\n{BOLD_GREEN}======================================================{NC}")
            print(f"{BOLD_GREEN}  🎉 OTP RECEIVED SUCCESSFULLY FROM HOTMAIL143!{NC}")
            print(f"{BOLD_GREEN}======================================================{NC}")
            print(f"  {BOLD_CYAN}📧 Email:{NC}    {bought['email']}")
            print(f"  {BOLD_CYAN}🔑 Password:{NC} {bought['password']}")
            print(f"  {BOLD_CYAN}📊 Status:{NC}   {BOLD_GREEN}{st}{NC}")
            print(f"  {YELLOW}⚡ OTP CODE:{NC} {BOLD_GREEN}{res['otp']}{NC}")
            print(f"{BOLD_GREEN}======================================================{NC}\n")
            return
        else:
            print(f"  {YELLOW}⏳ Hotmail143 Status: {st} (Code not yet available){NC}")

        time.sleep(4)

    print(f"\n{YELLOW}[!] Watcher window finished. You can run check_otp manually later.{NC}\n")

def print_banner():
    os.system('clear' if os.name == 'posix' else 'cls')
    print(f"{CYAN}======================================================{NC}")
    print(f"{BOLD_CYAN}       ⚡ FOYSAL TOOLS - AUTO MAIL & OTP CLI ⚡        {NC}")
    print(f"{CYAN}======================================================{NC}")
    print(f"{PURPLE}[+] Engine: Termux Native Python 3 / Enterprise Hub{NC}")
    print(f"{PURPLE}[+] Storage: ~/META-HORIZONE/accounts/{NC}\n")

def interactive_menu():
    cfg = load_config()
    while True:
        print_banner()
        bal = get_balance(cfg['hotmail_api_key'])
        if bal:
            b_val = bal.get('balance', 0)
            curr = bal.get('currency', 'BDT')
            em = bal.get('email', '')
            can_buy = int(b_val / 0.52)
            print(f"{BOLD_GREEN}💰 Balance: {b_val} {curr}{NC} ({em}) - {YELLOW}Can buy ~{can_buy} accounts (ID: 14){NC}\n")
        else:
            print(f"{YELLOW}💰 Balance: Offline / Unchecked{NC}\n")

        print(f"  {BOLD_GREEN}[1]{NC} ⚡ Auto-Create Mail & Watch OTP (1-Click)")
        print(f"  {BOLD_GREEN}[2]{NC} 🛒 Buy Mail Account Only (No Wait)")
        print(f"  {BOLD_GREEN}[3]{NC} 🔍 Check OTP / Read Messages for an Email")
        print(f"  {BOLD_GREEN}[4]{NC} 📦 View Available Mail Products & Stock")
        print(f"  {BOLD_GREEN}[5]{NC} 📂 View Purchased Mails History")
        print(f"  {BOLD_GREEN}[6]{NC} 🔄 Sync All Mails to Meta Horizon Accounts Hub")
        print(f"  {BOLD_GREEN}[7]{NC} ⚙️ Edit API Keys / Configuration")
        print(f"  {RED}[0]{NC} 🚪 Exit\n")

        choice = input(f"{BOLD_CYAN}Select option [0-7]: {NC}").strip()

        if choice == '1':
            pid = input(f"{CYAN}Enter Product ID (default 14): {NC}").strip() or "14"
            auto_create_and_watch(product_id=pid, cfg=cfg)
            input(f"\n{PURPLE}Press [Enter] to continue...{NC}")

        elif choice == '2':
            pid = input(f"{CYAN}Enter Product ID (default 14): {NC}").strip() or "14"
            qty = input(f"{CYAN}Quantity (default 1): {NC}").strip() or "1"
            buy_mail(product_id=pid, quantity=qty, cfg=cfg)
            input(f"\n{PURPLE}Press [Enter] to continue...{NC}")

        elif choice == '3':
            em = input(f"{CYAN}Enter target email: {NC}").strip()
            if em:
                print(f"\n{YELLOW}[*] Querying Hotmail143 Native OTP Engine for {em}...{NC}")
                res = check_otp(em, cfg=cfg)
                if res.get('found'):
                    if res.get('otp'):
                        print(f"\n{BOLD_GREEN}[✔] Hotmail143 OTP Found: {BOLD_CYAN}{res['otp']}{NC}")
                    msgs = res.get('messages', [])
                    print(f"Messages count: {len(msgs)}")
                    for m in msgs:
                        subj = m.get('subject', 'No Subject') if isinstance(m, dict) else 'Message'
                        print(f"  ✉️ {subj}")
                else:
                    print(f"{YELLOW}[!] No messages found yet.{NC}")
            input(f"\n{PURPLE}Press [Enter] to continue...{NC}")

        elif choice == '4':
            print(f"\n{YELLOW}[*] Fetching live products from Hotmail143...{NC}")
            prods = get_products(cfg['hotmail_api_key'])
            print(f"\n{'ID':<5} {'Title':<30} {'Price':<10} {'In Stock'}")
            print("-" * 55)
            for p in prods[:20]:
                stk = f"{GREEN}YES{NC}" if p.get('in_stock') else f"{RED}NO{NC}"
                print(f"{p.get('id'):<5} {str(p.get('title'))[:28]:<30} {str(p.get('price')) + ' BDT':<10} {stk}")
            input(f"\n{PURPLE}Press [Enter] to continue...{NC}")

        elif choice == '5':
            hist = load_history()
            print(f"\n{CYAN}=== Purchased Mails History ({len(hist)}) ==={NC}")
            for idx, h in enumerate(hist[:25], 1):
                otp_str = f"{BOLD_GREEN}{h.get('last_otp')}{NC}" if h.get('last_otp') else f"{RED}WAITING{NC}"
                print(f"[{idx:2d}] {h.get('email')} | Pass: {h.get('password')} | OTP: {otp_str} | {h.get('created_at')}")
            input(f"\n{PURPLE}Press [Enter] to continue...{NC}")

        elif choice == '6':
            hist = load_history()
            count = 0
            for h in hist:
                sync_to_meta_hub(h.get('email'), h.get('password'), h.get('raw_account'))
                count += 1
            print(f"\n{BOLD_GREEN}[✔] Synced {count} accounts to Meta Horizon Hub!{NC}")
            input(f"\n{PURPLE}Press [Enter] to continue...{NC}")

        elif choice == '7':
            print(f"\n{CYAN}=== Configuration Settings ==={NC}")
            k1 = input(f"Hotmail143 API Key [{cfg['hotmail_api_key'][:10]}...]: ").strip()
            if k1: cfg['hotmail_api_key'] = k1
            save_config(cfg)
            print(f"{BOLD_GREEN}[✔] Hotmail143 API Key saved!{NC}")
            time.sleep(1)

        elif choice == '0':
            print(f"\n{GREEN}Goodbye! Happy coding ⚡{NC}\n")
            break

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Foysal Tools Auto Mail & OTP CLI Engine")
    parser.add_argument('--auto', action='store_true', help="1-Click Auto buy & watch OTP")
    parser.add_argument('--buy', action='store_true', help="Buy mail account only")
    parser.add_argument('--otp', type=str, help="Check OTP for email")
    parser.add_argument('--pid', type=int, default=14, help="Product ID (default 14)")
    parser.add_argument('--balance', action='store_true', help="Show balance")
    parser.add_argument('--products', action='store_true', help="List products")
    args = parser.parse_args()

    c = load_config()
    if args.auto:
        auto_create_and_watch(product_id=args.pid, cfg=c)
    elif args.buy:
        buy_mail(product_id=args.pid, quantity=1, cfg=c)
    elif args.otp:
        res = check_otp(args.otp, cfg=c)
        print(json.dumps(res, indent=2))
    elif args.balance:
        b = get_balance(c['hotmail_api_key'])
        print(json.dumps(b, indent=2))
    elif args.products:
        p = get_products(c['hotmail_api_key'])
        print(json.dumps(p, indent=2))
    else:
        interactive_menu()
