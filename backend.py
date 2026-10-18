#!/usr/bin/env python3
"""
FOYSAL TOOLS - ADVANCED PYTHON 3 BACKEND SERVER & SECURITY ENGINE
Features:
- Pure Python 3 (zero external pip dependencies needed)
- Multi-Language Code Execution: Python 3, Java 17, Shell/Bash, PHP, Node.js
- Random Token Key & License Management with Device ID Hardware Locking
- Live Analytics: Usage Counters, User/Account Tracking, Expiry Management
- High-Performance Static Web Server with Fast MIME resolution
Compatible with: Termux & Android Localhost
Author: Foysal Tools Admin System
"""

import os
import sys
import json
import time
import uuid
import secrets
import mimetypes
import subprocess
import shutil
import datetime
import re
import requests
import imaplib
import email as email_pkg
from email.header import decode_header
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
SANDBOX_DIR = os.path.join(BASE_DIR, 'sandbox')
TOKENS_FILE = os.path.join(DATA_DIR, 'tokens.json')

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(SANDBOX_DIR, exist_ok=True)

# Helper to read tokens
def load_tokens():
    if not os.path.exists(TOKENS_FILE):
        return []
    try:
        with open(TOKENS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

# Helper to save tokens
def save_tokens(tokens):
    try:
        with open(TOKENS_FILE, 'w', encoding='utf-8') as f:
            json.dump(tokens, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[Error saving tokens]: {e}", file=sys.stderr)

# Helper: Random Token Key Generator
def generate_random_token_key(prefix="FOYSAL"):
    part1 = secrets.token_hex(2).upper()
    part2 = secrets.token_hex(2).upper()
    part3 = secrets.token_hex(2).upper()
    return f"{prefix}-{part1}-{part2}-{part3}"

# HTTP Request Handler
class FoysalServerHandler(BaseHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Device-ID')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def read_post_json(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                raw = self.rfile.read(content_length).decode('utf-8')
                return json.loads(raw)
        except Exception:
            pass
        return {}

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        # API: Status
        if path == '/api/status' or (path == '/api.php' and query.get('action', [''])[0] == 'status'):
            self.send_json({
                'status': 'online',
                'engine': 'Python 3 Native Core',
                'python_version': sys.version.split()[0],
                'server_time': time.strftime('%Y-%m-%d %H:%M:%S'),
                'platform': sys.platform,
                'tokens_count': len(load_tokens())
            })
            return

        # API: Get Tokens List with Live Analytics
        if path == '/api/tokens' or (path == '/api.php' and query.get('action', [''])[0] == 'get_tokens'):
            tokens = load_tokens()
            now = time.time()
            for t in tokens:
                # Calculate dynamic status
                if t.get('blocked'):
                    t['live_status'] = 'BLOCKED'
                elif t.get('expires_at') and t['expires_at'] < now:
                    t['live_status'] = 'EXPIRED'
                elif t.get('max_uses', 0) > 0 and t.get('used_count', 0) >= t['max_uses']:
                    t['live_status'] = 'DEPLETED'
                else:
                    t['live_status'] = 'ACTIVE'
            self.send_json({'success': True, 'tokens': tokens})
            return

        # API: Meta Horizon Status
        if path == '/api/meta/status' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_status'):
            self.handle_meta_status()
            return

        # API: Meta Horizon Accounts
        if path == '/api/meta/accounts' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_accounts'):
            self.handle_meta_accounts()
            return

        # API: Meta Horizon Password
        if path == '/api/meta/password' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_password'):
            self.handle_meta_get_password()
            return

        # API: Meta Horizon Mail Config
        if path == '/api/meta/mail/config' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_mail_config'):
            self.handle_meta_mail_config()
            return

        # API: Meta Horizon Mail Products
        if path == '/api/meta/mail/products' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_mail_products'):
            self.handle_meta_mail_products()
            return

        # API: Meta Horizon Mail History
        if path == '/api/meta/mail/history' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_mail_history'):
            self.handle_meta_mail_history()
            return

        # API: Meta Horizon Mail OTP (GET)
        if path == '/api/meta/mail/otp' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_mail_otp'):
            email = query.get('email', [''])[0] or query.get('uid', [''])[0]
            api_key = query.get('apikey', [''])[0]
            token = query.get('refresh_token', [''])[0] or query.get('token', [''])[0]
            cid = query.get('client_id', [''])[0]
            stype = query.get('type', ['facebook'])[0]
            raw = query.get('raw', [''])[0]
            pwd = query.get('password', [''])[0]
            self.handle_meta_mail_otp(email=email, custom_api_key=api_key, refresh_token=token, client_id=cid, service_type=stype, raw_account=raw, password=pwd)
            return

        # API: Termux Backup Status & Commands
        if path == '/api/termux/backup/status' or (path == '/api.php' and query.get('action', [''])[0] == 'termux_backup_status'):
            self.handle_termux_backup_status()
            return

        # API: Termux Create / Sync Backup (GET)
        if path == '/api/termux/backup/create' or (path == '/api.php' and query.get('action', [''])[0] == 'termux_backup_create'):
            self.handle_termux_backup_create()
            return

        # Static file handling
        self.serve_static(path)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)
        data = self.read_post_json()

        # API: Termux Create / Sync Backup (POST)
        if path == '/api/termux/backup/create' or (path == '/api.php' and query.get('action', [''])[0] == 'termux_backup_create'):
            self.handle_termux_backup_create()
            return

        # API: Execute Multi-Language Code (Python, Java, Shell, PHP, Node)
        if path == '/api/execute_code' or (path == '/api.php' and query.get('action', [''])[0] == 'execute_code'):
            self.handle_execute_code(data)
            return

        # API: Create New Token Key
        if path == '/api/tokens/create' or (path == '/api.php' and query.get('action', [''])[0] == 'create_token'):
            self.handle_create_token(data)
            return

        # API: Verify Token Key (when unlocking a tool)
        if path == '/api/tokens/verify' or (path == '/api.php' and query.get('action', [''])[0] == 'verify_token'):
            self.handle_verify_token(data)
            return

        # API: Toggle Block Key
        if path == '/api/tokens/toggle_block' or (path == '/api.php' and query.get('action', [''])[0] == 'toggle_block_token'):
            token_id = data.get('id')
            tokens = load_tokens()
            updated = False
            for t in tokens:
                if t.get('id') == token_id:
                    t['blocked'] = not t.get('blocked', False)
                    updated = True
                    break
            if updated:
                save_tokens(tokens)
                self.send_json({'success': True, 'message': 'Token status toggled!'})
            else:
                self.send_json({'success': False, 'error': 'Token not found.'}, status=404)
            return

        # API: Delete Token Key
        if path == '/api/tokens/delete' or (path == '/api.php' and query.get('action', [''])[0] == 'delete_token'):
            token_id = data.get('id')
            tokens = load_tokens()
            new_tokens = [t for t in tokens if t.get('id') != token_id]
            save_tokens(new_tokens)
            self.send_json({'success': True, 'message': 'Token key deleted.'})
            return

        # API: Save backup
        if path == '/api/save_backup' or (path == '/api.php' and query.get('action', [''])[0] == 'save_backup'):
            backup_file = os.path.join(DATA_DIR, 'backup_foysal_tools.json')
            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            self.send_json({'success': True, 'message': 'Backup saved to server disk.'})
            return

        # API: Meta Horizon Save Telegram Config
        if path == '/api/meta/telegram' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_telegram'):
            self.handle_meta_save_telegram(data)
            return

        # API: Meta Horizon Send Test Alert
        if path == '/api/meta/test_telegram' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_test_telegram'):
            self.handle_meta_test_telegram(data)
            return

        # API: Meta Horizon Add / Save Account
        if path == '/api/meta/account/add' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_add_account'):
            self.handle_meta_add_account(data)
            return

        # API: Meta Horizon Delete Account
        if path == '/api/meta/account/delete' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_delete_account'):
            self.handle_meta_delete_account(data)
            return

        # API: Meta Horizon Deduplicate Accounts
        if path == '/api/meta/account/deduplicate' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_deduplicate'):
            self.handle_meta_deduplicate()
            return

        # API: Meta Horizon Save Default Password
        if path == '/api/meta/password' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_save_password'):
            self.handle_meta_save_password(data)
            return

        # API: Meta Horizon Check UID
        if path == '/api/meta/check_uid' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_check_uid'):
            self.handle_meta_check_uid(data)
            return

        # API: Meta Horizon Clear Accounts
        if path == '/api/meta/clear_accounts' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_clear_accounts'):
            self.handle_meta_clear_accounts()
            return

        # API: Meta Horizon Mail Save Config
        if path == '/api/meta/mail/config' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_mail_save_config'):
            self.handle_meta_mail_save_config(data)
            return

        # API: Meta Horizon Mail Buy
        if path == '/api/meta/mail/buy' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_mail_buy'):
            self.handle_meta_mail_buy(data)
            return

        # API: Meta Horizon Mail OTP (POST)
        if path == '/api/meta/mail/otp' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_mail_otp'):
            email = data.get('email', '') or data.get('uid', '')
            api_key = data.get('apikey', '')
            token = data.get('refresh_token', '') or data.get('token', '')
            cid = data.get('client_id', '')
            stype = data.get('type', 'facebook')
            raw = data.get('raw_account', '') or data.get('raw', '')
            pwd = data.get('password', '')
            self.handle_meta_mail_otp(email=email, custom_api_key=api_key, refresh_token=token, client_id=cid, service_type=stype, raw_account=raw, password=pwd)
            return

        # API: Meta Horizon Mail Delete History
        if path == '/api/meta/mail/delete' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_mail_delete'):
            self.handle_meta_mail_delete(data)
            return

        # API: Meta Horizon Mail Save to Meta Accounts Hub
        if path == '/api/meta/mail/save_to_meta' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_mail_save_to_meta'):
            self.handle_meta_mail_save_to_meta(data)
            return

        # API: Meta Horizon Mail Clear History
        if path == '/api/meta/mail/clear_history' or (path == '/api.php' and query.get('action', [''])[0] == 'meta_mail_clear_history'):
            self.handle_meta_mail_clear_history()
            return

        self.send_json({'error': 'Endpoint not found'}, status=404)

    # EXECUTION HANDLER
    def handle_execute_code(self, data):
        language = str(data.get('language', 'python')).lower().strip()
        code = str(data.get('code', '')).strip()

        if not code:
            self.send_json({'success': False, 'error': 'No code provided.'})
            return

        start_time = time.time()
        file_id = f"foysal_{int(time.time()*1000)}"
        output = ""
        exit_code = 0

        try:
            if language in ['python', 'py', 'python3']:
                file_path = os.path.join(SANDBOX_DIR, f"{file_id}.py")
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(code)
                proc = subprocess.run(['python3', file_path], capture_output=True, text=True, timeout=25)
                output = proc.stdout + proc.stderr
                exit_code = proc.returncode
                try: os.remove(file_path)
                except Exception: pass

            elif language in ['bash', 'sh', 'shell']:
                file_path = os.path.join(SANDBOX_DIR, f"{file_id}.sh")
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write("#!/data/data/com.termux/files/usr/bin/bash\n" + code)
                os.chmod(file_path, 0o755)
                proc = subprocess.run(['bash', file_path], capture_output=True, text=True, timeout=25)
                output = proc.stdout + proc.stderr
                exit_code = proc.returncode
                try: os.remove(file_path)
                except Exception: pass

            elif language in ['java']:
                # Detect class name
                class_name = 'Main'
                import re
                m = re.search(r'public\s+class\s+([A-Za-z0-9_]+)', code)
                if m:
                    class_name = m.group(1)
                java_dir = os.path.join(SANDBOX_DIR, file_id)
                os.makedirs(java_dir, exist_ok=True)
                java_file = os.path.join(java_dir, f"{class_name}.java")
                with open(java_file, 'w', encoding='utf-8') as f:
                    f.write(code)

                compile_proc = subprocess.run(['javac', java_file], capture_output=True, text=True, timeout=20)
                if compile_proc.returncode != 0:
                    output = "Java Compilation Error:\n" + compile_proc.stderr
                    exit_code = compile_proc.returncode
                else:
                    run_proc = subprocess.run(['java', '-cp', java_dir, class_name], capture_output=True, text=True, timeout=20)
                    output = run_proc.stdout + run_proc.stderr
                    exit_code = run_proc.returncode

                # Cleanup
                import shutil
                try: shutil.rmtree(java_dir)
                except Exception: pass

            elif language in ['php']:
                file_path = os.path.join(SANDBOX_DIR, f"{file_id}.php")
                if not code.strip().startswith('<?php'):
                    code = "<?php\n" + code
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(code)
                proc = subprocess.run(['php', file_path], capture_output=True, text=True, timeout=25)
                output = proc.stdout + proc.stderr
                exit_code = proc.returncode
                try: os.remove(file_path)
                except Exception: pass

            else:
                output = f"Unsupported execution language: {language}"
                exit_code = 1

        except subprocess.TimeoutExpired:
            output = "[Execution Timeout]: Process killed after exceeding 25 seconds."
            exit_code = 124
        except Exception as err:
            output = f"[Execution Error]: {str(err)}"
            exit_code = 1

        exec_time = f"{round(time.time() - start_time, 3)}s"
        self.send_json({
            'success': (exit_code == 0),
            'language': language,
            'output': output if output else '[Execution completed with empty output]',
            'exit_code': exit_code,
            'execution_time': exec_time
        })

    # CREATE TOKEN HANDLER
    def handle_create_token(self, data):
        key = data.get('key', '').strip()
        if not key:
            prefix = data.get('prefix', 'FOYSAL').strip().upper() or 'FOYSAL'
            key = generate_random_token_key(prefix)

        tool_id = data.get('tool_id', 'all')
        tool_name = data.get('tool_name', 'All Tools (Master Key)')
        device_lock_mode = data.get('device_lock_mode', 'none') # none, specific, auto
        device_id = data.get('device_id', '').strip() if device_lock_mode == 'specific' else ''
        max_users = int(data.get('max_users', 0) or 0)
        max_uses = int(data.get('max_uses', 0) or 0)
        expiry_type = data.get('expiry_type', 'lifetime')
        notes = data.get('notes', '').strip()

        # Calculate expires_at timestamp
        now = time.time()
        expires_at = None
        if expiry_type == '1h':
            expires_at = now + 3600
        elif expiry_type == '2h':
            expires_at = now + 7200
        elif expiry_type == '12h':
            expires_at = now + 43200
        elif expiry_type == '24h':
            expires_at = now + 86400
        elif expiry_type == '48h':
            expires_at = now + 172800
        elif expiry_type == '72h':
            expires_at = now + 259200
        elif expiry_type == '7d':
            expires_at = now + (86400 * 7)
        elif expiry_type == '30d':
            expires_at = now + (86400 * 30)
        elif expiry_type == 'custom':
            try:
                hours = float(data.get('custom_hours', 0) or 0)
                if hours > 0:
                    expires_at = now + (hours * 3600)
            except Exception:
                pass

        new_token = {
            'id': f"key_{int(time.time()*1000)}",
            'key': key,
            'tool_id': tool_id,
            'tool_name': tool_name,
            'device_lock_mode': device_lock_mode,
            'device_id': device_id,
            'max_users': max_users,
            'max_uses': max_uses,
            'expiry_type': expiry_type,
            'expires_at': expires_at,
            'created_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'used_count': 0,
            'active_accounts': 0,
            'used_devices': [],
            'blocked': False,
            'notes': notes
        }

        tokens = load_tokens()
        tokens.insert(0, new_token)
        save_tokens(tokens)

        self.send_json({
            'success': True,
            'token': new_token,
            'message': f"Token Key '{key}' created successfully!"
        })

    # VERIFY TOKEN HANDLER (WHEN USER ACCESSES PROTECTED TOOL)
    def handle_verify_token(self, data):
        key = data.get('key', '').strip()
        tool_id = data.get('tool_id', '').strip()
        user_device_id = data.get('device_id', '').strip()

        if not key:
            self.send_json({'success': False, 'error': 'Please enter a valid Token Key.'})
            return

        tokens = load_tokens()
        target = None
        for t in tokens:
            if t.get('key', '').strip().upper() == key.upper():
                target = t
                break

        if not target:
            self.send_json({'success': False, 'error': 'Invalid Token Key. Key not recognized.'})
            return

        # Check blocked
        if target.get('blocked'):
            self.send_json({'success': False, 'error': 'Access Denied: This Token Key has been blocked/revoked by Admin.'})
            return

        # Check expiration
        now = time.time()
        if target.get('expires_at') and target['expires_at'] < now:
            self.send_json({'success': False, 'error': 'Token Expired: This key has passed its expiration time.'})
            return

        # Check usage limit
        max_uses = target.get('max_uses', 0)
        used_count = target.get('used_count', 0)
        if max_uses > 0 and used_count >= max_uses:
            self.send_json({'success': False, 'error': f'Usage Limit Reached: Key was limited to {max_uses} runs.'})
            return

        # Check tool scope
        if target.get('tool_id') != 'all' and tool_id and target.get('tool_id') != tool_id:
            self.send_json({'success': False, 'error': f"Key Permission Error: This key is only valid for '{target.get('tool_name')}'."})
            return

        # DEVICE LOCK ENFORCEMENT
        lock_mode = target.get('device_lock_mode', 'none')
        bound_device = target.get('device_id', '').strip()

        if lock_mode == 'specific':
            if not user_device_id or user_device_id != bound_device:
                self.send_json({
                    'success': False,
                    'error': f"Hardware Lock Error: Key locked to Device [{bound_device[:8]}...]. Your device [{user_device_id[:8]}...] is not authorized!"
                })
                return

        elif lock_mode == 'auto':
            if not bound_device:
                # First time use: BIND to this device permanently!
                target['device_id'] = user_device_id
                bound_device = user_device_id
            else:
                if user_device_id != bound_device:
                    self.send_json({
                        'success': False,
                        'error': f"Hardware Lock Error: This key is bound to the first device that used it. Your device is not authorized!"
                    })
                    return

        # Check max users / unique devices limit
        used_devices = target.get('used_devices', [])
        max_users = target.get('max_users', 0)
        if user_device_id and user_device_id not in used_devices:
            if max_users > 0 and len(used_devices) >= max_users:
                self.send_json({'success': False, 'error': f"Account Limit Reached: Maximum {max_users} users/devices allowed for this key."})
                return
            used_devices.append(user_device_id)

        # Update stats
        target['used_count'] = used_count + 1
        target['used_devices'] = used_devices
        target['active_accounts'] = len(used_devices)
        target['last_used_at'] = time.strftime('%Y-%m-%d %H:%M:%S')

        save_tokens(tokens)

        self.send_json({
            'success': True,
            'message': 'Token Verified & Device Authorized!',
            'tool_id': target.get('tool_id'),
            'tool_name': target.get('tool_name'),
            'remaining_uses': (max_uses - target['used_count']) if max_uses > 0 else 'Unlimited',
            'locked_device': bound_device if lock_mode != 'none' else 'Unlocked'
        })

    # STATIC FILE SERVER
    def serve_static(self, path):
        if path == '/' or path == '':
            path = '/index.html'

        clean_path = path.lstrip('/')
        file_path = os.path.join(BASE_DIR, clean_path)

        if not os.path.exists(file_path) or os.path.isdir(file_path):
            self.send_response(404)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"404 Not Found")
            return

        # MIME type resolution
        mime, _ = mimetypes.guess_type(file_path)
        if not mime:
            if file_path.endswith('.woff2'): mime = 'font/woff2'
            elif file_path.endswith('.woff'): mime = 'font/woff'
            elif file_path.endswith('.ttf'): mime = 'font/ttf'
            elif file_path.endswith('.js'): mime = 'application/javascript'
            elif file_path.endswith('.css'): mime = 'text/css'
            elif file_path.endswith('.json'): mime = 'application/json'
            else: mime = 'application/octet-stream'

        try:
            with open(file_path, 'rb') as f:
                content = f.read()

            self.send_response(200)
            self.send_header('Content-Type', mime)
            self.send_header('Content-Length', str(len(content)))
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode())

    # META HORIZONE HANDLERS
    def get_meta_paths(self):
        meta_dir = os.path.expanduser('~/META-HORIZONE')
        return {
            'dir': meta_dir,
            'config': os.path.join(meta_dir, 'meta_config.json'),
            'password': os.path.join(meta_dir, 'password.json'),
            'accounts_dir': os.path.join(meta_dir, 'accounts'),
            'accounts_json': os.path.join(meta_dir, 'accounts', 'accounts.json'),
            'accounts_txt': os.path.join(meta_dir, 'accounts', 'accounts.txt'),
            'mail_config': os.path.join(meta_dir, 'mail_config.json'),
            'mail_history': os.path.join(meta_dir, 'mail_history.json')
        }

    def _read_meta_accounts(self, paths):
        if not os.path.isfile(paths['accounts_json']):
            return []
        try:
            with open(paths['accounts_json'], 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return []

    def _write_meta_accounts(self, paths, accounts):
        os.makedirs(paths['accounts_dir'], exist_ok=True)
        with open(paths['accounts_json'], 'w', encoding='utf-8') as f:
            json.dump(accounts, f, indent=2, ensure_ascii=False)
        with open(paths['accounts_txt'], 'w', encoding='utf-8') as f:
            for item in accounts:
                u = item.get('uid', '')
                p = item.get('password', '')
                c = item.get('cookie', '')
                n = item.get('number', '')
                nm = item.get('name', '')
                ts = item.get('created_at', '')
                f.write(f"{u}|{p}|{c}|{n}|{nm}|{ts}\n")

    def handle_meta_status(self):
        paths = self.get_meta_paths()
        installed = os.path.isdir(paths['dir'])
        cfg = {}
        if os.path.isfile(paths['config']):
            try:
                with open(paths['config'], 'r', encoding='utf-8') as f:
                    cfg = json.load(f)
            except Exception: pass

        saved_pwd = ""
        if os.path.isfile(paths['password']):
            try:
                with open(paths['password'], 'r', encoding='utf-8') as f:
                    p_data = json.load(f)
                    saved_pwd = p_data.get('password', '')
            except Exception: pass

        accounts = self._read_meta_accounts(paths)

        # Unique account calculation
        seen = set()
        unique_count = 0
        for a in accounts:
            key = str(a.get('uid') or a.get('number') or '').strip()
            if key and key not in seen:
                seen.add(key)
                unique_count += 1
            elif not key:
                unique_count += 1

        dupes_count = max(0, len(accounts) - unique_count)

        self.send_json({
            'success': True,
            'installed': installed,
            'path': paths['dir'],
            'total_accounts': len(accounts),
            'unique_accounts': unique_count,
            'duplicate_count': dupes_count,
            'saved_password': saved_pwd,
            'config': cfg,
            'accounts': accounts,
            'recent_accounts': accounts[-15:] if accounts else []
        })

    def handle_meta_accounts(self):
        paths = self.get_meta_paths()
        accounts = self._read_meta_accounts(paths)
        raw_txt = ''
        if os.path.isfile(paths['accounts_txt']):
            try:
                with open(paths['accounts_txt'], 'r', encoding='utf-8') as f:
                    raw_txt = f.read()
            except Exception: pass
        self.send_json({
            'success': True,
            'total': len(accounts),
            'accounts': accounts,
            'raw_txt': raw_txt
        })

    def handle_meta_get_password(self):
        paths = self.get_meta_paths()
        saved_pwd = ""
        if os.path.isfile(paths['password']):
            try:
                with open(paths['password'], 'r', encoding='utf-8') as f:
                    p_data = json.load(f)
                    saved_pwd = p_data.get('password', '')
            except Exception: pass
        self.send_json({'success': True, 'password': saved_pwd})

    def handle_meta_save_password(self, data):
        paths = self.get_meta_paths()
        new_pwd = str(data.get('password', '')).strip()
        if not new_pwd:
            self.send_json({'success': False, 'error': 'Password cannot be empty.'}, status=400)
            return
        try:
            with open(paths['password'], 'w', encoding='utf-8') as f:
                json.dump({'password': new_pwd, 'saved_at': datetime.datetime.now().isoformat()}, f, indent=2)
            self.send_json({'success': True, 'message': 'Creator password updated successfully!'})
        except Exception as e:
            self.send_json({'success': False, 'error': str(e)}, status=500)

    def handle_meta_add_account(self, data):
        paths = self.get_meta_paths()
        uid = str(data.get('uid', '')).strip()
        name = str(data.get('name', 'Meta User')).strip()
        number = str(data.get('number', '')).strip()
        password = str(data.get('password', '')).strip()
        cookie = str(data.get('cookie', '')).strip()
        created_at = str(data.get('created_at', '')).strip() or datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if not uid and not number:
            self.send_json({'success': False, 'error': 'At least UID or Phone Number is required.'}, status=400)
            return

        accounts = self._read_meta_accounts(paths)
        updated = False
        new_entry = {
            'uid': uid,
            'name': name,
            'number': number,
            'password': password,
            'cookie': cookie,
            'created_at': created_at
        }

        for idx, a in enumerate(accounts):
            if uid and str(a.get('uid', '')).strip() == uid:
                accounts[idx] = new_entry
                updated = True
                break
            elif not uid and number and str(a.get('number', '')).strip() == number:
                accounts[idx] = new_entry
                updated = True
                break

        if not updated:
            accounts.append(new_entry)

        try:
            self._write_meta_accounts(paths, accounts)
            self.send_json({'success': True, 'message': 'Account saved successfully!', 'account': new_entry})
        except Exception as e:
            self.send_json({'success': False, 'error': str(e)}, status=500)

    def handle_meta_delete_account(self, data):
        paths = self.get_meta_paths()
        uid = str(data.get('uid', '')).strip()
        number = str(data.get('number', '')).strip()
        if not uid and not number:
            self.send_json({'success': False, 'error': 'UID or Number is required to delete.'}, status=400)
            return

        accounts = self._read_meta_accounts(paths)
        before_count = len(accounts)
        new_accounts = []
        for a in accounts:
            if uid and str(a.get('uid', '')).strip() == uid:
                continue
            if not uid and number and str(a.get('number', '')).strip() == number:
                continue
            new_accounts.append(a)

        if len(new_accounts) == before_count:
            self.send_json({'success': False, 'error': 'Account not found.'}, status=404)
            return

        try:
            self._write_meta_accounts(paths, new_accounts)
            self.send_json({'success': True, 'message': 'Account deleted successfully!'})
        except Exception as e:
            self.send_json({'success': False, 'error': str(e)}, status=500)

    def handle_meta_deduplicate(self):
        paths = self.get_meta_paths()
        accounts = self._read_meta_accounts(paths)
        seen = set()
        unique_accounts = []
        for a in reversed(accounts):
            key = str(a.get('uid') or a.get('number') or '').strip()
            if key and key not in seen:
                seen.add(key)
                unique_accounts.append(a)
            elif not key:
                unique_accounts.append(a)
        unique_accounts.reverse()

        removed = len(accounts) - len(unique_accounts)
        try:
            self._write_meta_accounts(paths, unique_accounts)
            self.send_json({
                'success': True,
                'message': f'Cleaned {removed} duplicate account(s) successfully!',
                'removed': removed,
                'remaining': len(unique_accounts)
            })
        except Exception as e:
            self.send_json({'success': False, 'error': str(e)}, status=500)

    def handle_meta_check_uid(self, data):
        uid = str(data.get('uid', '')).strip()
        if not uid:
            self.send_json({'success': False, 'error': 'UID is required.'}, status=400)
            return

        import urllib.request
        url = f"https://graph.facebook.com/{uid}/picture?type=normal"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Android; Mobile)'})
            with urllib.request.urlopen(req, timeout=5) as resp:
                final_url = resp.geturl()
                is_live = 'static.xx.fbcdn.net/rsrc.php' not in final_url and resp.status == 200
                self.send_json({
                    'success': True,
                    'uid': uid,
                    'status': 'LIVE' if is_live else 'CHECKPOINT/INACTIVE',
                    'picture_url': final_url
                })
        except Exception as e:
            self.send_json({'success': True, 'uid': uid, 'status': 'UNKNOWN/NETWORK', 'error': str(e)})

    def handle_meta_save_telegram(self, data):
        paths = self.get_meta_paths()
        cfg = {}
        if os.path.isfile(paths['config']):
            try:
                with open(paths['config'], 'r', encoding='utf-8') as f:
                    cfg = json.load(f)
            except Exception: pass

        cfg['telegram_enabled'] = bool(data.get('enabled', False))
        cfg['telegram_token'] = str(data.get('token', '')).strip()
        cfg['telegram_chat_id'] = str(data.get('chat_id', '')).strip()

        try:
            with open(paths['config'], 'w', encoding='utf-8') as f:
                json.dump(cfg, f, indent=2)
            self.send_json({'success': True, 'message': 'Telegram settings updated successfully!'})
        except Exception as e:
            self.send_json({'success': False, 'error': str(e)}, status=500)

    def handle_meta_test_telegram(self, data):
        token = str(data.get('token', '')).strip()
        chat_id = str(data.get('chat_id', '')).strip()
        if not token or not chat_id:
            self.send_json({'success': False, 'error': 'Bot Token and Chat ID are required.'}, status=400)
            return

        import urllib.request
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        payload = json.dumps({
            'chat_id': chat_id,
            'text': '🔔 <b>Foysal Tools Admin Panel</b>: Meta Horizon Pro Telegram Alert Connected Successfully! ⚡',
            'parse_mode': 'HTML'
        }).encode('utf-8')

        req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=8) as resp:
                result = json.loads(resp.read().decode())
                if result.get('ok'):
                    self.send_json({'success': True, 'message': 'Test alert sent to Telegram!'})
                else:
                    self.send_json({'success': False, 'error': result.get('description', 'Telegram error')})
        except Exception as e:
            self.send_json({'success': False, 'error': str(e)}, status=500)

    def handle_meta_clear_accounts(self):
        paths = self.get_meta_paths()
        try:
            if os.path.isfile(paths['accounts_json']): os.remove(paths['accounts_json'])
            if os.path.isfile(paths['accounts_txt']): os.remove(paths['accounts_txt'])
            self.send_json({'success': True, 'message': 'Account logs cleared!'})
        except Exception as e:
            self.send_json({'success': False, 'error': str(e)}, status=500)

    # META HORIZON AUTO MAIL & OTP HUB
    def _read_meta_mail_config(self, paths):
        cfg = {
            'hotmail_api_key': 'e47bd8443425bb40b48239f0e5befddfa8f86e3205909c0b',
            'default_product_id': 14,
            'auto_save_to_meta': True,
            'auto_watch_otp': True,
            'otp_timeout_sec': 60
        }
        if os.path.isfile(paths['mail_config']):
            try:
                with open(paths['mail_config'], 'r', encoding='utf-8') as f:
                    saved = json.load(f)
                    if isinstance(saved, dict):
                        cfg.update(saved)
            except Exception:
                pass
        return cfg

    def _read_meta_mail_history(self, paths):
        if not os.path.isfile(paths['mail_history']):
            return []
        try:
            with open(paths['mail_history'], 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data if isinstance(data, list) else []
        except Exception:
            return []

    def _write_meta_mail_history(self, paths, history):
        os.makedirs(paths['dir'], exist_ok=True)
        try:
            with open(paths['mail_history'], 'w', encoding='utf-8') as f:
                json.dump(history, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"[!] Error writing mail history: {e}")

    def handle_meta_mail_config(self):
        paths = self.get_meta_paths()
        cfg = self._read_meta_mail_config(paths)
        
        balance_info = None
        if cfg.get('hotmail_api_key'):
            try:
                resp = requests.get(
                    "https://hotmail143.com/api/v1/me",
                    headers={"Authorization": f"Bearer {cfg['hotmail_api_key']}", "Content-Type": "application/json"},
                    timeout=5
                )
                if resp.status_code == 200:
                    me_data = resp.json()
                    if me_data.get('success'):
                        balance_info = me_data.get('data')
            except Exception:
                pass

        self.send_json({
            'success': True,
            'config': cfg,
            'balance_info': balance_info
        })

    def handle_meta_mail_save_config(self, data):
        paths = self.get_meta_paths()
        cfg = self._read_meta_mail_config(paths)
        if 'hotmail_api_key' in data:
            cfg['hotmail_api_key'] = str(data['hotmail_api_key']).strip()
        if 'default_product_id' in data:
            try:
                cfg['default_product_id'] = int(data['default_product_id'])
            except Exception:
                pass
        if 'auto_save_to_meta' in data:
            cfg['auto_save_to_meta'] = bool(data['auto_save_to_meta'])
        if 'auto_watch_otp' in data:
            cfg['auto_watch_otp'] = bool(data['auto_watch_otp'])
        if 'otp_timeout_sec' in data:
            try:
                cfg['otp_timeout_sec'] = int(data['otp_timeout_sec'])
            except Exception:
                pass

        os.makedirs(paths['dir'], exist_ok=True)
        with open(paths['mail_config'], 'w', encoding='utf-8') as f:
            json.dump(cfg, f, indent=2, ensure_ascii=False)

        self.send_json({'success': True, 'message': 'Mail config saved successfully!', 'config': cfg})

    def handle_meta_mail_products(self):
        paths = self.get_meta_paths()
        cfg = self._read_meta_mail_config(paths)
        api_key = cfg.get('hotmail_api_key') or 'e47bd8443425bb40b48239f0e5befddfa8f86e3205909c0b'
        try:
            resp = requests.get(
                "https://hotmail143.com/api/v1/products",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                timeout=8
            )
            if resp.status_code == 200:
                data = resp.json()
                self.send_json({'success': True, 'products': data.get('data', [])})
            else:
                self.send_json({'success': False, 'error': f"HTTP {resp.status_code}: {resp.text[:100]}"})
        except Exception as e:
            self.send_json({'success': False, 'error': str(e)})

    def handle_meta_mail_buy(self, data):
        paths = self.get_meta_paths()
        cfg = self._read_meta_mail_config(paths)
        api_key = str(data.get('hotmail_api_key') or cfg.get('hotmail_api_key') or 'e47bd8443425bb40b48239f0e5befddfa8f86e3205909c0b').strip()
        
        product_id = data.get('product_id') or cfg.get('default_product_id') or 4
        try:
            product_id = int(product_id)
        except Exception:
            product_id = 4

        quantity = data.get('quantity', 1)
        try:
            quantity = max(1, min(100, int(quantity)))
        except Exception:
            quantity = 1

        try:
            buy_url = "https://hotmail143.com/api/v1/orders"

            # Split into chunks of max 10 per Hotmail143 order request
            chunks = []
            rem = quantity
            while rem > 0:
                c = min(10, rem)
                chunks.append(c)
                rem -= c

            accounts_list = []
            first_err = None

            for chunk_qty in chunks:
                buy_headers = {
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                    "Idempotency-Key": str(uuid.uuid4())
                }
                buy_payload = {
                    "product_id": product_id,
                    "quantity": chunk_qty
                }
                try:
                    resp = requests.post(buy_url, headers=buy_headers, json=buy_payload, timeout=60)
                    res_data = resp.json() if resp.text.strip() else {}
                    if res_data.get('success'):
                        order_data = res_data.get('data', {})
                        accs = order_data.get('accounts', [])
                        if accs:
                            accounts_list.extend(accs)
                    else:
                        err_obj = res_data.get('error')
                        err_msg = ""
                        if isinstance(err_obj, dict):
                            err_msg = err_obj.get('message', '')
                        elif isinstance(err_obj, str):
                            err_msg = err_obj
                        if not err_msg:
                            err_msg = res_data.get('message') or resp.text
                        if not first_err:
                            first_err = str(err_msg)
                except Exception as e:
                    if not first_err:
                        first_err = str(e)

            if not accounts_list:
                self.send_json({'success': False, 'error': first_err or 'Order failed or insufficient balance on Hotmail143.'})
                return

            history = self._read_meta_mail_history(paths)
            meta_accounts = self._read_meta_accounts(paths)
            newly_bought = []
            now_iso = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            auto_save = data.get('auto_save_to_meta', cfg.get('auto_save_to_meta', True))

            for raw_acc in accounts_list:
                parts = str(raw_acc).split('|')
                email = parts[0].strip() if len(parts) > 0 else ''
                pwd = parts[1].strip() if len(parts) > 1 else ''
                refresh_token = parts[2].strip() if len(parts) > 2 else ''
                client_id = parts[3].strip() if len(parts) > 3 else ''
                if not client_id:
                    client_id = "9e5f94bc-e8a4-4e73-b8be-63364c29d753"

                mail_entry = {
                    'id': f"mail_{int(time.time()*1000)}_{len(newly_bought)}",
                    'email': email,
                    'password': pwd,
                    'refresh_token': refresh_token,
                    'client_id': client_id,
                    'raw_account': str(raw_acc).strip(),
                    'product_id': product_id,
                    'created_at': now_iso,
                    'otp_status': 'WAITING',
                    'last_otp': '',
                    'saved_to_meta': bool(auto_save)
                }
                newly_bought.append(mail_entry)
                history.insert(0, mail_entry)

                if auto_save and email:
                    meta_accounts.append({
                        'uid': email,
                        'name': 'Meta AI Account',
                        'number': email,
                        'password': pwd,
                        'cookie': str(raw_acc).strip(),
                        'created_at': now_iso
                    })

            self._write_meta_mail_history(paths, history)
            if auto_save:
                self._write_meta_accounts(paths, meta_accounts)

            self.send_json({
                'success': True,
                'message': f"Successfully purchased {len(newly_bought)} mail account(s)!",
                'accounts': newly_bought,
                'first_account': newly_bought[0] if newly_bought else None
            })

        except Exception as e:
            self.send_json({'success': False, 'error': f"Failed to connect to Hotmail143: {str(e)}"}, status=500)

    def handle_meta_mail_otp(self, email=None, custom_api_key=None, refresh_token=None, client_id=None, service_type='facebook', raw_account=None, password=None):
        paths = self.get_meta_paths()
        cfg = self._read_meta_mail_config(paths)
        hotmail_api_key = str(custom_api_key or cfg.get('hotmail_api_key') or 'e47bd8443425bb40b48239f0e5befddfa8f86e3205909c0b').strip()
        
        email_str = str(email or '').strip()
        if not email_str and raw_account:
            email_str = str(raw_account).strip()
            
        if not email_str:
            self.send_json({'success': False, 'error': 'Email or full account combo is required.'}, status=400)
            return

        # Check if email contains combo parts (pipe-separated: email|password|refresh_token|client_id)
        if '|' in email_str:
            parts = [p.strip() for p in email_str.split('|')]
            if len(parts) > 0 and parts[0]: email = parts[0]
            if len(parts) > 1 and not password: password = parts[1]
            if len(parts) > 2 and not refresh_token: refresh_token = parts[2]
            if len(parts) > 3 and not client_id: client_id = parts[3]
            if not raw_account: raw_account = email_str
        else:
            email = email_str

        history = self._read_meta_mail_history(paths)

        # Lookup missing details from history
        for h in history:
            if str(h.get('email', '')).lower() == email.lower():
                if not password and h.get('password'): password = h.get('password')
                if not refresh_token and h.get('refresh_token'): refresh_token = h.get('refresh_token')
                if not client_id and h.get('client_id'): client_id = h.get('client_id')
                if not raw_account and h.get('raw_account'): raw_account = h.get('raw_account')
                break

        if not client_id:
            client_id = "9e5f94bc-e8a4-4e73-b8be-63364c29d753"

        full_combo_str = raw_account or f"{email}|{password or ''}|{refresh_token or ''}|{client_id or ''}"

        found_otp = None
        status_val = "WAITING"
        content_msg = ""
        extracted_messages = []
        raw_resp = {}
        error_msg = None

        # ----------------------------------------------------
        # DUAL ENGINE 1: DIRECT MICROSOFT OAUTH2 IMAP INBOX READER
        # Directly logs into mailbox via XOAUTH2 and extracts Meta/Facebook OTP
        # ----------------------------------------------------
        is_ms_domain = any(d in str(email).lower() for d in ['outlook', 'hotmail', 'live', 'msn', 'office'])
        if refresh_token and is_ms_domain:
            try:
                ms_token_url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
                ms_payload = {
                    'client_id': client_id,
                    'scope': 'https://outlook.office.com/IMAP.AccessAsUser.All offline_access',
                    'grant_type': 'refresh_token',
                    'refresh_token': refresh_token,
                }
                ms_resp = requests.post(ms_token_url, data=ms_payload, timeout=12)
                if ms_resp.status_code == 200:
                    access_token = ms_resp.json().get('access_token')
                    if access_token:
                        auth_string = f'user={email}\x01auth=Bearer {access_token}\x01\x01'
                        imap_client = imaplib.IMAP4_SSL('outlook.office365.com', 993)
                        auth_res_type, _ = imap_client.authenticate('XOAUTH2', lambda x: auth_string)
                        if auth_res_type == 'OK':
                            imap_client.select('INBOX')
                            typ, msg_ids = imap_client.search(None, 'ALL')
                            if msg_ids and msg_ids[0]:
                                id_list = msg_ids[0].split()
                                recent_ids = list(reversed(id_list[-12:]))

                                best_candidate = None
                                best_score = 0
                                best_content = ""

                                for mid in recent_ids:
                                    typ, mdata = imap_client.fetch(mid, '(RFC822)')
                                    if typ != 'OK' or not mdata: continue
                                    raw_msg = mdata[0][1]
                                    parsed = email_pkg.message_from_bytes(raw_msg)

                                    subj_raw = parsed.get('Subject', '')
                                    subj_parts = decode_header(subj_raw)
                                    subj = ''
                                    for part, enc in subj_parts:
                                        if isinstance(part, bytes):
                                            subj += part.decode(enc or 'utf-8', 'ignore')
                                        else:
                                            subj += str(part)

                                    from_addr = parsed.get('From', '')
                                    date_str = parsed.get('Date', '')

                                    body = ''
                                    if parsed.is_multipart():
                                        for p in parsed.walk():
                                            ct = p.get_content_type()
                                            if ct in ['text/plain', 'text/html']:
                                                p_data = p.get_payload(decode=True)
                                                if p_data: body += p_data.decode('utf-8', 'ignore') + '\n'
                                    else:
                                        p_data = parsed.get_payload(decode=True)
                                        if p_data: body = p_data.decode('utf-8', 'ignore')

                                    extracted_messages.append({
                                        'subject': subj,
                                        'from': from_addr,
                                        'date': date_str,
                                        'body_preview': body[:160].strip()
                                    })

                                    # Score 30: Subject explicitly contains code (e.g. 'Use code 385289 to log in', '385289 is your code')
                                    subj_code = re.search(r'(?:code|código|otp|verification|security|login|confirm)[\s\:\-\–\—\#\*]*([0-9]{5,8})', subj, re.IGNORECASE)
                                    if not subj_code:
                                        subj_code = re.search(r'([0-9]{5,8})[\s\:\-\–\—]*(?:is your|to log in|to confirm)', subj, re.IGNORECASE)
                                    if not subj_code and ('code' in subj.lower() or 'otp' in subj.lower()):
                                        subj_code = re.search(r'\b([0-9]{5,8})\b', subj)

                                    if subj_code and best_score < 30:
                                        c = subj_code.group(1)
                                        if c != '94025' and not (c.startswith('202') and len(c) == 4):
                                            best_candidate = c
                                            best_score = 30
                                            best_content = f"Subject: {subj}"
                                            break

                                    # Score 20: Body keyword match with code
                                    body_code = re.search(r'(?:code|código|otp|verification|security code|login code|confirmation code|confirmation pin)[\s\:\-\–\—\#\*]*([0-9]{5,8})', body, re.IGNORECASE)
                                    if not body_code:
                                        body_code = re.search(r'([0-9]{5,8})[\s\:\-\–\—]*(?:is your|to log in|is the code|to confirm)', body, re.IGNORECASE)
                                    
                                    if body_code and best_score < 20:
                                        c = body_code.group(1)
                                        if c != '94025':
                                            best_candidate = c
                                            best_score = 20
                                            best_content = f"Subject: {subj}"

                                    # Score 10: Fallback only if Meta/FB email and no higher score
                                    if ('meta' in from_addr.lower() or 'facebook' in from_addr.lower()) and best_score < 10:
                                        all_digits = re.findall(r'\b([0-9]{6,8})\b', body)
                                        for d in all_digits:
                                            if d not in ['94025', '202400', '202500', '202600'] and not d.startswith('202'):
                                                best_candidate = d
                                                best_score = 10
                                                best_content = f"Subject: {subj}"
                                                break

                                if best_candidate:
                                    found_otp = best_candidate
                                    status_val = "RECEIVED"
                                    content_msg = best_content

                            imap_client.logout()
            except Exception as e:
                error_msg = f"OAuth IMAP notice: {str(e)}"

        # ----------------------------------------------------
        # DUAL ENGINE 2: HOTMAIL143 API LOOKUP FALLBACK (Edu Mail & Global)
        # Endpoint: GET https://hotmail143.com/api/v1/otp-orders/lookup?email={email}
        # ----------------------------------------------------
        if not found_otp:
            try:
                h_headers = {
                    "Authorization": f"Bearer {hotmail_api_key}",
                    "Content-Type": "application/json"
                }
                h_url = f"https://hotmail143.com/api/v1/otp-orders/lookup?email={email}"
                h_resp = requests.get(h_url, headers=h_headers, timeout=12)
                if h_resp.status_code == 200 and h_resp.text.strip():
                    h_data = h_resp.json()
                    raw_resp = h_data
                    if h_data.get('success'):
                        order_info = h_data.get('data', {})
                        code_val = str(order_info.get('code', '') or '').strip()
                        status_val = str(order_info.get('status', 'PENDING')).strip()
                        updated_at = order_info.get('updated_at', '')
                        content_msg = f"Status: {status_val} | Code: {code_val}"
                        extracted_messages.append({
                            "subject": f"Hotmail143 [{status_val.upper()}]",
                            "body": f"OTP Code: {code_val} (Order Status: {status_val})",
                            "date": updated_at or datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        })
                        if code_val and code_val.lower() not in ['none', 'null', '']:
                            found_otp = code_val
                        else:
                            # Fallback: check if message or body contains digits
                            msg_content = str(order_info.get('message', '') or order_info.get('body', '')).strip()
                            if msg_content:
                                m_digits = re.search(r'\b([0-9]{4,8})\b', msg_content)
                                if m_digits:
                                    found_otp = m_digits.group(1)
                                    code_val = found_otp
                    else:
                        err_data = h_data.get('error', {})
                        err_str = err_data.get('message') if isinstance(err_data, dict) else str(err_data)
                        if not error_msg:
                            error_msg = err_str or h_data.get('message', 'Awaiting incoming verification email...')
            except Exception as e:
                if not error_msg:
                    error_msg = f"Connection error: {str(e)}"

        # Update History & Meta Accounts if OTP was found or status received
        updated_history = False
        for h in history:
            if h.get('email', '').lower() == email.lower():
                if found_otp:
                    h['last_otp'] = found_otp
                    h['otp_status'] = 'COMPLETED'
                elif status_val and status_val != 'WAITING':
                    h['otp_status'] = status_val.upper()
                if not h.get('raw_account'):
                    h['raw_account'] = full_combo_str
                h['last_checked_at'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                updated_history = True
                break

        if updated_history:
            self._write_meta_mail_history(paths, history)

        # Directly sync OTP with Meta All accounts
        if found_otp:
            try:
                meta_accounts = self._read_meta_accounts(paths)
                meta_updated = False
                for ma in meta_accounts:
                    if ma.get('uid') == email or ma.get('number') == email:
                        ma['last_otp'] = found_otp
                        ma['verified_otp'] = found_otp
                        ma['updated_at'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        meta_updated = True
                if meta_updated:
                    self._write_meta_accounts(paths, meta_accounts)
            except Exception as e:
                print(f"[Meta All Sync Notice]: {e}")

        self.send_json({
            'success': True,
            'found': bool(found_otp),
            'otp': found_otp or '',
            'code': found_otp or '',
            'status': status_val,
            'content': content_msg,
            'email': email,
            'password': password or '',
            'refresh_token': refresh_token or '',
            'client_id': client_id or '',
            'raw_account': full_combo_str,
            'service_type': service_type,
            'links': [],
            'messages': extracted_messages,
            'raw': raw_resp,
            'error_details': error_msg
        })

    def handle_meta_mail_history(self):
        paths = self.get_meta_paths()
        history = self._read_meta_mail_history(paths)
        self.send_json({'success': True, 'history': history})

    def handle_meta_mail_delete(self, data):
        paths = self.get_meta_paths()
        mail_id = data.get('id')
        email = data.get('email')
        history = self._read_meta_mail_history(paths)
        new_history = [h for h in history if h.get('id') != mail_id and (not email or h.get('email') != email)]
        self._write_meta_mail_history(paths, new_history)
        self.send_json({'success': True, 'message': 'Mail removed from history.'})

    def handle_meta_mail_clear_history(self):
        paths = self.get_meta_paths()
        self._write_meta_mail_history(paths, [])
        self.send_json({'success': True, 'message': 'Mail history cleared!'})

    def handle_meta_mail_save_to_meta(self, data):
        paths = self.get_meta_paths()
        email = str(data.get('email', '')).strip()
        pwd = str(data.get('password', '')).strip()
        cookie = str(data.get('cookie', '') or data.get('refresh_token', '') or 'MAIL_ORDERED').strip()
        
        if not email:
            self.send_json({'success': False, 'error': 'Email is required.'}, status=400)
            return

        accounts = self._read_meta_accounts(paths)
        exists = any(a.get('uid') == email or a.get('number') == email for a in accounts)
        if not exists:
            accounts.append({
                'uid': email,
                'name': 'Mail Account',
                'number': email,
                'password': pwd,
                'cookie': cookie,
                'created_at': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            self._write_meta_accounts(paths, accounts)

        history = self._read_meta_mail_history(paths)
        for h in history:
            if h.get('email', '').lower() == email.lower():
                h['saved_to_meta'] = True
        self._write_meta_mail_history(paths, history)

        self.send_json({'success': True, 'message': f"Account {email} saved to Meta Horizon Hub!"})

    def handle_termux_backup_create(self):
        try:
            home = os.path.expanduser('~')
            tools_dir = os.path.join(home, 'foysal-tools')
            backup_dir = os.path.join(tools_dir, 'backup')
            os.makedirs(backup_dir, exist_ok=True)

            archive_name = "foysal-tools-backup.tar.gz"
            local_archive = os.path.join(backup_dir, archive_name)
            sdcard_archive = "/sdcard/Download/" + archive_name
            restore_script_name = "foysal_restore.sh"
            local_restore = os.path.join(backup_dir, restore_script_name)
            sdcard_restore = "/sdcard/Download/" + restore_script_name

            # 1. Create tar.gz archive excluding backup dir, cache, etc.
            tar_cmd = f"cd '{home}' && tar --exclude='foysal-tools/backup' --exclude='foysal-tools/__pycache__' -czf '{local_archive}' foysal-tools"
            subprocess.run(tar_cmd, shell=True, check=True, timeout=30)

            # 2. Copy to phone external storage (/sdcard/Download) which survives Termux uninstall
            copied_to_sdcard = False
            try:
                if os.path.isdir("/sdcard/Download"):
                    shutil.copy2(local_archive, sdcard_archive)
                    if os.path.exists(local_restore):
                        shutil.copy2(local_restore, sdcard_restore)
                        os.chmod(sdcard_restore, 0o755)
                    copied_to_sdcard = True
            except Exception as e:
                print(f"[Backup Notice]: Could not copy to /sdcard/Download: {e}")

            # Also check ~/storage/downloads if available
            try:
                storage_down = os.path.join(home, 'storage', 'downloads')
                if os.path.isdir(storage_down):
                    shutil.copy2(local_archive, os.path.join(storage_down, archive_name))
                    if os.path.exists(local_restore):
                        shutil.copy2(local_restore, os.path.join(storage_down, restore_script_name))
            except Exception:
                pass

            size_bytes = os.path.getsize(local_archive) if os.path.exists(local_archive) else 0
            size_kb = round(size_bytes / 1024, 1)
            size_str = f"{size_kb} KB" if size_kb < 1024 else f"{round(size_kb/1024, 2)} MB"
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # Count tools and accounts
            paths = self.get_meta_paths()
            history = self._read_meta_mail_history(paths)
            meta_accs = self._read_meta_accounts(paths)

            restore_cmd_full = "termux-setup-storage -y && pkg update -y && pkg install -y python python-pip git tar && cp /sdcard/Download/foysal-tools-backup.tar.gz ~/ 2>/dev/null || cp /sdcard/foysal-tools-backup.tar.gz ~/ 2>/dev/null; cd ~ && tar -xzf foysal-tools-backup.tar.gz && cd foysal-tools && chmod +x server.sh && ./server.sh"
            restore_cmd_script = "termux-setup-storage -y && bash /sdcard/Download/foysal_restore.sh"
            instant_sync_cmd = "cd ~ && tar -czf /sdcard/Download/foysal-tools-backup.tar.gz foysal-tools && cp ~/foysal-tools/backup/foysal_restore.sh /sdcard/Download/foysal_restore.sh 2>/dev/null; echo '✔ Backup Updated Successfully!'"

            self.send_json({
                'success': True,
                'message': 'Backup created and synchronized to permanent phone storage successfully!',
                'archive_path': sdcard_archive if copied_to_sdcard else local_archive,
                'sdcard_copied': copied_to_sdcard,
                'size': size_str,
                'size_bytes': size_bytes,
                'timestamp': timestamp,
                'meta_accounts_count': len(meta_accs),
                'mail_history_count': len(history),
                'restore_cmd_full': restore_cmd_full,
                'restore_cmd_script': restore_cmd_script,
                'instant_sync_cmd': instant_sync_cmd
            })
        except Exception as e:
            self.send_json({'success': False, 'error': f"Failed to create backup: {str(e)}"}, status=500)

    def handle_termux_backup_status(self):
        try:
            home = os.path.expanduser('~')
            backup_dir = os.path.join(home, 'foysal-tools', 'backup')
            local_archive = os.path.join(backup_dir, 'foysal-tools-backup.tar.gz')
            sdcard_archive = "/sdcard/Download/foysal-tools-backup.tar.gz"

            target_archive = sdcard_archive if os.path.exists(sdcard_archive) else (local_archive if os.path.exists(local_archive) else None)
            
            exists = target_archive is not None
            size_str = "0 KB"
            timestamp = "Not yet backed up"
            
            if exists:
                size_bytes = os.path.getsize(target_archive)
                size_kb = round(size_bytes / 1024, 1)
                size_str = f"{size_kb} KB" if size_kb < 1024 else f"{round(size_kb/1024, 2)} MB"
                mtime = os.path.getmtime(target_archive)
                timestamp = datetime.datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M:%S")

            restore_cmd_full = "termux-setup-storage -y && pkg update -y && pkg install -y python python-pip git tar && cp /sdcard/Download/foysal-tools-backup.tar.gz ~/ 2>/dev/null || cp /sdcard/foysal-tools-backup.tar.gz ~/ 2>/dev/null; cd ~ && tar -xzf foysal-tools-backup.tar.gz && cd foysal-tools && chmod +x server.sh && ./server.sh"
            restore_cmd_script = "termux-setup-storage -y && bash /sdcard/Download/foysal_restore.sh"
            instant_sync_cmd = "cd ~ && tar -czf /sdcard/Download/foysal-tools-backup.tar.gz foysal-tools && cp ~/foysal-tools/backup/foysal_restore.sh /sdcard/Download/foysal_restore.sh 2>/dev/null; echo '✔ Backup Updated Successfully!'"

            self.send_json({
                'success': True,
                'exists': exists,
                'archive_path': target_archive or sdcard_archive,
                'sdcard_accessible': os.path.isdir("/sdcard/Download"),
                'size': size_str,
                'timestamp': timestamp,
                'restore_cmd_full': restore_cmd_full,
                'restore_cmd_script': restore_cmd_script,
                'instant_sync_cmd': instant_sync_cmd
            })
        except Exception as e:
            self.send_json({'success': False, 'error': str(e)}, status=500)

def run_server(port=8080):
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, FoysalServerHandler)
    print(f"[+] ⚡ Foysal Tools Python 3 Engine running on port {port} ⚡")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server stopped.")
        httpd.server_close()

if __name__ == '__main__':
    port = 8080
    if len(sys.argv) > 1:
        try: port = int(sys.argv[1])
        except Exception: pass
    run_server(port)
