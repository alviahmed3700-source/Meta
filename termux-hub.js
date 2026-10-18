/* ============================================================
   FOYSAL TOOLS - TERMUX COMMAND HUB & SCRIPT REPOSITORY
   Author: Foysal Tools Admin System
   ============================================================ */

let currentMasterCmd = 'cd ~/foysal-tools && chmod +x server.sh && ./server.sh';
let currentActiveCategory = 'All';
let backupSyncDebounceTimer = null;

const TERMUX_COMMANDS = [
  {
    id: 'recovery-fresh-reinstall',
    title: 'Fresh Termux Reinstall One-Liner (Master Restore)',
    category: '🛡️ Recovery & Backup',
    description: 'টারমাক্স আনইনস্টল করে আবার নতুন করে ইনস্টল করলে শুধু এই ১টি কমান্ড দিয়ে পুরো এডমিন প্যানেল রিস্টোর ও চালু করুন।',
    cmd: 'termux-setup-storage -y && pkg update -y && pkg install -y python python-pip git tar && cp /sdcard/Download/foysal-tools-backup.tar.gz ~/ 2>/dev/null || cp /sdcard/foysal-tools-backup.tar.gz ~/ 2>/dev/null; cd ~ && tar -xzf foysal-tools-backup.tar.gz && cd foysal-tools && chmod +x server.sh && ./server.sh',
    badge: 'FRESH REINSTALL 🚀',
    icon: 'fa-shield-halved'
  },
  {
    id: 'recovery-restore-script',
    title: '1-Touch Script Restore',
    category: '🛡️ Recovery & Backup',
    description: 'ফোন মেমোরি (/sdcard/Download/foysal_restore.sh) থেকে ডিরেক্ট স্ক্রিপ্ট রান করে রিস্টোর করার কমান্ড।',
    cmd: 'termux-setup-storage -y && bash /sdcard/Download/foysal_restore.sh',
    badge: '1-TOUCH SCRIPT ⚡',
    icon: 'fa-file-code'
  },
  {
    id: 'recovery-backup-sync',
    title: 'Instant Phone Storage Backup Sync',
    category: '🛡️ Recovery & Backup',
    description: 'টারমাক্স থেকে সমস্ত ফাইল ও নতুন টুলস ফোন স্টোরেজে (/sdcard/Download) অটো ব্যাকআপ আপডেট করার কমান্ড।',
    cmd: 'cd ~ && tar -czf /sdcard/Download/foysal-tools-backup.tar.gz foysal-tools && cp ~/foysal-tools/backup/foysal_restore.sh /sdcard/Download/foysal_restore.sh 2>/dev/null; echo "✔ Backup Updated Successfully!"',
    badge: 'BACKUP SYNC 💾',
    icon: 'fa-cloud-arrow-up'
  },
  {
    id: 'master-server-start',
    title: 'Launch Foysal Tools Server (Master)',
    category: '⭐ Master Server & Tools',
    description: 'Python 3 ব্যাকএন্ড, Server.sh এবং এডমিন প্যানেলের সমস্ত এপিআই ও লাইভ ওটিপি ইঞ্জিন এক ক্লিকে চালু করার মূল কমান্ড।',
    cmd: 'cd ~/foysal-tools && chmod +x server.sh && ./server.sh',
    badge: 'RECOMMENDED 🔥',
    icon: 'fa-bolt-lightning'
  },
  {
    id: 'master-server-restart',
    title: 'Clean Restart Server (Kill Port 8080)',
    category: '⭐ Master Server & Tools',
    description: 'আগের আটকে থাকা ব্যাকএন্ড প্রসেস কিল করে ফ্রেশভাবে পোর্ট 8080-এ সার্ভার রিস্টার্ট করার কমান্ড।',
    cmd: 'pkill -f "backend.py" 2>/dev/null; fuser -k 8080/tcp 2>/dev/null; cd ~/foysal-tools && chmod +x server.sh && ./server.sh',
    badge: 'RESTART 🔄',
    icon: 'fa-arrows-rotate'
  },
  {
    id: 'master-server-autofix',
    title: 'Full Auto Setup & Dependency Fix',
    category: '⭐ Master Server & Tools',
    description: 'নতুন Termux-এ Python, Pip, Git এবং Requests অটোমেটিক ইনস্টল করে সার্ভার রেডি ও স্টার্ট করার ফুল কমান্ড।',
    cmd: 'pkg update -y && pkg install -y python python-pip git && pip install requests && cd ~/foysal-tools && chmod +x server.sh && ./server.sh',
    badge: 'AUTO-FIX 🛠️',
    icon: 'fa-screwdriver-wrench'
  },
  {
    id: 'master-server-python',
    title: 'Direct Python 3 Native Backend',
    category: '⭐ Master Server & Tools',
    description: 'সরাসরি পাইথন দিয়ে ব্যাকএন্ড ও লোকালহোস্ট ৮০৮০ চালু করার ডিরেক্ট কমান্ড।',
    cmd: 'cd ~/foysal-tools && python3 backend.py 8080',
    badge: 'PYTHON 3 🐍',
    icon: 'fa-python'
  },
  {
    id: 'meta-horizon-creator',
    title: 'Meta Horizon Account Creator',
    category: '⭐ Master Server & Tools',
    description: 'টারমাক্সে হাই-স্পিড বাল্ক মেটা অ্যাকাউন্ট ক্রিয়েটর স্ক্রিপ্ট রান করার কমান্ড।',
    cmd: 'cd ~/META-HORIZONE && ./meta.sh',
    badge: 'META HUB 🤖',
    icon: 'fa-robot'
  },
  {
    id: 'setup-pkg',
    title: 'Full System Upgrade',
    category: 'System Setup',
    description: 'Update and upgrade all Termux packages to the latest stable version.',
    cmd: 'pkg update -y && pkg upgrade -y',
    badge: 'ESSENTIAL',
    icon: 'fa-arrows-rotate'
  },
  {
    id: 'setup-storage',
    title: 'Grant Android Storage Permission',
    category: 'System Setup',
    description: 'Enables Termux to access your phone internal storage and SD card.',
    cmd: 'termux-setup-storage',
    badge: 'STORAGE',
    icon: 'fa-folder-open'
  },
  {
    id: 'install-essentials',
    title: 'Install Core Utilities',
    category: 'System Setup',
    description: 'Installs git, curl, wget, nano, tar, zip, unzip, and openssh in one go.',
    cmd: 'pkg install -y git curl wget nano tar zip unzip openssh',
    badge: 'TOOLS',
    icon: 'fa-screwdriver-wrench'
  },
  {
    id: 'install-python-full',
    title: 'Install Python 3 & Pip',
    category: 'Development',
    description: 'Complete Python development setup with build-essential tools.',
    cmd: 'pkg install -y python python-pip clang libffi openssl',
    badge: 'DEV',
    icon: 'fa-python'
  },
  {
    id: 'cloudflared-tunnel',
    title: 'Cloudflare Tunnel (Public URL)',
    category: 'Tunnels & Port Forwarding',
    description: 'Expose local port 8080 to the internet with a free, secure HTTPS link.',
    cmd: 'pkg install -y cloudflared && cloudflared tunnel --url http://127.0.0.1:8080',
    badge: 'PUBLIC LINK',
    icon: 'fa-cloud'
  },
  {
    id: 'host-python',
    title: 'Run Python HTTP Web Server',
    category: 'Web Server',
    description: 'Host any folder locally on port 8080 using Python 3.',
    cmd: 'pkg install -y python && python -m http.server 8080',
    badge: 'PYTHON',
    icon: 'fa-server'
  },
  {
    id: 'host-php',
    title: 'Run PHP Development Server',
    category: 'Web Server',
    description: 'Host PHP and static web applications on port 8080.',
    cmd: 'pkg install -y php && php -S 0.0.0.0:8080',
    badge: 'PHP',
    icon: 'fa-code'
  },
  {
    id: 'install-nodejs',
    title: 'Install Node.js & NPM',
    category: 'Development',
    description: 'Installs Node.js runtime and npm package manager for modern web dev.',
    cmd: 'pkg install -y nodejs',
    badge: 'NODEJS',
    icon: 'fa-node-js'
  },
  {
    id: 'ssh-setup',
    title: 'Start OpenSSH Server',
    category: 'Networking',
    description: 'Start SSH daemon to remotely control Termux from PC or other devices.',
    cmd: 'sshd && whoami && ifconfig',
    badge: 'SSH',
    icon: 'fa-terminal'
  },
  {
    id: 'nmap-scanner',
    title: 'Network Mapper (Nmap)',
    category: 'Networking',
    description: 'Install Nmap to scan networks, open ports, and detect vulnerabilities.',
    cmd: 'pkg install -y nmap',
    badge: 'SECURITY',
    icon: 'fa-network-wired'
  },
  {
    id: 'fix-termux-repo',
    title: 'Fix Termux Repository Mirrors',
    category: 'System Setup',
    description: 'Switch repository mirror if Termux pkg update or install gives errors.',
    cmd: 'termux-change-repo',
    badge: 'FIX',
    icon: 'fa-wrench'
  }
];

// Termux Hub UI Generator
function renderTermuxHub(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const categories = ['All', '🛡️ Recovery & Backup', '⭐ Master Server & Tools', 'System Setup', 'Development', 'Web Server', 'Tunnels & Port Forwarding', 'Networking'];

  container.innerHTML = `
    <!-- Top Header Glass Panel -->
    <div class="glass-panel p-5 mb-5 border border-white/10">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider mb-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            TERMUX CYBER COMMAND ENGINE & PERMANENT VAULT
          </div>
          <h2 class="text-xl sm:text-2xl font-black flex items-center gap-2 text-white brand-font">
            <i class="fa-solid fa-terminal text-emerald-400"></i>
            Termux Supercharger Hub & Recovery
          </h2>
          <p class="text-xs text-gray-300 mt-1">
            টারমাক্স আনইনস্টল করলেও ১০০% রিস্টোর করার কমান্ড, সার্ভার রানার এবং যাবতীয় টারমাক্স কমান্ড সেন্টার।
          </p>
        </div>
        <div class="w-full md:w-auto flex items-center gap-2">
          <input type="text" id="termux-search" placeholder="Search any command..." 
            class="input-cyber text-xs py-2.5 px-3 w-full md:w-64 bg-black/60 border-emerald-500/40 text-emerald-200" oninput="filterTermuxCommands(this.value)">
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 🛡️ SECTION 1: PERMANENT DISASTER RECOVERY VAULT (NEW) -->
    <!-- Safe from Termux Uninstallations & Device Reset -->
    <!-- ======================================================== -->
    <div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0c1f17] via-black to-[#052329] border-2 border-emerald-400/80 shadow-[0_0_40px_rgba(16,185,129,0.35)] mb-6 space-y-4 relative overflow-hidden">
      <!-- Glow ambient backdrop -->
      <div class="absolute -right-16 -top-16 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Section Title & Live Status Bar -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-black flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(16,185,129,0.7)] shrink-0">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-md bg-emerald-400 text-black font-black text-[10px] tracking-wider uppercase shadow-[0_0_10px_rgba(16,185,129,0.6)]">
                PERMANENT RECOVERY ENGINE
              </span>
              <span class="text-xs font-black text-emerald-300">
                Safe From Termux Uninstall (ফোন মেমোরি ব্যাকআপ)
              </span>
            </div>
            <h3 class="text-base sm:text-lg font-black text-white mt-1">
              টারমাক্স আনইনস্টল বা ডিলিট হলেও সবকিছু পুনরায় ফিরিয়ে আনার কমান্ড
            </h3>
            <p class="text-xs text-gray-300 mt-0.5 leading-relaxed">
              আপনি যদি কখনো Termux আনইনস্টল করে ফেলেন, ফোন স্টোরেজের <code class="text-emerald-300 bg-black/60 px-1 py-0.5 rounded">/sdcard/Download/</code> ফোল্ডারে আপনার সমস্ত কোড, কাস্টম টুলস ও কনফিগ সেভ থাকে। নতুন টারমাক্স খুলে শুধু নিচের ১ম কমান্ডটি পেস্ট করে এন্টার দিলেই পুরো প্যানেল চালু হয়ে যাবে!
            </p>
          </div>
        </div>

        <!-- Sync Button & Storage Badge -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-start lg:self-auto shrink-0">
          <button id="btn-sync-backup-live" onclick="syncTermuxBackupLive()" class="btn-cyber text-xs py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <span>SYNC & UPDATE BACKUP NOW</span>
          </button>
        </div>
      </div>

      <!-- Live Sync Status Overview Strip -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-black/70 p-3 rounded-xl border border-white/10 text-xs font-mono">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-hard-drive text-emerald-400 text-sm"></i>
          <div>
            <span class="text-[10px] text-gray-400 block uppercase">Permanent Location:</span>
            <span class="text-emerald-300 font-bold truncate block">/sdcard/Download/foysal-tools-backup.tar.gz</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-file-zipper text-cyan-400 text-sm"></i>
          <div>
            <span class="text-[10px] text-gray-400 block uppercase">Archive Size:</span>
            <span id="recovery-live-size" class="text-cyan-300 font-bold">902 KB</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-clock-rotate-left text-amber-400 text-sm"></i>
          <div>
            <span class="text-[10px] text-gray-400 block uppercase">Last Synchronized:</span>
            <span id="recovery-live-time" class="text-amber-300 font-bold">Checking...</span>
          </div>
        </div>
      </div>

      <!-- 4 DISTINCT RECOVERY COMMAND BOXES -->
      <div class="space-y-3 pt-1">
        
        <!-- BOX 1: 🚀 Fresh Termux Full Reinstall One-Liner (The Ultimate Master Command) -->
        <div class="p-3.5 sm:p-4 rounded-xl bg-black/90 border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] space-y-2">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-emerald-400 text-black font-black text-[10px] uppercase">
                BOX 1: MASTER RECOVERY
              </span>
              <h4 class="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                <i class="fa-solid fa-rotate-left text-emerald-400"></i> Fresh Termux Reinstall One-Liner (টারমাক্স আনইনস্টলের পর রিস্টোর করার মূল কমান্ড)
              </h4>
            </div>
            <button onclick="copyToClipboard('termux-setup-storage -y && pkg update -y && pkg install -y python python-pip git tar && cp /sdcard/Download/foysal-tools-backup.tar.gz ~/ 2>/dev/null || cp /sdcard/foysal-tools-backup.tar.gz ~/ 2>/dev/null; cd ~ && tar -xzf foysal-tools-backup.tar.gz && cd foysal-tools && chmod +x server.sh && ./server.sh', '✔ Fresh Reinstall Command copied!')" 
              class="btn-cyber text-xs py-1.5 px-3.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-black flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.5)]">
              <i class="fa-solid fa-copy"></i> Copy Fresh Reinstall Command
            </button>
          </div>
          <p class="text-[11px] text-gray-300">
            💡 <strong>কীভাবে ব্যবহার করবেন:</strong> Termux আনইনস্টল করে PlayStore/F-Droid থেকে আবার ফ্রেশ Termux ইনস্টল করার পর শুধু এই একটি কমান্ড পেস্ট করে এন্টার দিবেন। এটি নিজে থেকেই পারমিশন নিবে, পাইথন-টার ইনস্টল করবে, ব্যাকআপ আনজিপ করবে এবং সার্ভার চালু করে দিবে।
          </p>
          <div class="p-3 rounded-lg bg-[#051117] font-mono text-xs text-emerald-300 border border-emerald-500/40 break-all select-all shadow-inner">
            <code>termux-setup-storage -y && pkg update -y && pkg install -y python python-pip git tar && cp /sdcard/Download/foysal-tools-backup.tar.gz ~/ 2>/dev/null || cp /sdcard/foysal-tools-backup.tar.gz ~/ 2>/dev/null; cd ~ && tar -xzf foysal-tools-backup.tar.gz && cd foysal-tools && chmod +x server.sh && ./server.sh</code>
          </div>
        </div>

        <!-- BOX 2: ⚡ 1-Touch Fast Restore Script -->
        <div class="p-3.5 sm:p-4 rounded-xl bg-black/80 border border-cyan-500/40 space-y-2">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 font-black text-[10px] uppercase">
                BOX 2: SCRIPT RUNNER
              </span>
              <h4 class="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <i class="fa-solid fa-file-code text-cyan-400"></i> 1-Touch Auto Restore Script (স্ক্রিপ্ট দিয়ে এক ক্লিকে রিস্টোর)
              </h4>
            </div>
            <button onclick="copyToClipboard('termux-setup-storage -y && bash /sdcard/Download/foysal_restore.sh', '✔ Script Command copied!')" 
              class="btn-cyber-outline text-xs py-1.5 px-3 text-cyan-300 border-cyan-400/40 hover:bg-cyan-500/20 font-bold flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-copy"></i> Copy Script Cmd
            </button>
          </div>
          <p class="text-[11px] text-gray-400">
            💡 ফোন মেমোরিতে অলরেডি <code class="text-cyan-300">foysal_restore.sh</code> স্ক্রিপ্ট সেভ আছে। টারমাক্সে শুধু এটি রান করলেই স্ক্রিপ্ট স্বয়ংক্রিয়ভাবে সবকিছু রিস্টোর করে নেয়।
          </p>
          <div class="p-2.5 rounded-lg bg-[#040e14] font-mono text-xs text-cyan-300 border border-cyan-500/30 break-all select-all">
            <code>termux-setup-storage -y && bash /sdcard/Download/foysal_restore.sh</code>
          </div>
        </div>

        <!-- BOX 3 & 4 IN 2-COLUMN GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <!-- BOX 3: 💾 Manual Storage Backup Sync -->
          <div class="p-3.5 rounded-xl bg-black/80 border border-amber-500/40 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-400/50 font-black text-[10px] uppercase">
                BOX 3: BACKUP SYNC
              </span>
              <button onclick="copyToClipboard('cd ~ && tar -czf /sdcard/Download/foysal-tools-backup.tar.gz foysal-tools && cp ~/foysal-tools/backup/foysal_restore.sh /sdcard/Download/foysal_restore.sh 2>/dev/null; echo \'✔ Backup Updated Successfully!\'', '✔ Backup Sync Command copied!')" 
                class="btn-cyber-outline text-xs py-1 px-2.5 text-amber-300 border-amber-400/40 hover:bg-amber-500/20 font-bold">
                <i class="fa-solid fa-copy"></i> Copy
              </button>
            </div>
            <h4 class="text-xs font-bold text-white flex items-center gap-1.5">
              <i class="fa-solid fa-cloud-arrow-up text-amber-400"></i> Manual Phone Storage Backup Sync (টারমাক্স থেকে ফোন স্টোরেজে সেভ)
            </h4>
            <p class="text-[11px] text-gray-400">
              টারমাক্স টার্মিনালে যেকোনো সময় এই কমান্ড রান দিলে আপনার বর্তমান সমস্ত নতুন টুলস ও কোড ফোন স্টোরেজে ব্যাকআপ হয়ে যাবে।
            </p>
            <div class="p-2 rounded-lg bg-[#140e04] font-mono text-xs text-amber-300 border border-amber-500/30 break-all select-all">
              <code>cd ~ && tar -czf /sdcard/Download/foysal-tools-backup.tar.gz foysal-tools && cp ~/foysal-tools/backup/foysal_restore.sh /sdcard/Download/foysal_restore.sh 2>/dev/null; echo "✔ Backup Updated Successfully!"</code>
            </div>
          </div>

          <!-- BOX 4: 🌐 Online Git Clone & Setup -->
          <div class="p-3.5 rounded-xl bg-black/80 border border-purple-500/40 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 border border-purple-400/50 font-black text-[10px] uppercase">
                BOX 4: ONLINE CLOUD
              </span>
              <button onclick="copyToClipboard('pkg update -y && pkg install -y git python python-pip && git clone https://github.com/USERNAME/foysal-tools.git ~/foysal-tools && cd ~/foysal-tools && chmod +x server.sh && ./server.sh', '✔ Git Clone Command copied!')" 
                class="btn-cyber-outline text-xs py-1 px-2.5 text-purple-300 border-purple-400/40 hover:bg-purple-500/20 font-bold">
                <i class="fa-solid fa-copy"></i> Copy
              </button>
            </div>
            <h4 class="text-xs font-bold text-white flex items-center gap-1.5">
              <i class="fa-brands fa-github text-purple-400"></i> Online Git Clone & Launch (ইন্টারনেট থেকে সরাসরি রান)
            </h4>
            <p class="text-[11px] text-gray-400">
              আপনি যদি গিটহাবে প্রজেক্ট রাখেন, তবে যেকোনো নতুন ফোনে গিট ক্লোন করে এক ক্লিকে চালু করার স্ট্যান্ডার্ড কমান্ড।
            </p>
            <div class="p-2 rounded-lg bg-[#110517] font-mono text-xs text-purple-300 border border-purple-500/30 break-all select-all">
              <code>pkg update -y && pkg install -y git python python-pip && git clone https://github.com/USERNAME/foysal-tools.git ~/foysal-tools && cd ~/foysal-tools && chmod +x server.sh && ./server.sh</code>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ======================================================== -->
    <!-- ⚡ SECTION 2: DAILY SERVER RUNNER HERO CARD -->
    <!-- ======================================================== -->
    <div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-black to-[#052329] border-2 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.3)] mb-6 space-y-4 relative overflow-hidden">
      <!-- Glow ambient backdrop -->
      <div class="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.8)]">
            ⚡ DAILY RUNNER
          </span>
          <div>
            <h3 class="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <i class="fa-solid fa-server text-emerald-400"></i> Foysal Tools Daily Server & Python Launcher
            </h3>
            <p class="text-xs text-gray-300 mt-0.5">
              প্রতিদিন স্বাভাবিকভাবে সার্ভার চালু করার স্ট্যান্ডার্ড কমান্ড (Python, server.sh, OTP Studio & Admin Panel)।
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2 self-end sm:self-auto">
          <span class="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Port: 8080 Active
          </span>
        </div>
      </div>

      <!-- Master Code Box -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs text-gray-300 font-mono">
          <span class="text-emerald-300 font-bold flex items-center gap-1.5">
            <i class="fa-solid fa-terminal text-emerald-400"></i> Active Master Execution Command:
          </span>
          <span class="text-gray-400 text-[11px]">Paste & run directly in Termux</span>
        </div>
        <div class="relative group">
          <div id="master-termux-cmd-box" class="p-3.5 sm:p-4 rounded-xl bg-black/95 border-2 border-emerald-500/60 font-mono text-xs sm:text-sm text-emerald-300 break-all select-all shadow-[inset_0_0_25px_rgba(0,0,0,0.8)]">
            <code>${currentMasterCmd}</code>
          </div>
        </div>
      </div>

      <!-- Quick Action Controls & Variations -->
      <div class="space-y-2.5 pt-1">
        <div class="flex flex-wrap items-center gap-2">
          <button onclick="copyMasterTermuxCmd()" class="flex-1 sm:flex-none btn-cyber text-xs sm:text-sm py-3 px-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-black font-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.6)] transform hover:scale-[1.02] active:scale-[0.98] transition-all">
            <i class="fa-solid fa-copy text-sm"></i>
            <span>COPY DAILY COMMAND (কমান্ড কপি করুন)</span>
          </button>
          <a href="http://localhost:8080" target="_blank" class="btn-cyber-outline text-xs py-3 px-4 text-cyan-300 border-cyan-400/40 hover:bg-cyan-500/20 font-bold flex items-center gap-1.5">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Localhost:8080
          </a>
        </div>

        <!-- 4 Variant Pills -->
        <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
          <span class="text-[11px] text-gray-400 font-mono mr-1">Other Options:</span>
          <button type="button" onclick="setMasterCmdVariant('default')" class="master-variant-btn text-[11px] py-1 px-3 rounded-lg bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-bold hover:bg-emerald-500/40 transition">
            ⚡ Standard Launcher
          </button>
          <button type="button" onclick="setMasterCmdVariant('autofix')" class="master-variant-btn text-[11px] py-1 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-bold hover:border-amber-400 hover:text-amber-300 transition">
            🛠️ Full Auto-Fix & Install
          </button>
          <button type="button" onclick="setMasterCmdVariant('restart')" class="master-variant-btn text-[11px] py-1 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-bold hover:border-cyan-400 hover:text-cyan-300 transition">
            🔄 Clean Restart (Release Port)
          </button>
          <button type="button" onclick="setMasterCmdVariant('directpy')" class="master-variant-btn text-[11px] py-1 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-bold hover:border-purple-400 hover:text-purple-300 transition">
            🐍 Direct Python 3
          </button>
        </div>
      </div>
    </div>

    <!-- Category Filter Bar -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin">
      ${categories.map(cat => `
        <button onclick="filterTermuxCategory('${escapeHtml(cat)}')" 
          class="termux-cat-pill text-xs py-1.5 px-3.5 rounded-xl font-bold whitespace-nowrap transition-all ${cat === currentActiveCategory ? 'bg-emerald-500/30 text-emerald-200 border-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/30 hover:text-white'}">
          ${cat}
        </button>
      `).join('')}
    </div>

    <!-- Command Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="termux-list">
      ${TERMUX_COMMANDS.map(cmd => createTermuxCard(cmd)).join('')}
    </div>
  `;

  // Fetch live backup status in background
  fetchTermuxBackupStatus();
}

async function fetchTermuxBackupStatus() {
  try {
    const res = await fetch('/api/termux/backup/status');
    const data = await res.json();
    if (data.success) {
      const sizeEl = document.getElementById('recovery-live-size');
      const timeEl = document.getElementById('recovery-live-time');
      if (sizeEl) sizeEl.textContent = data.size || '902 KB';
      if (timeEl) timeEl.textContent = data.timestamp || 'Ready';
    }
  } catch (e) {
    console.warn('[Backup Status Notice]:', e);
  }
}

async function syncTermuxBackupLive() {
  const btn = document.getElementById('btn-sync-backup-live');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> <span>Syncing Backup...</span>';
  }

  try {
    const res = await fetch('/api/termux/backup/create', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      const sizeEl = document.getElementById('recovery-live-size');
      const timeEl = document.getElementById('recovery-live-time');
      if (sizeEl) sizeEl.textContent = data.size;
      if (timeEl) timeEl.textContent = data.timestamp;

      if (typeof showToast === 'function') {
        showToast('✔ All tools and files synchronized to /sdcard/Download!');
      }
    } else {
      if (typeof showToast === 'function') {
        showToast('✘ Backup notice: ' + (data.error || 'Failed'));
      }
    }
  } catch (err) {
    if (typeof showToast === 'function') {
      showToast('Error syncing backup: ' + err.message);
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up mr-1"></i> <span>SYNC & UPDATE BACKUP NOW</span>';
    }
  }
}

// Background debounced auto-sync when tools are added/updated/deleted
function syncTermuxBackupAuto() {
  clearTimeout(backupSyncDebounceTimer);
  backupSyncDebounceTimer = setTimeout(async () => {
    try {
      await fetch('/api/termux/backup/create', { method: 'POST' });
      fetchTermuxBackupStatus();
    } catch (e) {
      console.warn('[Auto Backup Notice]:', e);
    }
  }, 2000);
}
window.syncTermuxBackupAuto = syncTermuxBackupAuto;

function copyMasterTermuxCmd() {
  if (typeof copyToClipboard === 'function') {
    copyToClipboard(currentMasterCmd, '✔ Daily Server Command copied to clipboard!');
  } else {
    navigator.clipboard.writeText(currentMasterCmd);
    if (typeof showToast === 'function') showToast('✔ Daily Server Command copied!');
  }
}

function setMasterCmdVariant(variant) {
  const box = document.getElementById('master-termux-cmd-box');
  if (!box) return;

  if (variant === 'default') {
    currentMasterCmd = 'cd ~/foysal-tools && chmod +x server.sh && ./server.sh';
    showToast('⚡ Standard Daily Server Command selected!');
  } else if (variant === 'autofix') {
    currentMasterCmd = 'pkg update -y && pkg install -y python python-pip git && pip install requests && cd ~/foysal-tools && chmod +x server.sh && ./server.sh';
    showToast('🛠️ Full Auto-Fix & Install Command selected!');
  } else if (variant === 'restart') {
    currentMasterCmd = 'pkill -f "backend.py" 2>/dev/null; fuser -k 8080/tcp 2>/dev/null; cd ~/foysal-tools && chmod +x server.sh && ./server.sh';
    showToast('🔄 Clean Restart & Port Release Command selected!');
  } else if (variant === 'directpy') {
    currentMasterCmd = 'cd ~/foysal-tools && python3 backend.py 8080';
    showToast('🐍 Direct Python 3 Command selected!');
  }

  box.innerHTML = `<code>${escapeHtml(currentMasterCmd)}</code>`;
  copyMasterTermuxCmd();

  // Update variant button styling
  document.querySelectorAll('.master-variant-btn').forEach(btn => {
    btn.className = 'master-variant-btn text-[11px] py-1 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-bold hover:border-emerald-400 hover:text-emerald-300 transition';
  });
  if (event && event.target) {
    event.target.className = 'master-variant-btn text-[11px] py-1 px-3 rounded-lg bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)] transition';
  }
}

function createTermuxCard(item) {
  let badgeStyle = 'background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4);';
  if (item.badge.includes('RECOMMENDED') || item.badge.includes('FIRE') || item.badge.includes('FRESH')) {
    badgeStyle = 'background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.5);';
  } else if (item.badge.includes('RESTART') || item.badge.includes('FIX') || item.badge.includes('SCRIPT')) {
    badgeStyle = 'background: rgba(6, 182, 212, 0.2); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.5);';
  } else if (item.badge.includes('BACKUP')) {
    badgeStyle = 'background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.5);';
  }

  return `
    <div class="glass-panel p-4 rounded-xl flex flex-col justify-between hover:border-emerald-400/80 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all bg-gradient-to-br from-black/80 to-[#05161c]">
      <div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-[10px] px-2 py-0.5 rounded-full font-mono font-black" style="${badgeStyle}">
            ${item.badge}
          </span>
          <span class="text-[10px] text-gray-400 font-mono">${item.category}</span>
        </div>
        <h3 class="font-black text-white text-sm sm:text-base flex items-center gap-2 mb-1">
          <i class="fa-solid ${item.icon} text-emerald-400"></i>
          ${item.title}
        </h3>
        <p class="text-xs text-gray-400 mb-3 leading-relaxed">${item.description}</p>
      </div>

      <div class="space-y-2 pt-2 border-t border-white/5">
        <div class="relative bg-black/80 rounded-lg p-2.5 border border-white/10 font-mono text-xs text-emerald-300 break-all select-all">
          <code>${item.cmd}</code>
        </div>
        <button onclick="copyToClipboard('${escapeHtml(item.cmd)}', '✔ Command copied to clipboard!')" class="btn-cyber w-full text-xs py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500 hover:to-teal-500 hover:text-black text-emerald-300 border border-emerald-500/40 font-bold transition flex items-center justify-center gap-1.5">
          <i class="fa-solid fa-copy"></i> Copy Command
        </button>
      </div>
    </div>
  `;
}

function filterTermuxCommands(query) {
  const q = query.toLowerCase().trim();
  const list = document.getElementById('termux-list');
  if (!list) return;

  const filtered = TERMUX_COMMANDS.filter(c => {
    const matchesCategory = currentActiveCategory === 'All' || c.category === currentActiveCategory;
    const matchesQuery = !q || (
      c.title.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q) || 
      c.cmd.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
    return matchesCategory && matchesQuery;
  });

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="col-span-full text-center py-12 text-gray-500 font-mono">
        <i class="fa-solid fa-magnifying-glass text-3xl mb-2 text-gray-600"></i>
        <p>No matching Termux commands found.</p>
      </div>
    `;
  } else {
    list.innerHTML = filtered.map(cmd => createTermuxCard(cmd)).join('');
  }
}

function filterTermuxCategory(cat) {
  currentActiveCategory = cat;
  document.querySelectorAll('.termux-cat-pill').forEach(pill => {
    if (pill.textContent.trim() === cat) {
      pill.className = 'termux-cat-pill text-xs py-1.5 px-3.5 rounded-xl font-bold whitespace-nowrap transition-all bg-emerald-500/30 text-emerald-200 border-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]';
    } else {
      pill.className = 'termux-cat-pill text-xs py-1.5 px-3.5 rounded-xl font-bold whitespace-nowrap transition-all bg-white/5 text-gray-400 border border-white/10 hover:border-white/30 hover:text-white';
    }
  });

  const searchInput = document.getElementById('termux-search');
  filterTermuxCommands(searchInput ? searchInput.value : '');
}
