<?php
/**
 * FOYSAL TOOLS - ADVANCED MULTI-LANGUAGE BACKEND ENGINE
 * Supports: Python 3, PHP, Java, Shell/Bash, HTML Sandboxing & File Uploads
 * Compatible with: HopWeb PHP & Termux Built-in PHP Server
 */

// Error reporting settings
error_reporting(E_ALL);
ini_set('display_errors', '0');

// CORS and JSON Headers
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$sandboxDir = __DIR__ . '/sandbox';
if (!file_exists($sandboxDir)) {
    @mkdir($sandboxDir, 0777, true);
}

switch ($action) {
    case 'status':
        echo json_encode([
            'status' => 'online',
            'system' => php_uname('s') . ' ' . php_uname('r'),
            'php_version' => PHP_VERSION,
            'python_available' => (bool)exec('command -v python3'),
            'java_available' => (bool)exec('command -v java'),
            'bash_available' => (bool)exec('command -v bash'),
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'HopWeb / CLI',
            'server_time' => date('Y-m-d H:i:s'),
            'memory_usage' => round(memory_get_usage(true) / 1024 / 1024, 2) . ' MB',
            'app' => 'Foysal Tools Advanced Engine'
        ]);
        break;

    // CODE EXECUTION ENGINE: Python, PHP, Bash, Java
    case 'execute_code':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(['success' => false, 'error' => 'Method not allowed. Use POST.']);
            exit();
        }

        $inputRaw = file_get_contents('php://input');
        $data = json_decode($inputRaw, true);

        if (!$data) {
            $data = $_POST;
        }

        $language = strtolower(trim($data['language'] ?? 'python'));
        $code = trim($data['code'] ?? '');

        if (empty($code)) {
            echo json_encode(['success' => false, 'error' => 'No code provided for execution.']);
            exit();
        }

        $startTime = microtime(true);
        $output = '';
        $exitCode = 0;
        $fileId = uniqid('foysal_');

        switch ($language) {
            case 'python':
            case 'py':
            case 'python3':
                $filePath = $sandboxDir . '/' . $fileId . '.py';
                file_put_contents($filePath, $code);
                $cmd = "python3 " . escapeshellarg($filePath) . " 2>&1";
                exec($cmd, $outLines, $exitCode);
                $output = implode("\n", $outLines);
                @unlink($filePath);
                break;

            case 'php':
                $filePath = $sandboxDir . '/' . $fileId . '.php';
                // If code doesn't start with <?php add it
                if (!preg_match('/^<\?php/i', trim($code))) {
                    $code = "<?php\n" . $code;
                }
                file_put_contents($filePath, $code);
                $cmd = "php " . escapeshellarg($filePath) . " 2>&1";
                exec($cmd, $outLines, $exitCode);
                $output = implode("\n", $outLines);
                @unlink($filePath);
                break;

            case 'bash':
            case 'sh':
            case 'shell':
                $filePath = $sandboxDir . '/' . $fileId . '.sh';
                file_put_contents($filePath, "#!/data/data/com.termux/files/usr/bin/bash\n" . $code);
                chmod($filePath, 0755);
                $cmd = "bash " . escapeshellarg($filePath) . " 2>&1";
                exec($cmd, $outLines, $exitCode);
                $output = implode("\n", $outLines);
                @unlink($filePath);
                break;

            case 'java':
                // Check if class name is present in Java code
                $className = 'Main';
                if (preg_match('/public\s+class\s+([A-Za-z0-9_]+)/', $code, $matches)) {
                    $className = $matches[1];
                }
                $javaDir = $sandboxDir . '/' . $fileId;
                @mkdir($javaDir, 0777, true);
                $javaFile = $javaDir . '/' . $className . '.java';
                file_put_contents($javaFile, $code);

                $compileCmd = "javac " . escapeshellarg($javaFile) . " 2>&1";
                exec($compileCmd, $compileLines, $compileExit);

                if ($compileExit !== 0) {
                    $output = "Compilation Error:\n" . implode("\n", $compileLines);
                    $exitCode = $compileExit;
                } else {
                    $runCmd = "java -cp " . escapeshellarg($javaDir) . " " . escapeshellarg($className) . " 2>&1";
                    exec($runCmd, $runLines, $exitCode);
                    $output = implode("\n", $runLines);
                }

                // Cleanup java temp files
                @array_map('unlink', glob("$javaDir/*"));
                @rmdir($javaDir);
                break;

            default:
                $output = "Unsupported execution language: " . htmlspecialchars($language);
                $exitCode = 1;
                break;
        }

        $executionTime = round((microtime(true) - $startTime), 3) . 's';

        echo json_encode([
            'success' => ($exitCode === 0),
            'language' => $language,
            'output' => empty($output) ? '[Execution completed with empty output]' : $output,
            'exit_code' => $exitCode,
            'execution_time' => $executionTime
        ]);
        break;

    // FILE UPLOAD HANDLER
    case 'upload_file':
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(['success' => false, 'error' => 'File upload error or no file provided.']);
            exit();
        }

        $file = $_FILES['file'];
        $origName = basename($file['name']);
        $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
        $content = file_get_contents($file['tmp_name']);

        $uploadSubDir = $sandboxDir . '/uploads';
        if (!file_exists($uploadSubDir)) {
            @mkdir($uploadSubDir, 0777, true);
        }
        $savedPath = $uploadSubDir . '/' . time() . '_' . $origName;
        move_uploaded_file($file['tmp_name'], $savedPath);

        echo json_encode([
            'success' => true,
            'filename' => $origName,
            'extension' => $ext,
            'size' => filesize($savedPath),
            'content' => $content,
            'message' => 'File uploaded and parsed successfully!'
        ]);
        break;

    case 'save_backup':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            if ($data) {
                file_put_contents(__DIR__ . '/backup_foysal_tools.json', json_encode($data, JSON_PRETTY_PRINT));
                echo json_encode(['success' => true, 'message' => 'Backup saved to server disk.']);
            } else {
                echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
            }
        }
        break;

    case 'load_backup':
        $backupFile = __DIR__ . '/backup_foysal_tools.json';
        if (file_exists($backupFile)) {
            echo file_get_contents($backupFile);
        } else {
            echo json_encode(['error' => 'No server backup file found.']);
        }
        break;

    // TOKEN & LICENSE KEY MANAGEMENT
    case 'get_tokens':
        $tokensFile = __DIR__ . '/data/tokens.json';
        $tokens = file_exists($tokensFile) ? json_decode(file_get_contents($tokensFile), true) : [];
        if (!is_array($tokens)) $tokens = [];
        $now = time();
        foreach ($tokens as &$t) {
            if (!empty($t['blocked'])) {
                $t['live_status'] = 'BLOCKED';
            } elseif (!empty($t['expires_at']) && $t['expires_at'] < $now) {
                $t['live_status'] = 'EXPIRED';
            } elseif (!empty($t['max_uses']) && ($t['used_count'] ?? 0) >= $t['max_uses']) {
                $t['live_status'] = 'DEPLETED';
            } else {
                $t['live_status'] = 'ACTIVE';
            }
        }
        echo json_encode(['success' => true, 'tokens' => $tokens]);
        break;

    case 'create_token':
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $tokensFile = __DIR__ . '/data/tokens.json';
        $tokens = file_exists($tokensFile) ? json_decode(file_get_contents($tokensFile), true) : [];
        if (!is_array($tokens)) $tokens = [];

        $key = trim($input['key'] ?? '');
        if (empty($key)) {
            $prefix = strtoupper(trim($input['prefix'] ?? 'FOYSAL')) ?: 'FOYSAL';
            $key = $prefix . '-' . strtoupper(bin2hex(random_bytes(2))) . '-' . strtoupper(bin2hex(random_bytes(2))) . '-' . strtoupper(bin2hex(random_bytes(2)));
        }

        $now = time();
        $expiresAt = null;
        $expiryType = $input['expiry_type'] ?? 'lifetime';
        if ($expiryType === '1h') $expiresAt = $now + 3600;
        elseif ($expiryType === '2h') $expiresAt = $now + 7200;
        elseif ($expiryType === '12h') $expiresAt = $now + 43200;
        elseif ($expiryType === '24h') $expiresAt = $now + 86400;
        elseif ($expiryType === '48h') $expiresAt = $now + 172800;
        elseif ($expiryType === '72h') $expiresAt = $now + 259200;
        elseif ($expiryType === '7d') $expiresAt = $now + (86400 * 7);
        elseif ($expiryType === '30d') $expiresAt = $now + (86400 * 30);
        elseif ($expiryType === 'custom') {
            $hours = floatval($input['custom_hours'] ?? 0);
            if ($hours > 0) $expiresAt = $now + ($hours * 3600);
        }

        $deviceLockMode = $input['device_lock_mode'] ?? 'none';
        $deviceId = ($deviceLockMode === 'specific') ? trim($input['device_id'] ?? '') : '';

        $newToken = [
            'id' => 'key_' . round(microtime(true) * 1000),
            'key' => $key,
            'tool_id' => $input['tool_id'] ?? 'all',
            'tool_name' => $input['tool_name'] ?? 'All Tools (Master Key)',
            'device_lock_mode' => $deviceLockMode,
            'device_id' => $deviceId,
            'max_users' => intval($input['max_users'] ?? 0),
            'max_uses' => intval($input['max_uses'] ?? 0),
            'expiry_type' => $expiryType,
            'expires_at' => $expiresAt,
            'created_at' => date('Y-m-d H:i:s'),
            'used_count' => 0,
            'active_accounts' => 0,
            'used_devices' => [],
            'blocked' => false,
            'notes' => trim($input['notes'] ?? '')
        ];

        array_unshift($tokens, $newToken);
        @file_put_contents($tokensFile, json_encode($tokens, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'token' => $newToken, 'message' => "Token Key '$key' created successfully!"]);
        break;

    case 'verify_token':
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $tokensFile = __DIR__ . '/data/tokens.json';
        $tokens = file_exists($tokensFile) ? json_decode(file_get_contents($tokensFile), true) : [];
        if (!is_array($tokens)) $tokens = [];

        $key = strtoupper(trim($input['key'] ?? ''));
        $toolId = trim($input['tool_id'] ?? '');
        $userDeviceId = trim($input['device_id'] ?? '');

        $targetIndex = -1;
        foreach ($tokens as $idx => $t) {
            if (strtoupper(trim($t['key'] ?? '')) === $key) {
                $targetIndex = $idx;
                break;
            }
        }

        if ($targetIndex === -1) {
            echo json_encode(['success' => false, 'error' => 'Invalid Token Key. Key not recognized.']);
            exit();
        }

        $target = &$tokens[$targetIndex];

        if (!empty($target['blocked'])) {
            echo json_encode(['success' => false, 'error' => 'Access Denied: This Token Key has been revoked/blocked by Admin.']);
            exit();
        }

        $now = time();
        if (!empty($target['expires_at']) && $target['expires_at'] < $now) {
            echo json_encode(['success' => false, 'error' => 'Token Expired: This key has passed its expiration time.']);
            exit();
        }

        $maxUses = intval($target['max_uses'] ?? 0);
        $usedCount = intval($target['used_count'] ?? 0);
        if ($maxUses > 0 && $usedCount >= $maxUses) {
            echo json_encode(['success' => false, 'error' => "Usage Limit Reached: Key was limited to $maxUses runs."]);
            exit();
        }

        if (($target['tool_id'] ?? 'all') !== 'all' && $toolId && $target['tool_id'] !== $toolId) {
            echo json_encode(['success' => false, 'error' => "Key Permission Error: This key is only valid for '{$target['tool_name']}'."]);
            exit();
        }

        // Device lock check
        $lockMode = $target['device_lock_mode'] ?? 'none';
        $boundDevice = trim($target['device_id'] ?? '');

        if ($lockMode === 'specific') {
            if (!$userDeviceId || $userDeviceId !== $boundDevice) {
                echo json_encode([
                    'success' => false,
                    'error' => "Hardware Lock Error: Key is locked to Device [".substr($boundDevice, 0, 8)."...]. Your device is not authorized!"
                ]);
                exit();
            }
        } elseif ($lockMode === 'auto') {
            if (empty($boundDevice)) {
                $target['device_id'] = $userDeviceId;
                $boundDevice = $userDeviceId;
            } else {
                if ($userDeviceId !== $boundDevice) {
                    echo json_encode([
                        'success' => false,
                        'error' => "Hardware Lock Error: Key is bound to another device. Access denied!"
                    ]);
                    exit();
                }
            }
        }

        $usedDevices = is_array($target['used_devices'] ?? null) ? $target['used_devices'] : [];
        $maxUsers = intval($target['max_users'] ?? 0);
        if ($userDeviceId && !in_array($userDeviceId, $usedDevices)) {
            if ($maxUsers > 0 && count($usedDevices) >= $maxUsers) {
                echo json_encode(['success' => false, 'error' => "Account Limit Reached: Maximum $maxUsers users/devices allowed."]);
                exit();
            }
            $usedDevices[] = $userDeviceId;
        }

        $target['used_count'] = $usedCount + 1;
        $target['used_devices'] = $usedDevices;
        $target['active_accounts'] = count($usedDevices);
        $target['last_used_at'] = date('Y-m-d H:i:s');

        @file_put_contents($tokensFile, json_encode($tokens, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        echo json_encode([
            'success' => true,
            'message' => 'Token Verified & Device Authorized!',
            'tool_id' => $target['tool_id'],
            'tool_name' => $target['tool_name'],
            'remaining_uses' => ($maxUses > 0) ? ($maxUses - $target['used_count']) : 'Unlimited',
            'locked_device' => ($lockMode !== 'none') ? $boundDevice : 'Unlocked'
        ]);
        break;

    case 'toggle_block_token':
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $tokenId = $input['id'] ?? '';
        $tokensFile = __DIR__ . '/data/tokens.json';
        $tokens = file_exists($tokensFile) ? json_decode(file_get_contents($tokensFile), true) : [];
        if (is_array($tokens)) {
            foreach ($tokens as &$t) {
                if (($t['id'] ?? '') === $tokenId) {
                    $t['blocked'] = !($t['blocked'] ?? false);
                    break;
                }
            }
            @file_put_contents($tokensFile, json_encode($tokens, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(['success' => true, 'message' => 'Token status updated!']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Tokens file not found.']);
        }
        break;

    case 'delete_token':
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $tokenId = $input['id'] ?? '';
        $tokensFile = __DIR__ . '/data/tokens.json';
        $tokens = file_exists($tokensFile) ? json_decode(file_get_contents($tokensFile), true) : [];
        if (is_array($tokens)) {
            $tokens = array_values(array_filter($tokens, function($t) use ($tokenId) {
                return ($t['id'] ?? '') !== $tokenId;
            }));
            @file_put_contents($tokensFile, json_encode($tokens, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(['success' => true, 'message' => 'Token key deleted.']);
        }
        break;

    // META HORIZONE ACTIONS
    case 'meta_status':
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $cfgFile = $metaDir . '/meta_config.json';
        $pwdFile = $metaDir . '/password.json';
        $accFile = $metaDir . '/accounts/accounts.json';
        $installed = is_dir($metaDir);
        $cfg = file_exists($cfgFile) ? json_decode(file_get_contents($cfgFile), true) : [];
        $pwdData = file_exists($pwdFile) ? json_decode(file_get_contents($pwdFile), true) : [];
        $savedPwd = $pwdData['password'] ?? '';
        $accounts = file_exists($accFile) ? (json_decode(file_get_contents($accFile), true) ?: []) : [];

        $seen = [];
        $uniqueCount = 0;
        foreach ($accounts as $a) {
            $key = trim($a['uid'] ?? $a['number'] ?? '');
            if ($key !== '' && !isset($seen[$key])) {
                $seen[$key] = true;
                $uniqueCount++;
            } elseif ($key === '') {
                $uniqueCount++;
            }
        }
        $dupes = max(0, count($accounts) - $uniqueCount);

        echo json_encode([
            'success' => true,
            'installed' => $installed,
            'path' => $metaDir,
            'total_accounts' => count($accounts),
            'unique_accounts' => $uniqueCount,
            'duplicate_count' => $dupes,
            'saved_password' => $savedPwd,
            'config' => $cfg,
            'accounts' => $accounts,
            'recent_accounts' => is_array($accounts) ? array_slice($accounts, -15) : []
        ]);
        break;

    case 'meta_accounts':
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $accJson = $metaDir . '/accounts/accounts.json';
        $accTxt = $metaDir . '/accounts/accounts.txt';
        $accounts = file_exists($accJson) ? (json_decode(file_get_contents($accJson), true) ?: []) : [];
        $rawTxt = file_exists($accTxt) ? file_get_contents($accTxt) : '';
        echo json_encode([
            'success' => true,
            'total' => count($accounts),
            'accounts' => $accounts,
            'raw_txt' => $rawTxt
        ]);
        break;

    case 'meta_password':
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $pwdFile = $metaDir . '/password.json';
        $pwdData = file_exists($pwdFile) ? json_decode(file_get_contents($pwdFile), true) : [];
        echo json_encode(['success' => true, 'password' => $pwdData['password'] ?? '']);
        break;

    case 'meta_save_password':
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $pwd = trim($input['password'] ?? '');
        if (!$pwd) {
            echo json_encode(['success' => false, 'error' => 'Password cannot be empty.']);
            break;
        }
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $pwdFile = $metaDir . '/password.json';
        @file_put_contents($pwdFile, json_encode(['password' => $pwd, 'saved_at' => date('c')], JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'message' => 'Creator password updated successfully!']);
        break;

    case 'meta_add_account':
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $uid = trim($input['uid'] ?? '');
        $name = trim($input['name'] ?? 'Meta User');
        $number = trim($input['number'] ?? '');
        $password = trim($input['password'] ?? '');
        $cookie = trim($input['cookie'] ?? '');
        $createdAt = trim($input['created_at'] ?? '') ?: date('Y-m-d H:i:s');

        if (!$uid && !$number) {
            echo json_encode(['success' => false, 'error' => 'UID or Phone Number is required.']);
            break;
        }

        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $accDir = $metaDir . '/accounts';
        @mkdir($accDir, 0777, true);
        $accJson = $accDir . '/accounts.json';
        $accTxt = $accDir . '/accounts.txt';
        $accounts = file_exists($accJson) ? (json_decode(file_get_contents($accJson), true) ?: []) : [];

        $newEntry = [
            'uid' => $uid,
            'name' => $name,
            'number' => $number,
            'password' => $password,
            'cookie' => $cookie,
            'created_at' => $createdAt
        ];

        $updated = false;
        foreach ($accounts as $k => $v) {
            if ($uid && ($v['uid'] ?? '') === $uid) {
                $accounts[$k] = $newEntry;
                $updated = true;
                break;
            } elseif (!$uid && $number && ($v['number'] ?? '') === $number) {
                $accounts[$k] = $newEntry;
                $updated = true;
                break;
            }
        }
        if (!$updated) {
            $accounts[] = $newEntry;
        }

        @file_put_contents($accJson, json_encode($accounts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $txtOut = '';
        foreach ($accounts as $a) {
            $txtOut .= ($a['uid'] ?? '') . '|' . ($a['password'] ?? '') . '|' . ($a['cookie'] ?? '') . '|' . ($a['number'] ?? '') . '|' . ($a['name'] ?? '') . '|' . ($a['created_at'] ?? '') . "\n";
        }
        @file_put_contents($accTxt, $txtOut);
        echo json_encode(['success' => true, 'message' => 'Account saved successfully!', 'account' => $newEntry]);
        break;

    case 'meta_delete_account':
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $uid = trim($input['uid'] ?? '');
        $number = trim($input['number'] ?? '');
        if (!$uid && !$number) {
            echo json_encode(['success' => false, 'error' => 'UID or Number is required.']);
            break;
        }

        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $accJson = $metaDir . '/accounts/accounts.json';
        $accTxt = $metaDir . '/accounts/accounts.txt';
        $accounts = file_exists($accJson) ? (json_decode(file_get_contents($accJson), true) ?: []) : [];

        $clean = [];
        foreach ($accounts as $a) {
            if ($uid && ($a['uid'] ?? '') === $uid) continue;
            if (!$uid && $number && ($a['number'] ?? '') === $number) continue;
            $clean[] = $a;
        }

        @file_put_contents($accJson, json_encode($clean, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $txtOut = '';
        foreach ($clean as $a) {
            $txtOut .= ($a['uid'] ?? '') . '|' . ($a['password'] ?? '') . '|' . ($a['cookie'] ?? '') . '|' . ($a['number'] ?? '') . '|' . ($a['name'] ?? '') . '|' . ($a['created_at'] ?? '') . "\n";
        }
        @file_put_contents($accTxt, $txtOut);
        echo json_encode(['success' => true, 'message' => 'Account deleted successfully!']);
        break;

    case 'meta_deduplicate':
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $accJson = $metaDir . '/accounts/accounts.json';
        $accTxt = $metaDir . '/accounts/accounts.txt';
        $accounts = file_exists($accJson) ? (json_decode(file_get_contents($accJson), true) ?: []) : [];

        $seen = [];
        $unique = [];
        for ($i = count($accounts) - 1; $i >= 0; $i--) {
            $a = $accounts[$i];
            $key = trim($a['uid'] ?? $a['number'] ?? '');
            if ($key !== '' && !isset($seen[$key])) {
                $seen[$key] = true;
                $unique[] = $a;
            } elseif ($key === '') {
                $unique[] = $a;
            }
        }
        $unique = array_reverse($unique);
        $removed = count($accounts) - count($unique);

        @file_put_contents($accJson, json_encode($unique, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $txtOut = '';
        foreach ($unique as $a) {
            $txtOut .= ($a['uid'] ?? '') . '|' . ($a['password'] ?? '') . '|' . ($a['cookie'] ?? '') . '|' . ($a['number'] ?? '') . '|' . ($a['name'] ?? '') . '|' . ($a['created_at'] ?? '') . "\n";
        }
        @file_put_contents($accTxt, $txtOut);
        echo json_encode(['success' => true, 'message' => "Cleaned $removed duplicate accounts.", 'removed' => $removed, 'remaining' => count($unique)]);
        break;

    case 'meta_check_uid':
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $uid = trim($input['uid'] ?? '');
        if (!$uid) {
            echo json_encode(['success' => false, 'error' => 'UID is required.']);
            break;
        }
        $url = "https://graph.facebook.com/{$uid}/picture?type=normal";
        $headers = @get_headers($url, 1);
        $status = 'UNKNOWN';
        if ($headers && isset($headers['Location'])) {
            $loc = is_array($headers['Location']) ? end($headers['Location']) : $headers['Location'];
            $status = (strpos($loc, 'static.xx.fbcdn.net/rsrc.php') === false) ? 'LIVE' : 'CHECKPOINT/INACTIVE';
        }
        echo json_encode(['success' => true, 'uid' => $uid, 'status' => $status]);
        break;

    case 'meta_telegram':
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $cfgFile = $metaDir . '/meta_config.json';
        $cfg = file_exists($cfgFile) ? json_decode(file_get_contents($cfgFile), true) : [];
        $cfg['telegram_enabled'] = !empty($input['enabled']);
        $cfg['telegram_token'] = trim($input['token'] ?? '');
        $cfg['telegram_chat_id'] = trim($input['chat_id'] ?? '');
        @file_put_contents($cfgFile, json_encode($cfg, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'message' => 'Telegram settings updated successfully!']);
        break;

    case 'meta_test_telegram':
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $token = trim($input['token'] ?? '');
        $chatId = trim($input['chat_id'] ?? '');
        if (!$token || !$chatId) {
            echo json_encode(['success' => false, 'error' => 'Bot Token and Chat ID are required.']);
            break;
        }
        $url = "https://api.telegram.org/bot{$token}/sendMessage";
        $data = json_encode([
            'chat_id' => $chatId,
            'text' => '🔔 <b>Foysal Tools Admin Panel</b>: Meta Horizon Pro Telegram Alert Connected Successfully! ⚡',
            'parse_mode' => 'HTML'
        ]);
        $ctx = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/json\r\n",
                'content' => $data,
                'timeout' => 8
            ]
        ]);
        $res = @file_get_contents($url, false, $ctx);
        if ($res) {
            $parsed = json_decode($res, true);
            if (!empty($parsed['ok'])) {
                echo json_encode(['success' => true, 'message' => 'Test alert sent to Telegram!']);
            } else {
                echo json_encode(['success' => false, 'error' => $parsed['description'] ?? 'Telegram error']);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Connection to Telegram failed']);
        }
        break;

    case 'meta_clear_accounts':
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        @unlink($metaDir . '/accounts/accounts.json');
        @unlink($metaDir . '/accounts/accounts.txt');
        echo json_encode(['success' => true, 'message' => 'Account logs cleared!']);
        break;

    case 'meta_mail_config':
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $cfgFile = $metaDir . '/mail_config.json';
        $cfg = [
            'hotmail_api_key' => 'e47bd8443425bb40b48239f0e5befddfa8f86e3205909c0b',
            'default_product_id' => 14,
            'auto_save_to_meta' => true,
            'auto_watch_otp' => true,
            'otp_timeout_sec' => 60
        ];
        if (file_exists($cfgFile)) {
            $saved = json_decode(file_get_contents($cfgFile), true);
            if (is_array($saved)) $cfg = array_merge($cfg, $saved);
        }
        $balanceInfo = null;
        if (!empty($cfg['hotmail_api_key'])) {
            $opts = [
                'http' => [
                    'method' => 'GET',
                    'header' => "Authorization: Bearer {$cfg['hotmail_api_key']}\r\nContent-Type: application/json\r\n",
                    'timeout' => 5
                ]
            ];
            $ctx = stream_context_create($opts);
            $res = @file_get_contents('https://hotmail143.com/api/v1/me', false, $ctx);
            if ($res) {
                $j = json_decode($res, true);
                if (!empty($j['success'])) $balanceInfo = $j['data'] ?? null;
            }
        }
        echo json_encode(['success' => true, 'config' => $cfg, 'balance_info' => $balanceInfo]);
        break;

    case 'meta_mail_save_config':
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $cfgFile = $metaDir . '/mail_config.json';
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $cfg = [
            'hotmail_api_key' => 'e47bd8443425bb40b48239f0e5befddfa8f86e3205909c0b',
            'default_product_id' => 14,
            'auto_save_to_meta' => true,
            'auto_watch_otp' => true,
            'otp_timeout_sec' => 60
        ];
        if (file_exists($cfgFile)) {
            $saved = json_decode(file_get_contents($cfgFile), true);
            if (is_array($saved)) $cfg = array_merge($cfg, $saved);
        }
        if (isset($input['hotmail_api_key'])) $cfg['hotmail_api_key'] = trim($input['hotmail_api_key']);
        if (isset($input['default_product_id'])) $cfg['default_product_id'] = (int)$input['default_product_id'];
        if (isset($input['auto_save_to_meta'])) $cfg['auto_save_to_meta'] = (bool)$input['auto_save_to_meta'];
        if (isset($input['auto_watch_otp'])) $cfg['auto_watch_otp'] = (bool)$input['auto_watch_otp'];
        if (isset($input['otp_timeout_sec'])) $cfg['otp_timeout_sec'] = (int)$input['otp_timeout_sec'];

        @mkdir($metaDir, 0777, true);
        file_put_contents($cfgFile, json_encode($cfg, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'message' => 'Mail config saved!', 'config' => $cfg]);
        break;

    case 'meta_mail_products':
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $cfgFile = $metaDir . '/mail_config.json';
        $key = 'e47bd8443425bb40b48239f0e5befddfa8f86e3205909c0b';
        if (file_exists($cfgFile)) {
            $cfg = json_decode(file_get_contents($cfgFile), true);
            if (!empty($cfg['hotmail_api_key'])) $key = $cfg['hotmail_api_key'];
        }
        $opts = [
            'http' => [
                'method' => 'GET',
                'header' => "Authorization: Bearer {$key}\r\nContent-Type: application/json\r\n",
                'timeout' => 8
            ]
        ];
        $ctx = stream_context_create($opts);
        $res = @file_get_contents('https://hotmail143.com/api/v1/products', false, $ctx);
        if ($res) {
            $j = json_decode($res, true);
            echo json_encode(['success' => true, 'products' => $j['data'] ?? []]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to load products from Hotmail143']);
        }
        break;

    case 'meta_mail_history':
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $histFile = $metaDir . '/mail_history.json';
        $history = file_exists($histFile) ? (json_decode(file_get_contents($histFile), true) ?: []) : [];
        echo json_encode(['success' => true, 'history' => $history]);
        break;

    case 'meta_mail_delete':
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $histFile = $metaDir . '/mail_history.json';
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $id = $input['id'] ?? '';
        $email = $input['email'] ?? '';
        $history = file_exists($histFile) ? (json_decode(file_get_contents($histFile), true) ?: []) : [];
        $newHist = [];
        foreach ($history as $h) {
            if ($h['id'] !== $id && ($email === '' || ($h['email'] ?? '') !== $email)) {
                $newHist[] = $h;
            }
        }
        file_put_contents($histFile, json_encode($newHist, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'message' => 'Mail deleted']);
        break;

    case 'meta_mail_clear_history':
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $histFile = $metaDir . '/mail_history.json';
        file_put_contents($histFile, json_encode([], JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'message' => 'Mail history cleared!']);
        break;

    case 'meta_mail_save_to_meta':
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $accJson = $metaDir . '/accounts/accounts.json';
        $accTxt = $metaDir . '/accounts/accounts.txt';
        $histFile = $metaDir . '/mail_history.json';
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $email = trim($input['email'] ?? '');
        $pwd = trim($input['password'] ?? '');
        $cookie = trim($input['cookie'] ?? $input['refresh_token'] ?? 'MAIL_ORDERED');
        if (!$email) {
            echo json_encode(['success' => false, 'error' => 'Email required']);
            break;
        }
        $accounts = file_exists($accJson) ? (json_decode(file_get_contents($accJson), true) ?: []) : [];
        $exists = false;
        foreach ($accounts as $a) {
            if (($a['uid'] ?? '') === $email || ($a['number'] ?? '') === $email) {
                $exists = true;
                break;
            }
        }
        if (!$exists) {
            $accounts[] = [
                'uid' => $email,
                'name' => 'Mail Account',
                'number' => $email,
                'password' => $pwd,
                'cookie' => $cookie,
                'created_at' => date('Y-m-d H:i:s')
            ];
            @mkdir($metaDir . '/accounts', 0777, true);
            file_put_contents($accJson, json_encode($accounts, JSON_PRETTY_PRINT));
            $line = "{$email}|{$pwd}|{$cookie}|{$email}|Mail Account|" . date('Y-m-d H:i:s') . "\n";
            file_put_contents($accTxt, $line, FILE_APPEND);
        }
        $history = file_exists($histFile) ? (json_decode(file_get_contents($histFile), true) ?: []) : [];
        foreach ($history as &$h) {
            if (strtolower($h['email'] ?? '') === strtolower($email)) {
                $h['saved_to_meta'] = true;
            }
        }
        file_put_contents($histFile, json_encode($history, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'message' => "Account {$email} saved to Meta Horizon Hub!"]);
        break;

    case 'meta_mail_buy':
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $cfgFile = $metaDir . '/mail_config.json';
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $key = 'e47bd8443425bb40b48239f0e5befddfa8f86e3205909c0b';
        $defPid = 14;
        $autoSave = true;
        if (file_exists($cfgFile)) {
            $cfg = json_decode(file_get_contents($cfgFile), true);
            if (!empty($cfg['hotmail_api_key'])) $key = $cfg['hotmail_api_key'];
            if (!empty($cfg['default_product_id'])) $defPid = (int)$cfg['default_product_id'];
            if (isset($cfg['auto_save_to_meta'])) $autoSave = (bool)$cfg['auto_save_to_meta'];
        }
        if (!empty($input['hotmail_api_key'])) $key = trim($input['hotmail_api_key']);
        $pid = !empty($input['product_id']) ? (int)$input['product_id'] : $defPid;
        $qty = !empty($input['quantity']) ? (int)$input['quantity'] : 1;
        $qty = max(1, min(100, $qty));
        if (isset($input['auto_save_to_meta'])) $autoSave = (bool)$input['auto_save_to_meta'];

        $accs = [];
        $firstErr = null;
        $rem = $qty;
        while ($rem > 0) {
            $chunk = min(10, $rem);
            $payload = json_encode(['product_id' => $pid, 'quantity' => $chunk]);
            $idempKey = bin2hex(random_bytes(16));
            $opts = [
                'http' => [
                    'method' => 'POST',
                    'header' => "Authorization: Bearer {$key}\r\nContent-Type: application/json\r\nIdempotency-Key: {$idempKey}\r\n",
                    'content' => $payload,
                    'timeout' => 60,
                    'ignore_errors' => true
                ]
            ];
            $ctx = stream_context_create($opts);
            $res = @file_get_contents('https://hotmail143.com/api/v1/orders', false, $ctx);
            if ($res) {
                $d = json_decode($res, true);
                if (!empty($d['success']) && !empty($d['data']['accounts'])) {
                    $accs = array_merge($accs, $d['data']['accounts']);
                } else {
                    if (!$firstErr) $firstErr = $d['error']['message'] ?? $d['message'] ?? 'Failed to buy batch';
                }
            } else {
                if (!$firstErr) $firstErr = 'Connection failed to hotmail143';
            }
            $rem -= $chunk;
        }

        if (empty($accs)) {
            echo json_encode(['success' => false, 'error' => $firstErr ?: 'No accounts returned']);
            break;
        }
        $histFile = $metaDir . '/mail_history.json';
        $history = file_exists($histFile) ? (json_decode(file_get_contents($histFile), true) ?: []) : [];
        $accJson = $metaDir . '/accounts/accounts.json';
        $accTxt = $metaDir . '/accounts/accounts.txt';
        $metaAccounts = file_exists($accJson) ? (json_decode(file_get_contents($accJson), true) ?: []) : [];
        $newlyBought = [];
        $now = date('Y-m-d H:i:s');

        foreach ($accs as $rawAcc) {
            $parts = explode('|', (string)$rawAcc);
            $em = trim($parts[0] ?? '');
            $pw = trim($parts[1] ?? '');
            $rt = trim($parts[2] ?? '');
            $ci = trim($parts[3] ?? '');

            $entry = [
                'id' => 'mail_' . round(microtime(true) * 1000) . '_' . count($newlyBought),
                'email' => $em,
                'password' => $pw,
                'refresh_token' => $rt,
                'client_id' => $ci,
                'raw_account' => trim((string)$rawAcc),
                'product_id' => $pid,
                'created_at' => $now,
                'otp_status' => 'WAITING',
                'last_otp' => '',
                'saved_to_meta' => $autoSave
            ];
            $newlyBought[] = $entry;
            array_unshift($history, $entry);

            if ($autoSave && $em) {
                $metaAccounts[] = [
                    'uid' => $em,
                    'name' => 'Mail Account',
                    'number' => $em,
                    'password' => $pw,
                    'cookie' => $rt ?: 'MAIL_ORDERED',
                    'created_at' => $now
                ];
                $line = "{$em}|{$pw}|" . ($rt ?: 'MAIL_ORDERED') . "|{$em}|Mail Account|{$now}\n";
                @mkdir($metaDir . '/accounts', 0777, true);
                file_put_contents($accTxt, $line, FILE_APPEND);
            }
        }
        @mkdir($metaDir, 0777, true);
        file_put_contents($histFile, json_encode($history, JSON_PRETTY_PRINT));
        if ($autoSave) {
            file_put_contents($accJson, json_encode($metaAccounts, JSON_PRETTY_PRINT));
        }
        echo json_encode([
            'success' => true,
            'message' => 'Mail bought successfully!',
            'accounts' => $newlyBought,
            'first_account' => $newlyBought[0] ?? null
        ]);
        break;

    case 'meta_mail_otp':
        $metaDir = '/data/data/com.termux/files/home/META-HORIZONE';
        $cfgFile = $metaDir . '/mail_config.json';
        $histFile = $metaDir . '/mail_history.json';
        $input = json_decode(file_get_contents('php://input'), true) ?: $_REQUEST;
        
        $hotmailApiKey = 'e47bd8443425bb40b48239f0e5befddfa8f86e3205909c0b';
        if (file_exists($cfgFile)) {
            $cfg = json_decode(file_get_contents($cfgFile), true);
            if (!empty($cfg['hotmail_api_key'])) $hotmailApiKey = $cfg['hotmail_api_key'];
        }
        if (!empty($input['hotmail_api_key'])) $hotmailApiKey = trim($input['hotmail_api_key']);
        if (!empty($input['apikey'])) $hotmailApiKey = trim($input['apikey']);
        
        $email = trim($input['email'] ?? $input['uid'] ?? $input['raw_account'] ?? '');
        $password = trim($input['password'] ?? '');
        $refreshToken = trim($input['refresh_token'] ?? $input['token'] ?? '');
        $clientId = trim($input['client_id'] ?? '');
        $serviceType = strtolower(trim($input['type'] ?? 'facebook'));
        $rawAccount = trim($input['raw_account'] ?? '');

        if (!$email) {
            echo json_encode(['success' => false, 'error' => 'Email or full account combo is required']);
            break;
        }

        if (strpos($email, '|') !== false) {
            $parts = explode('|', $email);
            $email = trim($parts[0] ?? '');
            if (empty($password) && !empty($parts[1])) $password = trim($parts[1]);
            if (empty($refreshToken) && !empty($parts[2])) $refreshToken = trim($parts[2]);
            if (empty($clientId) && !empty($parts[3])) $clientId = trim($parts[3]);
            if (empty($rawAccount)) $rawAccount = $email;
        }

        $history = file_exists($histFile) ? (json_decode(file_get_contents($histFile), true) ?: []) : [];
        foreach ($history as $h) {
            if (strtolower($h['email'] ?? '') === strtolower($email)) {
                if (empty($refreshToken) && !empty($h['refresh_token'])) $refreshToken = $h['refresh_token'];
                if (empty($clientId) && !empty($h['client_id'])) $clientId = $h['client_id'];
                if (empty($password) && !empty($h['password'])) $password = $h['password'];
                if (empty($rawAccount) && !empty($h['raw_account'])) $rawAccount = $h['raw_account'];
                break;
            }
        }
        $fullComboStr = $rawAccount ?: "{$email}|{$password}|{$refreshToken}|{$clientId}";

        $foundOtp = '';
        $statusVal = 'WAITING';
        $messages = [];
        $contentMsg = '';
        $rawResp = [];
        $errorMsg = null;

        // 1. DUAL ENGINE: DIRECT MICROSOFT OAUTH2 IMAP INBOX READER
        if (!empty($refreshToken)) {
            $payloadJson = json_encode([
                'email' => $email,
                'password' => $password,
                'refresh_token' => $refreshToken,
                'client_id' => $clientId ?: '9e5f94bc-e8a4-4e73-b8be-63364c29d753'
            ]);
            $tmpIn = tempnam(sys_get_temp_dir(), 'otp_in_');
            file_put_contents($tmpIn, $payloadJson);
            $pyCode = 'import sys, json, requests, imaplib, email as email_pkg, re
from email.header import decode_header
try:
    with open(sys.argv[1]) as f: p = json.load(f)
    email_addr = p.get("email")
    rf_tok = p.get("refresh_token")
    cid = p.get("client_id") or "9e5f94bc-e8a4-4e73-b8be-63364c29d753"
    t_url = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
    t_payload = {"client_id": cid, "scope": "https://outlook.office.com/IMAP.AccessAsUser.All offline_access", "grant_type": "refresh_token", "refresh_token": rf_tok}
    r = requests.post(t_url, data=t_payload, timeout=12)
    if r.status_code == 200:
        acc_tok = r.json().get("access_token")
        if acc_tok:
            auth_str = f"user={email_addr}\x01auth=Bearer {acc_tok}\x01\x01"
            imap = imaplib.IMAP4_SSL("outlook.office365.com", 993)
            auth_t, _ = imap.authenticate("XOAUTH2", lambda x: auth_str)
            if auth_t == "OK":
                imap.select("INBOX")
                typ, ids = imap.search(None, "ALL")
                if ids and ids[0]:
                    all_ids = ids[0].split()
                    recent = list(reversed(all_ids[-12:]))
                    best_cand = None
                    best_score = 0
                    best_content = ""
                    for mid in recent:
                        typ, mdata = imap.fetch(mid, "(RFC822)")
                        if typ != "OK" or not mdata: continue
                        parsed = email_pkg.message_from_bytes(mdata[0][1])
                        subj_raw = parsed.get("Subject", "")
                        subj_parts = decode_header(subj_raw)
                        subj = "".join([part.decode(enc or "utf-8", "ignore") if isinstance(part, bytes) else str(part) for part, enc in subj_parts])
                        from_addr = str(parsed.get("From", ""))
                        body = ""
                        if parsed.is_multipart():
                            for ppart in parsed.walk():
                                if ppart.get_content_type() in ["text/plain", "text/html"]:
                                    pl = ppart.get_payload(decode=True)
                                    if pl: body += pl.decode("utf-8", "ignore") + "\n"
                        else:
                            pl = parsed.get_payload(decode=True)
                            if pl: body = pl.decode("utf-8", "ignore")
                        subj_code = re.search(r"(?:code|código|otp|verification|security|login|confirm)[\s\:\-\–\—\#\*]*([0-9]{5,8})", subj, re.I)
                        if not subj_code: subj_code = re.search(r"([0-9]{5,8})[\s\:\-\–\—]*(?:is your|to log in|to confirm)", subj, re.I)
                        if not subj_code and ("code" in subj.lower() or "otp" in subj.lower()): subj_code = re.search(r"\b([0-9]{5,8})\b", subj)
                        if subj_code and best_score < 30:
                            c = subj_code.group(1)
                            if c != "94025" and not (c.startswith("202") and len(c) == 4):
                                best_cand = c; best_score = 30; best_content = f"Subject: {subj}"; break
                        body_code = re.search(r"(?:code|código|otp|verification|security code|login code|confirmation code|confirmation pin)[\s\:\-\–\—\#\*]*([0-9]{5,8})", body, re.I)
                        if not body_code: body_code = re.search(r"([0-9]{5,8})[\s\:\-\–\—]*(?:is your|to log in|is the code|to confirm)", body, re.I)
                        if body_code and best_score < 20:
                            c = body_code.group(1)
                            if c != "94025": best_cand = c; best_score = 20; best_content = f"Subject: {subj}"
                        if ("meta" in from_addr.lower() or "facebook" in from_addr.lower()) and best_score < 10:
                            for d in re.findall(r"\b([0-9]{6,8})\b", body):
                                if d not in ["94025", "202400", "202500", "202600"] and not d.startswith("202"):
                                    best_cand = d; best_score = 10; best_content = f"Subject: {subj}"; break
                    imap.logout()
                    if best_cand:
                        print(json.dumps({"success": True, "otp": best_cand, "content": best_content}))
                        sys.exit(0)
    print(json.dumps({"success": False}))
except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))';
            $pyCmd = "python3 -c " . escapeshellarg($pyCode) . " " . escapeshellarg($tmpIn) . " 2>&1";
            $pyOut = exec($pyCmd);
            @unlink($tmpIn);
            if ($pyOut) {
                $pyRes = json_decode($pyOut, true);
                if (!empty($pyRes['success']) && !empty($pyRes['otp'])) {
                    $foundOtp = $pyRes['otp'];
                    $statusVal = 'RECEIVED';
                    $contentMsg = $pyRes['content'] ?? 'OAuth2 IMAP Extraction';
                    $messages[] = [
                        'subject' => $contentMsg,
                        'body' => "OTP Code: {$foundOtp} (via Microsoft OAuth2 IMAP)",
                        'date' => date('Y-m-d H:i:s')
                    ];
                }
            }
        }

        // 2. HOTMAIL143 DEDICATED NATIVE OTP ENGINE FALLBACK
        // Endpoint: GET https://hotmail143.com/api/v1/otp-orders/lookup?email={email}
        if (empty($foundOtp)) {
            $hUrl = "https://hotmail143.com/api/v1/otp-orders/lookup?email=" . urlencode($email);
        $chH = curl_init($hUrl);
        curl_setopt_array($chH, [
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer {$hotmailApiKey}",
                "Content-Type: application/json"
            ],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15
        ]);
        $hResp = curl_exec($chH);
        $httpCode = curl_getinfo($chH, CURLINFO_HTTP_CODE);
        curl_close($chH);

        if ($hResp) {
            $hData = json_decode($hResp, true);
            $rawResp = $hData;
            if (is_array($hData) && !empty($hData['success'])) {
                $orderInfo = $hData['data'] ?? [];
                $codeVal = trim((string)($orderInfo['code'] ?? ''));
                $statusVal = trim((string)($orderInfo['status'] ?? 'PENDING'));
                $updatedAt = $orderInfo['updated_at'] ?? date('Y-m-d H:i:s');
                $contentMsg = "Status: {$statusVal} | Code: {$codeVal}";
                $messages[] = [
                    'subject' => "Hotmail143 [" . strtoupper($statusVal) . "]",
                    'body' => "OTP Code: {$codeVal} (Order Status: {$statusVal})",
                    'date' => $updatedAt
                ];
                if ($codeVal && !in_array(strtolower($codeVal), ['none', 'null', ''])) {
                    $foundOtp = $codeVal;
                }
            } else {
                $errorMsg = $hData['error']['message'] ?? $hData['message'] ?? 'No active OTP order found on Hotmail143';
            }
        } else {
            $errorMsg = "Connection failed to Hotmail143 (HTTP {$httpCode})";
        }
        }

        // Update history
        $updatedHist = false;
        foreach ($history as &$h) {
            if (strtolower($h['email'] ?? '') === strtolower($email)) {
                if ($foundOtp) {
                    $h['last_otp'] = $foundOtp;
                    $h['otp_status'] = 'COMPLETED';
                } elseif ($statusVal && $statusVal !== 'WAITING') {
                    $h['otp_status'] = strtoupper($statusVal);
                }
                if (empty($h['raw_account'])) $h['raw_account'] = $fullComboStr;
                $h['last_checked_at'] = date('Y-m-d H:i:s');
                $updatedHist = true;
                break;
            }
        }
        if ($updatedHist) {
            file_put_contents($histFile, json_encode($history, JSON_PRETTY_PRINT));
        }

        echo json_encode([
            'success' => true,
            'found' => (bool)$foundOtp,
            'otp' => $foundOtp,
            'code' => $foundOtp,
            'status' => $statusVal,
            'content' => $contentMsg,
            'email' => $email,
            'password' => $password,
            'refresh_token' => $refreshToken,
            'client_id' => $clientId,
            'raw_account' => $fullComboStr,
            'service_type' => $serviceType,
            'links' => [],
            'messages' => $messages,
            'raw' => $rawResp,
            'error_details' => $errorMsg
        ]);
        break;

        break;

    default:
        echo json_encode([
            'status' => 'active',
            'message' => 'Foysal Tools Multi-Language API Endpoint is running.',
            'languages' => ['python', 'php', 'java', 'bash', 'html_sandbox'],
            'timestamp' => time()
        ]);
        break;
}
