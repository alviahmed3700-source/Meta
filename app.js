/* ============================================================
   FOYSAL TOOLS - ADVANCED APPLICATION & TOOL STUDIO ENGINE
   Multi-Language: Python 3, Java 17, HTML/JS, Bash, PHP
   Author: Foysal Tools Admin System
   ============================================================ */

// DEFAULT SYSTEM TOOLS
const DEFAULT_TOOLS = [
  {
    id: 'tool_meta_horizone',
    name: 'Meta All',
    category: 'Automation & AI',
    type: 'builtin',
    lang: 'python',
    action: 'openBuiltinModal("meta-modal")',
    icon: 'fa-robot',
    badge: 'META ALL 🔥',
    pinned: true,
    description: 'All-in-one Meta Horizon & Facebook accounts manager, cookie extractor, password sync, creator console & deduplication.'
  },
  {
    id: 'tool_auto_mail_otp',
    name: 'Auto Mail & OTP Studio',
    category: 'Automation & AI',
    type: 'view',
    lang: 'python',
    action: 'switchView("mail")',
    icon: 'fa-envelope-circle-check',
    badge: 'LIVE OTP ⚡',
    pinned: true,
    description: 'Hotmail143 1-by-1 bulk mail buy, Microsoft OAuth2 IMAP live OTP extraction & Meta AI sync.'
  },
  {
    id: 'tool_hash',
    name: 'Cyber Hash Generator',
    category: 'Security & Crypto',
    type: 'builtin',
    lang: 'builtin',
    action: 'openBuiltinModal("hash-modal")',
    icon: 'fa-fingerprint',
    badge: 'CORE',
    pinned: true,
    description: 'Instant MD5, SHA-1, SHA-256, SHA-512 hashes & live hash matching.'
  },
  {
    id: 'tool_codec',
    name: 'Multi-Encoder & Decoder',
    category: 'Security & Crypto',
    type: 'builtin',
    lang: 'builtin',
    action: 'openBuiltinModal("codec-modal")',
    icon: 'fa-binary',
    badge: 'CRYPTO',
    pinned: true,
    description: 'Base64, Hexadecimal, Binary, URL & ROT13 cipher codec.'
  },
  {
    id: 'tool_pass',
    name: 'Military Password Gen',
    category: 'Security & Crypto',
    type: 'builtin',
    lang: 'builtin',
    action: 'openBuiltinModal("pass-modal")',
    icon: 'fa-shield-halved',
    badge: 'SECURITY',
    pinned: true,
    description: 'High entropy secure passwords, 256-bit API keys, & UUIDv4 generator.'
  },
  {
    id: 'tool_ip',
    name: 'Live IP & Geo Intelligence',
    category: 'Networking',
    type: 'builtin',
    lang: 'builtin',
    action: 'openBuiltinModal("ip-modal")',
    icon: 'fa-globe',
    badge: 'NETWORK',
    pinned: true,
    description: 'Query public IP, ASN, ISP, city, country, coordinates and map.'
  },
  {
    id: 'tool_dns',
    name: 'Cloudflare DNS Resolver',
    category: 'Networking',
    type: 'builtin',
    lang: 'builtin',
    action: 'openBuiltinModal("dns-modal")',
    icon: 'fa-network-wired',
    badge: 'LIVE',
    pinned: false,
    description: 'Real-time DNS query for A, AAAA, MX, TXT, CNAME records.'
  },
  {
    id: 'tool_json',
    name: 'JSON Beautifier & Validator',
    category: 'Developer Tools',
    type: 'builtin',
    lang: 'builtin',
    action: 'openBuiltinModal("json-modal")',
    icon: 'fa-code',
    badge: 'DEV',
    pinned: false,
    description: 'Format, validate, minify and debug complex JSON payloads.'
  },
  {
    id: 'tool_regex',
    name: 'Regex Pattern Tester',
    category: 'Developer Tools',
    type: 'builtin',
    lang: 'builtin',
    action: 'openBuiltinModal("regex-modal")',
    icon: 'fa-spell-check',
    badge: 'DEV',
    pinned: false,
    description: 'Real-time regular expression tester with flags and match groups.'
  },
  {
    id: 'tool_text',
    name: 'Text Transformer Studio',
    category: 'Developer Tools',
    type: 'builtin',
    lang: 'builtin',
    action: 'openBuiltinModal("text-modal")',
    icon: 'fa-font',
    badge: 'TEXT',
    pinned: false,
    description: 'Case converter, slugifier, reverse text, and character counter.'
  },
  {
    id: 'tool_qr',
    name: 'High-Tech QR Code Maker',
    category: 'Developer Tools',
    type: 'builtin',
    lang: 'builtin',
    action: 'openBuiltinModal("qr-modal")',
    icon: 'fa-qrcode',
    badge: 'FAST',
    pinned: false,
    description: 'Generate customizable cyber QR codes with instant download.'
  },
  {
    id: 'tool_termux',
    name: 'Termux Command Hub',
    category: 'Termux Supercharger',
    type: 'view',
    lang: 'cmd',
    action: 'switchView("termux")',
    icon: 'fa-terminal',
    badge: 'TERMUX',
    pinned: true,
    description: 'One-click shell commands for Termux packages, servers, and tunnels.'
  }
];

// PRESET CODE TEMPLATES
const CODE_TEMPLATES = {
  python: `# Foysal Tools - Python 3 Engine
import sys, platform, os

print("=== FOYSAL PYTHON 3 RUNNER ===")
print(f"System: {platform.system()} {platform.release()}")
print(f"Python: {sys.version.split()[0]}")
print(f"Directory: {os.getcwd()}")
print("===============================")

# Sample Calculation / Script
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]
print(f"Calculated Squares: {squares}")
print("Status: Python script executed successfully!")
`,
  html: `<!-- Foysal Tools - Interactive HTML/JS Webview -->
<div style="font-family: sans-serif; text-align: center; padding: 25px;">
  <h2 style="color: #00f0ff; margin-bottom: 10px;">⚡ Foysal Interactive Web Tool ⚡</h2>
  <p style="color: #94a3b8; font-size: 13px;">This tool runs inside a secure, high-performance sandbox.</p>
  
  <div style="margin: 20px 0;">
    <input id="demo-in" type="text" placeholder="Type something..." 
      style="padding: 10px; border-radius: 6px; border: 1px solid #00f0ff; background: #0b1120; color: #fff; width: 70%; max-width: 300px;">
    <br><br>
    <button onclick="document.getElementById('demo-out').innerText = 'Output: ' + document.getElementById('demo-in').value.toUpperCase()" 
      style="padding: 9px 20px; border-radius: 6px; border: none; background: #00f0ff; color: #000; font-weight: bold; cursor: pointer;">
      Transform Text
    </button>
  </div>
  
  <div id="demo-out" style="color: #10b981; font-weight: bold; font-family: monospace; font-size: 14px; min-height: 24px;"></div>
</div>
`,
  java: `// Foysal Tools - Java 17 OpenJDK Engine
public class Main {
    public static void main(String[] args) {
        System.out.println("=== FOYSAL JAVA 17 RUNNER ===");
        System.out.println("Java Vendor : " + System.getProperty("java.vendor"));
        System.out.println("Java Version: " + System.getProperty("java.version"));
        System.out.println("OS Name     : " + System.getProperty("os.name"));
        System.out.println("=============================");
        
        int a = 15, b = 25;
        System.out.println("Sum of " + a + " + " + b + " = " + (a + b));
        System.out.println("Java program compiled and executed cleanly!");
    }
}
`,
  bash: `#!/data/data/com.termux/files/usr/bin/bash
# Foysal Tools - Shell / Bash Runner
echo "=== FOYSAL BASH RUNNER ==="
echo "Date & Time : $(date)"
echo "Current User: $(whoami 2>/dev/null || echo 'termux_user')"
echo "Kernel      : $(uname -r)"
echo "Uptime      : $(uptime -p 2>/dev/null || uptime)"
echo "=========================="
echo "Disk Usage  : $(df -h . | tail -n 1 | awk '{print $3 \" used of \" $2}')"
echo "Bash script execution complete!"
`,
  php: `<?php
// Foysal Tools - PHP 8 Engine
echo "=== FOYSAL PHP 8 RUNNER ===\n";
echo "PHP Version: " . PHP_VERSION . "\n";
echo "Server Time: " . date("Y-m-d H:i:s") . "\n";
echo "Memory Peak: " . round(memory_get_peak_usage(true)/1024/1024, 2) . " MB\n";
echo "===========================\n";

$data = ["status" => "active", "creator" => "Foysal Ahmed", "platform" => "HopWeb & Termux"];
echo "JSON Output: " . json_encode($data, JSON_PRETTY_PRINT) . "\n";
`,
  iframe: `https://tools.pingdom.com/`
};

class FoysalApp {
  constructor() {
    this.tools = [];
    this.categories = ['All', 'Security & Crypto', 'Networking', 'Developer Tools', 'Termux Supercharger', 'My Custom Tools'];
    this.activeCategory = 'All';
    this.searchQuery = '';
    this.activeView = 'dashboard';
    this.currentEditingId = null;

    this.config = {
      title: 'Foysal Tools',
      adminName: 'Foysal Ahmed',
      adminRole: 'Cyber Administrator',
      theme: 'cyan',
      matrixBg: true,
      pinLock: '',
      customCss: ''
    };

    this.init();
  }

  init() {
    this.loadState();
    this.applySettings();
    this.setupEventListeners();
    this.renderStats();
    this.renderAllTools();
    this.renderPinnedTools();
    this.renderCustomToolsManager();
    this.startClock();
    this.detectEnvironment();
    this.setupTouchHandler();

    // Set default code in editor
    this.setLanguageTemplate('python');

    if (this.config.pinLock) {
      this.promptPinLock();
    }
  }

  loadState() {
    // Config
    const savedConfig = localStorage.getItem('foysal_tools_config');
    if (savedConfig) {
      try {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      } catch (e) {
        console.error(e);
      }
    }

    // Deleted tool IDs (allows manual deletion of ANY tool, builtin or custom)
    let deletedIds = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('foysal_deleted_tool_ids') || '[]');
    } catch (e) {
      deletedIds = [];
    }

    const availableDefault = DEFAULT_TOOLS.filter(t => !deletedIds.includes(t.id));

    // Custom tools
    const savedTools = localStorage.getItem('foysal_custom_tools');
    if (savedTools) {
      try {
        const customTools = JSON.parse(savedTools).filter(t => !deletedIds.includes(t.id));
        this.tools = [...availableDefault, ...customTools];
      } catch (e) {
        this.tools = [...availableDefault];
      }
    } else {
      this.tools = [...availableDefault];
    }
  }

  saveConfig() {
    localStorage.setItem('foysal_tools_config', JSON.stringify(this.config));
    if (typeof window.syncTermuxBackupAuto === 'function') {
      window.syncTermuxBackupAuto();
    }
  }

  saveCustomTools() {
    const customOnly = this.tools.filter(t => t.type !== 'builtin' && t.id !== 'tool_termux');
    localStorage.setItem('foysal_custom_tools', JSON.stringify(customOnly));

    // Also sync to server if PHP is alive
    fetch('api.php?action=save_backup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        config: this.config,
        customTools: customOnly,
        timestamp: Date.now()
      })
    }).catch(() => {});

    // Automatically synchronize disaster recovery archive to /sdcard/Download
    if (typeof window.syncTermuxBackupAuto === 'function') {
      window.syncTermuxBackupAuto();
    }
  }

  applySettings() {
    document.body.setAttribute('data-theme', this.config.theme || 'cyan');
    document.title = `${this.config.title} - Advanced Cyber Admin Panel`;

    document.querySelectorAll('.app-brand-title').forEach(el => el.textContent = this.config.title);
    document.querySelectorAll('.app-admin-name').forEach(el => el.textContent = this.config.adminName);
    document.querySelectorAll('.app-admin-role').forEach(el => el.textContent = this.config.adminRole);

    if (window.matrixBg) {
      window.matrixBg.toggle(this.config.matrixBg);
    }

    let customStyleTag = document.getElementById('foysal-custom-css');
    if (!customStyleTag) {
      customStyleTag = document.createElement('style');
      customStyleTag.id = 'foysal-custom-css';
      document.head.appendChild(customStyleTag);
    }
    customStyleTag.textContent = this.config.customCss || '';
  }

  setupTouchHandler() {
    // Android Webview touch optimization
    document.querySelectorAll('button, a, input, select').forEach(el => {
      el.style.touchAction = 'manipulation';
    });
  }

  setupEventListeners() {
    // Advanced Global Search with live auto-switch
    const searchInput = document.getElementById('global-search');
    const searchClear = document.getElementById('search-clear-btn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        
        if (searchClear) {
          searchClear.classList.toggle('hidden', !this.searchQuery);
        }

        // Auto switch to tools view when user types
        if (this.searchQuery && this.activeView !== 'tools') {
          this.switchView('tools');
        }

        this.renderAllTools();
      });

      // Keyboard shortcut: Press "/" to focus search
      window.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput && document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          searchInput.focus();
        }
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        this.searchQuery = '';
        searchClear.classList.add('hidden');
        this.renderAllTools();
      });
    }

    // File Upload Listener in Studio
    const fileInput = document.getElementById('studio-file-upload');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    }

    // Drag and drop for studio file
    const dropZone = document.getElementById('studio-drop-zone');
    if (dropZone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropZone.classList.add('border-[var(--primary)]', 'bg-[var(--primary)]/10');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropZone.classList.remove('border-[var(--primary)]', 'bg-[var(--primary)]/10');
        }, false);
      });

      dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
          this.processSelectedFile(files[0]);
        }
      });
    }

    // Builtin hash tool
    BuiltinTools.initHashTool();
  }

  // FILE UPLOAD PROCESSOR
  handleFileUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    this.processSelectedFile(files[0]);
  }

  processSelectedFile(file) {
    const name = file.name;
    const ext = name.split('.').pop().toLowerCase();
    const sizeKB = (file.size / 1024).toFixed(1);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const editor = document.getElementById('studio-code-editor');
      if (editor) editor.value = content;

      // Auto-set tool name (strip extension)
      const baseName = name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      const toolNameInput = document.getElementById('studio-tool-name');
      if (toolNameInput && !toolNameInput.value) {
        toolNameInput.value = baseName.charAt(0).toUpperCase() + baseName.slice(1);
      }

      // Auto-detect language
      let detectedLang = 'python';
      if (['html', 'htm'].includes(ext)) detectedLang = 'html';
      else if (['py', 'py3', 'python'].includes(ext)) detectedLang = 'python';
      else if (['java'].includes(ext)) detectedLang = 'java';
      else if (['sh', 'bash'].includes(ext)) detectedLang = 'bash';
      else if (['php'].includes(ext)) detectedLang = 'php';
      else if (['js', 'javascript'].includes(ext)) detectedLang = 'html';

      const langSelect = document.getElementById('studio-lang-select');
      if (langSelect) langSelect.value = detectedLang;

      // Update badge
      const badgeInput = document.getElementById('studio-tool-badge');
      if (badgeInput) badgeInput.value = detectedLang.toUpperCase();

      // Show upload indicator
      const infoBox = document.getElementById('studio-file-info');
      if (infoBox) {
        infoBox.innerHTML = `
          <div class="p-2.5 rounded-lg bg-green-500/20 border border-green-500 text-green-300 text-xs flex items-center justify-between">
            <span><i class="fa-solid fa-file-circle-check mr-2"></i><strong>${escapeHtml(name)}</strong> (${sizeKB} KB) parsed into editor!</span>
            <span class="uppercase font-bold">${detectedLang}</span>
          </div>
        `;
      }

      showToast(`Loaded "${name}" (${detectedLang.toUpperCase()}) successfully!`);
    };

    reader.readAsText(file);
  }

  // TEMPLATE SWITCHER IN STUDIO
  setLanguageTemplate(lang) {
    const editor = document.getElementById('studio-code-editor');
    if (!editor) return;

    if (CODE_TEMPLATES[lang]) {
      editor.value = CODE_TEMPLATES[lang];
    }

    const badgeInput = document.getElementById('studio-tool-badge');
    if (badgeInput) badgeInput.value = lang.toUpperCase();

    const descInput = document.getElementById('studio-tool-desc');
    if (descInput && !descInput.value) {
      descInput.value = `Custom ${lang.toUpperCase()} executable tool for Foysal Tools.`;
    }
  }

  // RUN SCRIPT IN STUDIO (EXECUTION ENGINE)
  async runStudioCode() {
    const langSelect = document.getElementById('studio-lang-select');
    const editor = document.getElementById('studio-code-editor');
    const consoleBox = document.getElementById('studio-terminal-output');
    const statusPill = document.getElementById('studio-exec-status');
    const timePill = document.getElementById('studio-exec-time');

    if (!editor || !consoleBox) return;

    const lang = langSelect ? langSelect.value : 'python';
    const code = editor.value.trim();

    if (!code) {
      showToast('Editor is empty! Please write code or upload a file.');
      return;
    }

    // HTML / JS runs directly in sandbox
    if (lang === 'html') {
      this.openCodeSandboxPreview('Live HTML Sandbox', code);
      return;
    }

    // External URL
    if (lang === 'iframe') {
      this.openIframeModal('Live Webview Tool', code);
      return;
    }

    // Terminal Languages: Python, Java, Bash, PHP
    consoleBox.textContent = `[Foysal Tools Engine] Compiling & executing ${lang.toUpperCase()} script...\n`;
    if (statusPill) {
      statusPill.textContent = 'RUNNING...';
      statusPill.className = 'text-xs font-mono px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/40';
    }

    try {
      const res = await fetch('api.php?action=execute_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang, code: code })
      });

      const data = await res.json();

      if (statusPill) {
        statusPill.textContent = data.success ? 'EXIT: 0 (SUCCESS)' : `EXIT: ${data.exit_code} (ERROR)`;
        statusPill.className = `text-xs font-mono px-2 py-0.5 rounded ${data.success ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}`;
      }

      if (timePill && data.execution_time) {
        timePill.textContent = data.execution_time;
      }

      consoleBox.textContent = data.output || '[No output returned]';
      showToast(data.success ? 'Execution completed!' : 'Execution failed. Check console.');
    } catch (err) {
      consoleBox.textContent = `[Engine Connection Error]: Could not connect to backend execution API.\nReason: ${err.message}\nMake sure the local server is running!`;
      if (statusPill) {
        statusPill.textContent = 'API OFFLINE';
        statusPill.className = 'text-xs font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40';
      }
    }
  }

  // SAVE TOOL FROM STUDIO
  saveStudioTool() {
    const nameInput = document.getElementById('studio-tool-name');
    const catInput = document.getElementById('studio-tool-category');
    const langSelect = document.getElementById('studio-lang-select');
    const iconInput = document.getElementById('studio-tool-icon');
    const badgeInput = document.getElementById('studio-tool-badge');
    const descInput = document.getElementById('studio-tool-desc');
    const editor = document.getElementById('studio-code-editor');
    const pinCheck = document.getElementById('studio-tool-pin');
    const tokenCheck = document.getElementById('studio-tool-token');

    const name = nameInput ? nameInput.value.trim() : '';
    const category = catInput ? catInput.value.trim() || 'My Custom Tools' : 'My Custom Tools';
    const lang = langSelect ? langSelect.value : 'python';
    const icon = iconInput ? iconInput.value.trim() || 'fa-screwdriver-wrench' : 'fa-screwdriver-wrench';
    const badge = badgeInput ? badgeInput.value.trim() || lang.toUpperCase() : lang.toUpperCase();
    const desc = descInput ? descInput.value.trim() : '';
    const code = editor ? editor.value.trim() : '';
    const pinned = pinCheck ? pinCheck.checked : false;
    const requireToken = tokenCheck ? tokenCheck.checked : false;

    if (!name) {
      showToast('Please enter a Tool Name!');
      if (nameInput) nameInput.focus();
      return;
    }

    if (!code) {
      showToast('Please write or upload code for this tool!');
      return;
    }

    if (this.currentEditingId) {
      // Update existing
      const existing = this.tools.find(t => t.id === this.currentEditingId);
      if (existing) {
        existing.name = name;
        existing.category = category;
        existing.lang = lang;
        existing.icon = icon;
        existing.badge = badge;
        existing.description = desc;
        existing.pinned = pinned;
        existing.requireToken = requireToken;
        existing.code = code;
        if (lang === 'iframe') existing.url = code;
        showToast(`Tool "${name}" updated successfully!`);
      }
      this.currentEditingId = null;
    } else {
      // Create new
      const newTool = {
        id: 'tool_custom_' + Date.now(),
        name,
        category,
        type: 'custom',
        lang,
        icon,
        badge,
        description: desc,
        code,
        pinned,
        requireToken
      };
      if (lang === 'iframe') newTool.url = code;

      this.tools.push(newTool);
      showToast(`Tool "${name}" saved to Foysal Tools!`);
    }

    if (!this.categories.includes(category)) {
      this.categories.push(category);
    }

    this.saveCustomTools();
    this.renderStats();
    this.renderAllTools();
    this.renderPinnedTools();
    this.renderCustomToolsManager();

    // Reset editing state
    const studioTitle = document.getElementById('studio-editor-title');
    if (studioTitle) studioTitle.textContent = 'Create New Tool (Multi-Language Studio)';
  }

  // NAVIGATION & VIEW SWITCHING
  switchView(viewName) {
    this.activeView = viewName;
    const views = ['dashboard', 'tools', 'mail', 'studio', 'termux', 'settings', 'tokens'];

    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      const btn = document.getElementById(`nav-btn-${v}`);
      const mobileBtn = document.getElementById(`mobile-btn-${v}`);

      if (el) el.classList.toggle('hidden', v !== viewName);
      if (btn) {
        btn.classList.toggle('bg-[var(--primary)]/20', v === viewName);
        btn.classList.toggle('border-[var(--primary)]', v === viewName);
        btn.classList.toggle('text-white', v === viewName);
      }
      if (mobileBtn) {
        mobileBtn.classList.toggle('text-[var(--primary)]', v === viewName);
        mobileBtn.classList.toggle('text-gray-400', v !== viewName);
      }
    });

    // Update sliding carousel mobile navigation
    document.querySelectorAll('.mobile-slide-item').forEach(el => el.classList.remove('active'));
    const activeSlide = document.getElementById(`mobile-pill-${viewName}`);
    if (activeSlide) {
      activeSlide.classList.add('active');
      activeSlide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    if (viewName === 'mail' && window.BuiltinTools) {
      window.BuiltinTools.loadMetaMailData();
    }

    if (viewName === 'termux') {
      renderTermuxHub('termux-hub-container');
    }

    if (viewName === 'tokens' && window.TokenManager) {
      window.TokenManager.loadTokens();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // DISTINCT COLOR THEME GENERATOR FOR EACH TOOL CARD
  getToolTheme(tool, index = 0) {
    const predefinedThemes = {
      tool_meta_horizone: {
        accent: '#06b6d4',
        accentRgb: '6, 182, 212',
        border: 'rgba(6, 182, 212, 0.4)',
        borderHover: 'rgba(6, 182, 212, 0.95)',
        bg: 'linear-gradient(135deg, rgba(6, 182, 212, 0.14) 0%, rgba(8, 14, 28, 0.9) 100%)',
        glow: 'rgba(6, 182, 212, 0.25)',
        text: 'text-cyan-400',
        badgeBg: 'rgba(6, 182, 212, 0.22)',
        badgeText: '#22d3ee',
        badgeBorder: 'rgba(6, 182, 212, 0.5)',
        btnBg: 'bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300',
        btnText: 'text-black font-black'
      },
      tool_auto_mail_otp: {
        accent: '#f59e0b',
        accentRgb: '245, 158, 11',
        border: 'rgba(245, 158, 11, 0.45)',
        borderHover: 'rgba(245, 158, 11, 0.95)',
        bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(24, 16, 4, 0.9) 100%)',
        glow: 'rgba(245, 158, 11, 0.3)',
        text: 'text-amber-400',
        badgeBg: 'rgba(245, 158, 11, 0.25)',
        badgeText: '#fbbf24',
        badgeBorder: 'rgba(245, 158, 11, 0.55)',
        btnBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300',
        btnText: 'text-black font-black'
      },
      tool_hash: {
        accent: '#8b5cf6',
        accentRgb: '139, 92, 246',
        border: 'rgba(139, 92, 246, 0.4)',
        borderHover: 'rgba(139, 92, 246, 0.95)',
        bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.14) 0%, rgba(18, 12, 32, 0.9) 100%)',
        glow: 'rgba(139, 92, 246, 0.25)',
        text: 'text-purple-400',
        badgeBg: 'rgba(139, 92, 246, 0.22)',
        badgeText: '#c084fc',
        badgeBorder: 'rgba(139, 92, 246, 0.5)',
        btnBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500',
        btnText: 'text-white font-bold'
      },
      tool_codec: {
        accent: '#ec4899',
        accentRgb: '236, 72, 153',
        border: 'rgba(236, 72, 153, 0.4)',
        borderHover: 'rgba(236, 72, 153, 0.95)',
        bg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.14) 0%, rgba(28, 10, 22, 0.9) 100%)',
        glow: 'rgba(236, 72, 153, 0.25)',
        text: 'text-pink-400',
        badgeBg: 'rgba(236, 72, 153, 0.22)',
        badgeText: '#f472b6',
        badgeBorder: 'rgba(236, 72, 153, 0.5)',
        btnBg: 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500',
        btnText: 'text-white font-bold'
      },
      tool_pass: {
        accent: '#10b981',
        accentRgb: '16, 185, 129',
        border: 'rgba(16, 185, 129, 0.4)',
        borderHover: 'rgba(16, 185, 129, 0.95)',
        bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(6, 26, 16, 0.9) 100%)',
        glow: 'rgba(16, 185, 129, 0.25)',
        text: 'text-emerald-400',
        badgeBg: 'rgba(16, 185, 129, 0.22)',
        badgeText: '#34d399',
        badgeBorder: 'rgba(16, 185, 129, 0.5)',
        btnBg: 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400',
        btnText: 'text-black font-black'
      },
      tool_ip: {
        accent: '#0ea5e9',
        accentRgb: '14, 165, 233',
        border: 'rgba(14, 165, 233, 0.4)',
        borderHover: 'rgba(14, 165, 233, 0.95)',
        bg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.14) 0%, rgba(6, 20, 36, 0.9) 100%)',
        glow: 'rgba(14, 165, 233, 0.25)',
        text: 'text-sky-400',
        badgeBg: 'rgba(14, 165, 233, 0.22)',
        badgeText: '#38bdf8',
        badgeBorder: 'rgba(14, 165, 233, 0.5)',
        btnBg: 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500',
        btnText: 'text-white font-bold'
      },
      tool_dns: {
        accent: '#f97316',
        accentRgb: '249, 115, 22',
        border: 'rgba(249, 115, 22, 0.4)',
        borderHover: 'rgba(249, 115, 22, 0.95)',
        bg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.14) 0%, rgba(32, 16, 6, 0.9) 100%)',
        glow: 'rgba(249, 115, 22, 0.25)',
        text: 'text-orange-400',
        badgeBg: 'rgba(249, 115, 22, 0.22)',
        badgeText: '#fb923c',
        badgeBorder: 'rgba(249, 115, 22, 0.5)',
        btnBg: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500',
        btnText: 'text-black font-black'
      },
      tool_json: {
        accent: '#84cc16',
        accentRgb: '132, 204, 22',
        border: 'rgba(132, 204, 22, 0.4)',
        borderHover: 'rgba(132, 204, 22, 0.95)',
        bg: 'linear-gradient(135deg, rgba(132, 204, 22, 0.14) 0%, rgba(16, 26, 6, 0.9) 100%)',
        glow: 'rgba(132, 204, 22, 0.25)',
        text: 'text-lime-400',
        badgeBg: 'rgba(132, 204, 22, 0.22)',
        badgeText: '#a3e635',
        badgeBorder: 'rgba(132, 204, 22, 0.5)',
        btnBg: 'bg-gradient-to-r from-lime-600 to-emerald-600 hover:from-lime-500 hover:to-emerald-500',
        btnText: 'text-black font-black'
      },
      tool_regex: {
        accent: '#f43f5e',
        accentRgb: '244, 63, 94',
        border: 'rgba(244, 63, 94, 0.4)',
        borderHover: 'rgba(244, 63, 94, 0.95)',
        bg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.14) 0%, rgba(32, 6, 16, 0.9) 100%)',
        glow: 'rgba(244, 63, 94, 0.25)',
        text: 'text-rose-400',
        badgeBg: 'rgba(244, 63, 94, 0.22)',
        badgeText: '#fb7185',
        badgeBorder: 'rgba(244, 63, 94, 0.5)',
        btnBg: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500',
        btnText: 'text-white font-bold'
      },
      tool_text: {
        accent: '#6366f1',
        accentRgb: '99, 102, 241',
        border: 'rgba(99, 102, 241, 0.4)',
        borderHover: 'rgba(99, 102, 241, 0.95)',
        bg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, rgba(12, 12, 32, 0.9) 100%)',
        glow: 'rgba(99, 102, 241, 0.25)',
        text: 'text-indigo-400',
        badgeBg: 'rgba(99, 102, 241, 0.22)',
        badgeText: '#818cf8',
        badgeBorder: 'rgba(99, 102, 241, 0.5)',
        btnBg: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500',
        btnText: 'text-white font-bold'
      },
      tool_qr: {
        accent: '#eab308',
        accentRgb: '234, 179, 8',
        border: 'rgba(234, 179, 8, 0.4)',
        borderHover: 'rgba(234, 179, 8, 0.95)',
        bg: 'linear-gradient(135deg, rgba(234, 179, 8, 0.14) 0%, rgba(26, 20, 4, 0.9) 100%)',
        glow: 'rgba(234, 179, 8, 0.25)',
        text: 'text-yellow-400',
        badgeBg: 'rgba(234, 179, 8, 0.22)',
        badgeText: '#facc15',
        badgeBorder: 'rgba(234, 179, 8, 0.5)',
        btnBg: 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400',
        btnText: 'text-black font-black'
      },
      tool_termux: {
        accent: '#14b8a6',
        accentRgb: '20, 184, 166',
        border: 'rgba(20, 184, 166, 0.4)',
        borderHover: 'rgba(20, 184, 166, 0.95)',
        bg: 'linear-gradient(135deg, rgba(20, 184, 166, 0.14) 0%, rgba(6, 26, 26, 0.9) 100%)',
        glow: 'rgba(20, 184, 166, 0.25)',
        text: 'text-teal-400',
        badgeBg: 'rgba(20, 184, 166, 0.22)',
        badgeText: '#2dd4bf',
        badgeBorder: 'rgba(20, 184, 166, 0.5)',
        btnBg: 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500',
        btnText: 'text-black font-black'
      }
    };

    if (predefinedThemes[tool.id]) return predefinedThemes[tool.id];

    // Fallback rotating theme palette for custom tools
    const palette = [
      { accent: '#06b6d4', accentRgb: '6, 182, 212', text: 'text-cyan-400', badgeText: '#22d3ee', btnBg: 'bg-gradient-to-r from-cyan-600 to-blue-600' },
      { accent: '#a855f7', accentRgb: '168, 85, 247', text: 'text-purple-400', badgeText: '#c084fc', btnBg: 'bg-gradient-to-r from-purple-600 to-pink-600' },
      { accent: '#10b981', accentRgb: '16, 185, 129', text: 'text-emerald-400', badgeText: '#34d399', btnBg: 'bg-gradient-to-r from-emerald-600 to-teal-600' },
      { accent: '#f59e0b', accentRgb: '245, 158, 11', text: 'text-amber-400', badgeText: '#fbbf24', btnBg: 'bg-gradient-to-r from-amber-500 to-orange-500' },
      { accent: '#f43f5e', accentRgb: '244, 63, 94', text: 'text-rose-400', badgeText: '#fb7185', btnBg: 'bg-gradient-to-r from-rose-600 to-pink-600' },
      { accent: '#3b82f6', accentRgb: '59, 130, 246', text: 'text-blue-400', badgeText: '#60a5fa', btnBg: 'bg-gradient-to-r from-blue-600 to-indigo-600' }
    ];
    const item = palette[Math.abs(index) % palette.length];
    return {
      accent: item.accent,
      accentRgb: item.accentRgb,
      border: `rgba(${item.accentRgb}, 0.35)`,
      borderHover: `rgba(${item.accentRgb}, 0.9)`,
      bg: `linear-gradient(135deg, rgba(${item.accentRgb}, 0.12) 0%, rgba(15, 15, 25, 0.85) 100%)`,
      glow: `rgba(${item.accentRgb}, 0.25)`,
      text: item.text,
      badgeBg: `rgba(${item.accentRgb}, 0.2)`,
      badgeText: item.badgeText,
      badgeBorder: `rgba(${item.accentRgb}, 0.45)`,
      btnBg: item.btnBg,
      btnText: 'text-white font-bold'
    };
  }

  // RENDER PINNED TOOLS
  renderPinnedTools() {
    const container = document.getElementById('pinned-tools-grid');
    if (!container) return;

    const pinned = this.tools.filter(t => t.pinned);

    if (pinned.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-8 text-gray-500 font-mono text-sm">
          No pinned tools yet. Pin your favorite tools from the "All Tools" tab!
        </div>
      `;
      return;
    }

    container.innerHTML = pinned.map((tool, idx) => {
      const theme = this.getToolTheme(tool, idx);
      return `
      <div onclick="window.launchTool('${tool.id}')" 
           class="glass-card-interactive p-4 flex flex-col justify-between group cursor-pointer relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
           style="background: ${theme.bg}; border: 1px solid ${theme.border}; box-shadow: 0 4px 20px -2px ${theme.glow};">
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all group-hover:scale-110 shadow-sm"
                 style="background: rgba(${theme.accentRgb}, 0.16); border: 1px solid ${theme.border}; color: ${theme.accent};">
              <i class="fa-solid ${tool.icon || 'fa-screwdriver-wrench'}"></i>
            </div>
            <div class="flex items-center gap-1">
              <button onclick="event.stopPropagation(); window.openToolKeyModal('${tool.id}')" title="Configure / Unlock Token Key" class="w-7 h-7 rounded-lg flex items-center justify-center border border-yellow-500/30 hover:border-yellow-400 text-yellow-400/80 hover:text-yellow-400 text-xs transition-all">
                <i class="fa-solid fa-key"></i>
              </button>
              <button onclick="event.stopPropagation(); window.app.deleteAnyTool('${tool.id}')" title="Delete Tool" class="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 hover:border-red-400 text-gray-500 hover:text-red-400 text-xs transition-all">
                <i class="fa-solid fa-trash-can"></i>
              </button>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider" 
                    style="background: ${theme.badgeBg}; color: ${theme.badgeText}; border: 1px solid ${theme.badgeBorder};">
                ${escapeHtml(tool.badge || 'PRO')}
              </span>
            </div>
          </div>
          <h4 class="font-bold text-white text-base group-hover:text-white transition-colors mb-1 flex items-center gap-2">
            <span>${escapeHtml(tool.name)}</span>
          </h4>
          <p class="text-xs text-gray-300 line-clamp-2 leading-relaxed">${escapeHtml(tool.description || '')}</p>
        </div>
        <div class="mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono" style="border-color: rgba(255,255,255,0.08);">
          <span class="text-gray-400 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full" style="background: ${theme.accent};"></span>
            ${escapeHtml(tool.category)}
          </span>
          <span class="flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform" style="color: ${theme.accent};">
            Launch <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </span>
        </div>
      </div>
      `;
    }).join('');
  }

  // RENDER ALL TOOLS GRID (WITH ADVANCED SEARCH)
  renderAllTools() {
    const container = document.getElementById('all-tools-grid');
    const tabsContainer = document.getElementById('category-tabs');
    const searchStats = document.getElementById('search-results-stats');
    if (!container) return;

    // Render category tabs
    if (tabsContainer) {
      tabsContainer.innerHTML = this.categories.map(cat => `
        <button onclick="window.app.filterCategory('${cat}')" 
          class="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${this.activeCategory === cat ? 'bg-[var(--primary)] text-black shadow-[0_0_12px_var(--primary-glow)] font-bold' : 'bg-black/40 border border-white/10 text-gray-300 hover:border-white/30'}">
          ${cat}
        </button>
      `).join('');
    }

    // Filter tools
    let filtered = this.tools;

    if (this.activeCategory !== 'All') {
      if (this.activeCategory === 'My Custom Tools') {
        filtered = filtered.filter(t => t.type !== 'builtin' && t.id !== 'tool_termux');
      } else {
        filtered = filtered.filter(t => t.category === this.activeCategory);
      }
    }

    if (this.searchQuery) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(this.searchQuery) ||
        (t.description && t.description.toLowerCase().includes(this.searchQuery)) ||
        t.category.toLowerCase().includes(this.searchQuery) ||
        (t.badge && t.badge.toLowerCase().includes(this.searchQuery)) ||
        (t.lang && t.lang.toLowerCase().includes(this.searchQuery))
      );
    }

    if (searchStats) {
      if (this.searchQuery) {
        searchStats.innerHTML = `<span class="text-[var(--primary)] font-bold">${filtered.length}</span> matching tool(s) found for "<strong>${escapeHtml(this.searchQuery)}</strong>"`;
        searchStats.classList.remove('hidden');
      } else {
        searchStats.classList.add('hidden');
      }
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-16 text-gray-500">
          <i class="fa-solid fa-magnifying-glass text-4xl mb-3 text-gray-600"></i>
          <p class="text-base font-semibold text-gray-300">No tools matched your search</p>
          <p class="text-xs text-gray-500 mt-1">Try another keyword, or create a new custom tool in the Studio!</p>
          <button onclick="window.app.switchView('studio')" class="btn-cyber text-xs py-2 px-4 mt-4 inline-flex">
            <i class="fa-solid fa-plus"></i> Create Tool in Studio
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((tool, idx) => {
      const isCustom = tool.type !== 'builtin' && tool.id !== 'tool_termux';
      const theme = this.getToolTheme(tool, idx);
      return `
        <div class="glass-panel p-5 flex flex-col justify-between group transition-all duration-300 hover:scale-[1.01] relative overflow-hidden"
             style="background: ${theme.bg}; border: 1px solid ${theme.border}; box-shadow: 0 6px 25px -4px ${theme.glow};">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-all shadow-md"
                   style="background: rgba(${theme.accentRgb}, 0.18); border: 1px solid ${theme.border}; color: ${theme.accent}; box-shadow: 0 0 15px ${theme.glow};">
                <i class="fa-solid ${tool.icon || 'fa-screwdriver-wrench'}"></i>
              </div>
              <div class="flex items-center gap-1.5">
                <button onclick="window.app.togglePin('${tool.id}')" title="${tool.pinned ? 'Unpin' : 'Pin to Dashboard'}" class="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 hover:border-yellow-400 text-xs transition-all ${tool.pinned ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400'}">
                  <i class="fa-solid fa-thumbtack"></i>
                </button>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider" 
                      style="background: ${theme.badgeBg}; color: ${theme.badgeText}; border: 1px solid ${theme.badgeBorder};">
                  ${escapeHtml(tool.badge || tool.lang || 'READY')}
                </span>
              </div>
            </div>
            <h3 class="font-bold text-white text-base transition-colors mb-1.5 flex items-center gap-1.5">
              <span>${escapeHtml(tool.name)}</span>
            </h3>
            <p class="text-xs text-gray-300 leading-relaxed mb-4">${escapeHtml(tool.description || 'Custom administrative tool.')}</p>
          </div>

          <div>
            <div class="text-[11px] font-mono text-gray-400 mb-3 flex items-center justify-between border-t pt-2.5" style="border-color: rgba(255,255,255,0.06);">
              <span class="flex items-center gap-1.5">
                <i class="fa-regular fa-folder mr-0.5" style="color: ${theme.accent};"></i> ${escapeHtml(tool.category)}
              </span>
              <span class="uppercase text-[9px] px-1.5 py-0.5 rounded font-bold font-mono" style="background: rgba(${theme.accentRgb}, 0.15); color: ${theme.accent}; border: 1px solid ${theme.border};">
                ${escapeHtml(tool.lang || tool.type)}
              </span>
            </div>
            <div class="flex items-center gap-1.5">
              <button onclick="window.launchTool('${tool.id}')" class="flex-1 text-xs py-2.5 px-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 ${theme.btnBg} ${theme.btnText}" style="box-shadow: 0 0 12px ${theme.glow};">
                <i class="fa-solid fa-play text-[10px]"></i> Launch
              </button>
              <button onclick="window.openToolKeyModal('${tool.id}')" title="Configure / Unlock Token Key" class="btn-cyber-outline text-xs py-2.5 px-3 text-yellow-400 border-yellow-500/40 hover:border-yellow-400">
                <i class="fa-solid fa-key"></i>
              </button>
              ${isCustom ? `
                <button onclick="window.app.editStudioTool('${tool.id}')" title="Edit in Studio" class="btn-cyber-outline text-xs py-2.5 px-3">
                  <i class="fa-solid fa-pen"></i>
                </button>
              ` : ''}
              <button onclick="window.app.deleteAnyTool('${tool.id}')" title="Delete Tool from Panel" class="btn-cyber-danger text-xs py-2.5 px-3 hover:bg-red-500 hover:text-white">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  filterCategory(cat) {
    this.activeCategory = cat;
    this.renderAllTools();
  }

  togglePin(toolId) {
    const t = this.tools.find(x => x.id === toolId);
    if (t) {
      t.pinned = !t.pinned;
      this.saveCustomTools();
      this.renderPinnedTools();
      this.renderAllTools();
      this.renderStats();
      showToast(t.pinned ? `Pinned "${t.name}" to dashboard!` : `Unpinned "${t.name}"`);
    }
  }

  getToolAction(tool) {
    return `window.launchTool('${tool.id}')`;
  }

  // DISPATCHER: LAUNCH ANY TOOL WITH TOKEN PROTECTION CHECK
  launchTool(toolId) {
    const tool = this.tools.find(t => t.id === toolId);
    if (!tool) {
      showToast('Tool not found: ' + toolId);
      return;
    }

    // Check if token protection is required
    const isSessionUnlocked = sessionStorage.getItem('foysal_unlocked_' + toolId) === 'true' ||
                              sessionStorage.getItem('foysal_master_unlocked') === 'true';

    // If tool explicitly requires token or panel global token enforcement is active
    if (tool.requireToken && !isSessionUnlocked) {
      window.openUnlockModal(tool.id, tool.name);
      return;
    }

    this.executeToolDirectly(toolId);
  }

  // DIRECT EXECUTION ENGINE FOR BUILTIN AND CUSTOM MULTI-LANGUAGE TOOLS
  executeToolDirectly(toolId) {
    const tool = this.tools.find(t => t.id === toolId);
    if (!tool) return;

    if (tool.id === 'tool_auto_mail_otp') {
      this.switchView('mail');
      return;
    }

    if (tool.id === 'tool_termux') {
      this.switchView('termux');
      return;
    }

    if (tool.type === 'builtin') {
      const modalMap = {
        tool_hash: 'hash-modal',
        tool_codec: 'codec-modal',
        tool_pass: 'pass-modal',
        tool_ip: 'ip-modal',
        tool_dns: 'dns-modal',
        tool_json: 'json-modal',
        tool_regex: 'regex-modal',
        tool_text: 'text-modal',
        tool_qr: 'qr-modal'
      };
      const modalId = modalMap[tool.id] || (tool.action && tool.action.includes('openBuiltinModal') ? tool.action.match(/openBuiltinModal\(["']([^"']+)["']\)/)?.[1] : null);
      if (modalId) {
        openModal(modalId);
      } else {
        try {
          const fn = new Function('openModal', 'openBuiltinModal', 'switchView', tool.action);
          fn(openModal, openBuiltinModal, (v) => this.switchView(v));
        } catch (e) {
          console.error('Launch error:', e);
        }
      }
      return;
    }

    if (tool.type === 'view') {
      const targetView = (tool.action && tool.action.match(/switchView\(["']([^"']+)["']\)/)?.[1]) || 'tools';
      this.switchView(targetView);
      return;
    }

    if (tool.lang === 'html') {
      this.openCodeSandboxPreview(tool.name, tool.code);
      return;
    }

    if (tool.lang === 'iframe') {
      this.openIframeModal(tool.name, tool.url || tool.code);
      return;
    }

    // Python, Java, Bash, PHP live terminal execution
    this.executeCustomToolLive(tool.id);
  }

  // EXECUTE SAVED CUSTOM TOOL LIVE
  async executeCustomToolLive(toolId) {
    const tool = this.tools.find(t => t.id === toolId);
    if (!tool) return;

    document.getElementById('exec-modal-title').textContent = tool.name;
    document.getElementById('exec-modal-lang').textContent = (tool.lang || 'SCRIPT').toUpperCase();
    document.getElementById('exec-modal-output').textContent = `[Foysal Tools Engine] Executing ${tool.name} (${tool.lang || 'python'})...\n`;
    document.getElementById('exec-modal-status').textContent = 'RUNNING';
    document.getElementById('exec-modal-status').className = 'text-xs font-mono px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400';

    openModal('tool-executor-modal');

    try {
      const res = await fetch('api.php?action=execute_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: tool.lang || 'python', code: tool.code })
      });

      const data = await res.json();
      const statusPill = document.getElementById('exec-modal-status');
      const timePill = document.getElementById('exec-modal-time');

      if (statusPill) {
        statusPill.textContent = data.success ? 'EXIT: 0 (SUCCESS)' : `EXIT: ${data.exit_code} (ERROR)`;
        statusPill.className = `text-xs font-mono px-2 py-0.5 rounded ${data.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`;
      }

      if (timePill && data.execution_time) {
        timePill.textContent = data.execution_time;
      }

      document.getElementById('exec-modal-output').textContent = data.output || '[No output returned]';
    } catch (e) {
      document.getElementById('exec-modal-output').textContent = `[Error]: Failed to connect to backend execution API.\n${e.message}`;
    }
  }

  // EDIT TOOL IN STUDIO
  editStudioTool(toolId) {
    const tool = this.tools.find(t => t.id === toolId);
    if (!tool) return;

    this.currentEditingId = tool.id;
    this.switchView('studio');

    document.getElementById('studio-tool-name').value = tool.name;
    document.getElementById('studio-tool-category').value = tool.category;
    document.getElementById('studio-lang-select').value = tool.lang || 'python';
    document.getElementById('studio-tool-icon').value = tool.icon || 'fa-screwdriver-wrench';
    document.getElementById('studio-tool-badge').value = tool.badge || 'PRO';
    document.getElementById('studio-tool-desc').value = tool.description || '';
    document.getElementById('studio-code-editor').value = tool.code || '';
    document.getElementById('studio-tool-pin').checked = !!tool.pinned;
    const tokenCheck = document.getElementById('studio-tool-token');
    if (tokenCheck) tokenCheck.checked = !!tool.requireToken;

    const titleEl = document.getElementById('studio-editor-title');
    if (titleEl) titleEl.textContent = `Edit Tool: ${tool.name}`;

    showToast(`Loaded "${tool.name}" into Studio!`);
  }

  // DELETE ANY TOOL (BUILT-IN OR CUSTOM)
  deleteAnyTool(id) {
    const t = this.tools.find(x => x.id === id);
    if (!t) return;

    if (!confirm(`Are you sure you want to permanently delete "${t.name}" from the panel?`)) {
      return;
    }

    // Save to deleted IDs list
    let deletedIds = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('foysal_deleted_tool_ids') || '[]');
    } catch (e) {
      deletedIds = [];
    }

    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem('foysal_deleted_tool_ids', JSON.stringify(deletedIds));
    }

    // If custom tool, also remove from custom storage
    if (t.type !== 'builtin' && t.id !== 'tool_termux') {
      let customTools = [];
      try {
        customTools = JSON.parse(localStorage.getItem('foysal_custom_tools') || '[]');
        customTools = customTools.filter(x => x.id !== id);
        localStorage.setItem('foysal_custom_tools', JSON.stringify(customTools));
      } catch (e) {}
    }

    this.tools = this.tools.filter(x => x.id !== id);
    this.renderStats();
    this.renderAllTools();
    this.renderPinnedTools();
    this.renderCustomToolsManager();
    showToast(`Tool "${t.name}" deleted from panel.`);
  }

  deleteCustomTool(id) {
    this.deleteAnyTool(id);
  }

  restoreDefaultTools() {
    if (confirm('Restore all original built-in tools that were deleted?')) {
      localStorage.removeItem('foysal_deleted_tool_ids');
      this.loadState();
      this.renderStats();
      this.renderAllTools();
      this.renderPinnedTools();
      this.renderCustomToolsManager();
      showToast('All default tools restored successfully!');
    }
  }

  // RENDER CUSTOM TOOLS TABLE IN STUDIO
  renderCustomToolsManager() {
    const container = document.getElementById('custom-tools-list');
    if (!container) return;

    const customTools = this.tools.filter(t => t.type !== 'builtin' && t.id !== 'tool_termux');

    if (customTools.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-gray-500 font-mono text-sm border border-dashed border-white/10 rounded-xl">
          <i class="fa-solid fa-wand-magic-sparkles text-3xl mb-2 text-gray-400"></i>
          <p>You haven't created any custom tools yet.</p>
          <p class="text-xs text-gray-500 mt-1">Use the Code Editor or File Upload above to add your first Python, HTML, Java, or Bash tool!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-xs text-gray-400 border-b border-white/10 uppercase font-mono">
              <th class="p-3">Tool</th>
              <th class="p-3">Category</th>
              <th class="p-3">Language</th>
              <th class="p-3">Pinned</th>
              <th class="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${customTools.map(tool => `
              <tr class="border-b border-white/5 hover:bg-white/5 font-mono text-xs">
                <td class="p-3 flex items-center gap-2">
                  <div class="w-7 h-7 rounded bg-black/40 border border-white/10 flex items-center justify-center text-[var(--primary)]">
                    <i class="fa-solid ${tool.icon || 'fa-screwdriver-wrench'}"></i>
                  </div>
                  <div>
                    <span class="font-bold text-white text-sm block">${escapeHtml(tool.name)}</span>
                    <span class="text-gray-500 text-[11px]">${escapeHtml(tool.badge || '')}</span>
                  </div>
                </td>
                <td class="p-3 text-gray-300">${escapeHtml(tool.category)}</td>
                <td class="p-3"><span class="px-2 py-0.5 rounded bg-[var(--primary)]/15 text-[var(--primary)] uppercase text-[10px] font-bold">${escapeHtml(tool.lang || 'tool')}</span></td>
                <td class="p-3">
                  <button onclick="window.app.togglePin('${tool.id}')" class="text-sm ${tool.pinned ? 'text-yellow-400' : 'text-gray-600'}">
                    <i class="fa-solid fa-thumbtack"></i>
                  </button>
                </td>
                <td class="p-3 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button onclick="window.launchTool('${tool.id}')" class="btn-cyber text-[11px] py-1 px-2.5">
                      <i class="fa-solid fa-play"></i> Run
                    </button>
                    <button onclick="window.app.editStudioTool('${tool.id}')" class="btn-cyber-outline text-[11px] py-1 px-2.5">
                      <i class="fa-solid fa-pen"></i> Edit
                    </button>
                    <button onclick="window.app.deleteCustomTool('${tool.id}')" class="btn-cyber-danger text-[11px] py-1 px-2.5">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // HTML SANDBOX PREVIEW
  openCodeSandboxPreview(title, htmlContent) {
    document.getElementById('sandbox-title').textContent = title;
    const iframe = document.getElementById('sandbox-iframe');
    iframe.srcdoc = htmlContent;
    openModal('sandbox-modal');
  }

  // IFRAME MODAL
  openIframeModal(title, url) {
    document.getElementById('iframe-modal-title').textContent = title;
    document.getElementById('iframe-modal-frame').src = url;
    document.getElementById('iframe-external-link').href = url;
    openModal('iframe-viewer-modal');
  }

  renderStats() {
    const totalToolsEl = document.getElementById('stat-total-tools');
    const customToolsEl = document.getElementById('stat-custom-tools');
    const pinnedToolsEl = document.getElementById('stat-pinned-tools');

    const customCount = this.tools.filter(t => t.type !== 'builtin' && t.id !== 'tool_termux').length;
    const pinnedCount = this.tools.filter(t => t.pinned).length;

    if (totalToolsEl) totalToolsEl.textContent = this.tools.length;
    if (customToolsEl) customToolsEl.textContent = customCount;
    if (pinnedToolsEl) pinnedToolsEl.textContent = pinnedCount;
  }

  startClock() {
    const update = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const clockEl = document.getElementById('system-clock');
      if (clockEl) clockEl.textContent = `${timeStr} | ${dateStr}`;
    };
    update();
    setInterval(update, 1000);
  }

  detectEnvironment() {
    const envBadge = document.getElementById('env-badge');
    if (!envBadge) return;
    const isHopWeb = window.location.href.includes('hopweb') || window.location.port === '8080';
    envBadge.innerHTML = isHopWeb ? '<i class="fa-solid fa-bolt text-green-400"></i> Server Active' : '<i class="fa-solid fa-terminal text-cyan-400"></i> Cyber Mode';
  }

  exportBackup() {
    const backupData = {
      app: 'Foysal Tools',
      exportDate: new Date().toISOString(),
      config: this.config,
      customTools: this.tools.filter(t => t.type !== 'builtin' && t.id !== 'tool_termux')
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `foysal_tools_backup_${Date.now()}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    showToast('Full backup JSON file downloaded!');
  }

  importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.config) {
          this.config = { ...this.config, ...data.config };
          this.saveConfig();
        }
        if (data.customTools && Array.isArray(data.customTools)) {
          this.tools = [...DEFAULT_TOOLS, ...data.customTools];
          this.saveCustomTools();
        }
        this.applySettings();
        this.renderStats();
        this.renderAllTools();
        this.renderPinnedTools();
        this.renderCustomToolsManager();
        showToast('Backup restored successfully!');
      } catch (err) {
        showToast('Invalid backup JSON file!');
      }
    };
    reader.readAsText(file);
  }

  resetFactory() {
    if (confirm('CAUTION: Are you sure you want to reset Foysal Tools to default factory settings?')) {
      localStorage.removeItem('foysal_tools_config');
      localStorage.removeItem('foysal_custom_tools');
      location.reload();
    }
  }

  promptPinLock() {
    const pin = prompt('SECURITY LOCK: Enter Admin PIN:');
    if (pin !== this.config.pinLock) {
      alert('Access Denied: Invalid PIN!');
      document.body.innerHTML = `
        <div style="background:#060913; color:#ef4444; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:monospace;">
          <h1>ACCESS DENIED</h1>
          <p>Invalid Security PIN. Refresh to try again.</p>
        </div>
      `;
    }
  }
}

// GLOBAL HELPERS
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-info text-[var(--primary)]"></i> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

function copyToClipboard(text, msg = 'Copied to clipboard!') {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast(msg));
  } else {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast(msg);
  }
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('hidden');
    document.body.classList.add('modal-open');
    if (id === 'meta-modal') {
      document.body.classList.add('meta-modal-open');
    }
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('hidden');
    const remainingOpen = document.querySelectorAll('.modal-backdrop:not(.hidden)');
    if (remainingOpen.length === 0) {
      document.body.classList.remove('modal-open');
      document.body.classList.remove('meta-modal-open');
    } else {
      let isMetaStillOpen = false;
      remainingOpen.forEach(m => {
        if (m.id === 'meta-modal') isMetaStillOpen = true;
      });
      if (!isMetaStillOpen) {
        document.body.classList.remove('meta-modal-open');
      }
    }
  }
}

// Global ESC key to close open modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const openModals = Array.from(document.querySelectorAll('.modal-backdrop:not(.hidden)'));
    if (openModals.length > 0) {
      const topModal = openModals[openModals.length - 1];
      closeModal(topModal.id);
    }
  }
});

function openBuiltinModal(modalId) {
  openModal(modalId);
  if (modalId === 'meta-modal' && window.BuiltinTools?.loadMetaStatus) {
    window.BuiltinTools.loadMetaStatus();
  }
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Global functions attached to window for rock-solid click handlers
window.switchView = function(view) {
  if (window.app) window.app.switchView(view);
};
window.openModal = openModal;
window.closeModal = closeModal;
window.copyToClipboard = copyToClipboard;
window.showToast = showToast;
window.launchTool = function(id) {
  if (window.app) window.app.launchTool(id);
};

window.openUnlockModal = function(toolId, toolName) {
  const inputToolId = document.getElementById('unlock-target-tool-id');
  const nameEl = document.getElementById('unlock-modal-tool-name');
  const keyInput = document.getElementById('unlock-token-input');
  const errorBox = document.getElementById('unlock-error-msg');
  const modalDev = document.getElementById('unlock-modal-device-id');

  if (inputToolId) inputToolId.value = toolId;
  if (nameEl) nameEl.textContent = toolName;
  if (keyInput) keyInput.value = '';
  if (errorBox) errorBox.classList.add('hidden');
  if (modalDev && window.TokenManager) modalDev.textContent = window.TokenManager.myDeviceId;

  openModal('token-unlock-modal');
};

window.openToolKeyModal = function(toolId) {
  if (window.app) window.app.switchView('tokens');
  const select = document.getElementById('token-target-tool');
  if (select) {
    select.value = toolId;
  }
  const formBox = document.getElementById('token-create-card');
  if (formBox) {
    formBox.scrollIntoView({ behavior: 'smooth' });
    showToast('Ready to generate or configure token key for selected tool!');
  }
};

window.deleteAnyTool = function(id) {
  if (window.app) window.app.deleteAnyTool(id);
};
window.restoreDefaultTools = function() {
  if (window.app) window.app.restoreDefaultTools();
};

// INITIALIZE APP
document.addEventListener('DOMContentLoaded', () => {
  window.app = new FoysalApp();
});
