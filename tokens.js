/* ============================================================
   FOYSAL TOOLS - TOKEN KEY & LICENSE MANAGEMENT ENGINE
   Device ID Hardware Binding, Usage Analytics & Access Control
   Author: Foysal Tools Admin System
   ============================================================ */

const TokenManager = {
  tokens: [],
  myDeviceId: '',

  init() {
    this.myDeviceId = this.getOrCreateDeviceId();
    this.renderMyDeviceId();
    this.loadTokens();
  },

  // GET OR GENERATE UNIQUE DEVICE ID
  getOrCreateDeviceId() {
    let devId = localStorage.getItem('foysal_device_id');
    if (!devId) {
      // Generate unique hardware/device fingerprint
      const raw = [
        navigator.userAgent,
        screen.width + 'x' + screen.height,
        screen.colorDepth,
        navigator.language,
        new Date().getTimezoneOffset(),
        Math.random().toString(36).substring(2, 10)
      ].join('###');

      // Hash into a clean readable Device ID
      let hash = 0;
      for (let i = 0; i < raw.length; i++) {
        hash = ((hash << 5) - hash) + raw.charCodeAt(i);
        hash |= 0;
      }
      const hex = Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
      const rand = Math.floor(1000 + Math.random() * 9000);
      devId = `DEV-${hex.substring(0, 4)}-${hex.substring(4, 8)}-${rand}`;
      localStorage.setItem('foysal_device_id', devId);
    }
    return devId;
  },

  renderMyDeviceId() {
    const el = document.getElementById('my-device-id-display');
    if (el) el.textContent = this.myDeviceId;
    const input = document.getElementById('token-input-device-id');
    if (input && !input.value) input.placeholder = `e.g. ${this.myDeviceId}`;
    const modalDev = document.getElementById('unlock-modal-device-id');
    if (modalDev) modalDev.textContent = this.myDeviceId;
  },

  onLockModeChanged(mode) {
    const devContainer = document.getElementById('device-id-input-container');
    const hint = document.getElementById('device-lock-hint');
    if (!devContainer) return;

    if (mode === 'specific') {
      devContainer.classList.remove('opacity-40', 'pointer-events-none');
      if (hint) hint.innerHTML = `<span class="text-orange-400 font-bold"><i class="fa-solid fa-lock mr-1"></i> Specific Device Lock:</span> Key will strictly only work on the Device ID entered below.`;
    } else if (mode === 'auto') {
      devContainer.classList.add('opacity-40', 'pointer-events-none');
      if (hint) hint.innerHTML = `<span class="text-cyan-400 font-bold"><i class="fa-solid fa-bolt mr-1"></i> Auto-Lock 1st Device:</span> The first device to enter this key will permanently bind to it.`;
    } else {
      devContainer.classList.add('opacity-40', 'pointer-events-none');
      if (hint) hint.innerHTML = `<span class="text-gray-400 font-bold"><i class="fa-solid fa-globe mr-1"></i> Public Access:</span> Key can be used on any device up to account/usage limits.`;
    }
  },

  copyMyDeviceId() {
    copyToClipboard(this.myDeviceId, 'Your Device ID copied to clipboard!');
  },

  // GENERATE RANDOM KEY IN FORM
  generateRandomKey(prefix = 'FOYSAL') {
    const p1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const p2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const p3 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const key = `${prefix}-${p1}-${p2}-${p3}`;

    const input = document.getElementById('token-custom-key');
    if (input) input.value = key;
    return key;
  },

  // LOAD TOKENS FROM BACKEND (PYTHON 3 OR PHP)
  async loadTokens() {
    const listEl = document.getElementById('token-keys-table-body');
    const countEl = document.getElementById('stat-active-keys');
    const usesEl = document.getElementById('stat-total-uses');
    const lockedEl = document.getElementById('stat-locked-keys');
    const blockedEl = document.getElementById('stat-blocked-keys');

    try {
      // Try Python 3 endpoint first, fall back to PHP
      let res = await fetch('api/tokens').catch(() => null);
      if (!res || !res.ok) {
        res = await fetch('api.php?action=get_tokens');
      }
      const data = await res.json();

      if (data && data.success && Array.isArray(data.tokens)) {
        this.tokens = data.tokens;
      } else {
        this.tokens = [];
      }
    } catch (e) {
      this.tokens = [];
    }

    const activeCount = this.tokens.filter(t => !t.blocked).length;
    const totalUses = this.tokens.reduce((acc, t) => acc + (t.used_count || 0), 0);
    const lockedCount = this.tokens.filter(t => t.device_lock_mode && t.device_lock_mode !== 'none').length;
    const blockedCount = this.tokens.filter(t => t.blocked).length;

    if (countEl) countEl.textContent = activeCount;
    if (usesEl) usesEl.textContent = totalUses;
    if (lockedEl) lockedEl.textContent = lockedCount;
    if (blockedEl) blockedEl.textContent = blockedCount;

    this.renderTokensTable();
    this.populateToolOptions();
  },

  populateToolOptions() {
    const select = document.getElementById('token-target-tool');
    if (!select || !window.app) return;

    const currentVal = select.value;
    select.innerHTML = `<option value="all">🌐 ALL TOOLS (Master VIP Access)</option>`;
    
    window.app.tools.forEach(tool => {
      select.innerHTML += `<option value="${tool.id}">🔧 ${escapeHtml(tool.name)} (${escapeHtml(tool.category)})</option>`;
    });

    if (currentVal) select.value = currentVal;
  },

  // CREATE NEW TOKEN KEY
  async submitNewToken() {
    const keyInput = document.getElementById('token-custom-key');
    const toolSelect = document.getElementById('token-target-tool');
    const lockModeSelect = document.getElementById('token-lock-mode');
    const deviceIdInput = document.getElementById('token-input-device-id');
    const maxUsersInput = document.getElementById('token-max-users');
    const maxUsesInput = document.getElementById('token-max-uses');
    const expirySelect = document.getElementById('token-expiry-type');
    const notesInput = document.getElementById('token-notes');

    const key = keyInput ? keyInput.value.trim() : '';
    const toolId = toolSelect ? toolSelect.value : 'all';
    const toolName = toolSelect && toolSelect.selectedOptions[0] ? toolSelect.selectedOptions[0].text : 'All Tools';
    const lockMode = lockModeSelect ? lockModeSelect.value : 'none';
    const deviceId = (lockMode === 'specific' && deviceIdInput) ? deviceIdInput.value.trim() : '';
    const maxUsers = maxUsersInput ? parseInt(maxUsersInput.value || 0, 10) : 0;
    const expiryType = expirySelect ? expirySelect.value : 'lifetime';
    const customHoursInput = document.getElementById('token-custom-hours');
    const customHours = customHoursInput ? parseFloat(customHoursInput.value || 0) : 0;
    const notes = notesInput ? notesInput.value.trim() : '';

    if (lockMode === 'specific' && !deviceId) {
      showToast('Please enter or paste the target Device ID to lock!');
      if (deviceIdInput) deviceIdInput.focus();
      return;
    }

    if (expiryType === 'custom' && (!customHours || customHours <= 0)) {
      showToast('Please enter a valid number of custom hours!');
      if (customHoursInput) customHoursInput.focus();
      return;
    }

    const payload = {
      key: key || this.generateRandomKey('FOYSAL'),
      tool_id: toolId,
      tool_name: toolName,
      device_lock_mode: lockMode,
      device_id: deviceId,
      max_users: maxUsers,
      max_uses: maxUses,
      expiry_type: expiryType,
      custom_hours: customHours,
      notes: notes
    };

    try {
      let res = await fetch('api/tokens/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch('api.php?action=create_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data && data.success) {
        showToast(data.message || 'Token Key created successfully!');
        if (keyInput) keyInput.value = '';
        if (notesInput) notesInput.value = '';
        this.loadTokens();
      } else {
        showToast(data.error || 'Failed to create token key.');
      }
    } catch (err) {
      showToast('Error connecting to backend API: ' + err.message);
    }
  },

  // TOGGLE BLOCK/UNBLOCK
  async toggleBlock(id) {
    try {
      let res = await fetch('api/tokens/toggle_block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch('api.php?action=toggle_block_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      }

      showToast('Token status updated.');
      this.loadTokens();
    } catch (e) {
      showToast('Failed to update token.');
    }
  },

  // DELETE TOKEN
  async deleteToken(id) {
    if (!confirm('Are you sure you want to permanently delete this Token Key?')) return;

    try {
      let res = await fetch('api/tokens/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch('api.php?action=delete_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      }

      showToast('Token key deleted.');
      this.loadTokens();
    } catch (e) {
      showToast('Failed to delete token.');
    }
  },

  // RENDER LIVE ANALYTICS TABLE
  renderTokensTable() {
    const tbody = document.getElementById('token-keys-table-body');
    if (!tbody) return;

    if (this.tokens.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="p-8 text-center text-gray-500 font-mono text-xs">
            <i class="fa-solid fa-key text-3xl mb-2 text-gray-600 block"></i>
            No token keys generated yet. Use the form above to create your first random license key!
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.tokens.map(t => {
      // Status pill
      let statusClass = 'bg-green-500/20 text-green-400 border-green-500/40';
      if (t.live_status === 'BLOCKED') statusClass = 'bg-red-500/20 text-red-400 border-red-500/40';
      else if (t.live_status === 'EXPIRED') statusClass = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      else if (t.live_status === 'DEPLETED') statusClass = 'bg-purple-500/20 text-purple-400 border-purple-500/40';

      // Device lock indicator
      let deviceBadge = '<span class="text-gray-400 text-[10px]"><i class="fa-solid fa-lock-open mr-1"></i> Any Device</span>';
      if (t.device_lock_mode === 'specific') {
        deviceBadge = `<span class="text-orange-400 font-mono text-[10px] bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/30" title="Locked to: ${t.device_id}"><i class="fa-solid fa-lock mr-1"></i> ${t.device_id.substring(0, 10)}...</span>`;
      } else if (t.device_lock_mode === 'auto') {
        if (t.device_id) {
          deviceBadge = `<span class="text-cyan-400 font-mono text-[10px] bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30" title="Auto-bound to: ${t.device_id}"><i class="fa-solid fa-shield-halved mr-1"></i> ${t.device_id.substring(0, 10)}...</span>`;
        } else {
          deviceBadge = `<span class="text-yellow-400 font-mono text-[10px] bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/30"><i class="fa-solid fa-bolt mr-1"></i> Auto-locks 1st user</span>`;
        }
      }

      // Usage text
      const maxUsesText = t.max_uses > 0 ? t.max_uses : '∞';
      const maxUsersText = t.max_users > 0 ? t.max_users : '∞';

      // Expiry text
      let expiryText = 'Lifetime';
      if (t.expires_at) {
        const remainingHours = Math.round((t.expires_at - (Date.now()/1000)) / 3600);
        if (remainingHours <= 0) expiryText = '<span class="text-red-400 font-bold">Expired</span>';
        else if (remainingHours < 24) expiryText = `<span class="text-yellow-400">${remainingHours}h remaining</span>`;
        else expiryText = `${Math.round(remainingHours/24)} days`;
      }

      return `
        <tr class="border-b border-white/5 hover:bg-white/5 font-mono text-xs transition-colors">
          <td class="p-3">
            <div class="flex items-center gap-2">
              <span class="font-bold text-[var(--primary)] text-sm">${escapeHtml(t.key)}</span>
              <button onclick="copyToClipboard('${escapeHtml(t.key)}', 'Token key copied!')" class="text-gray-400 hover:text-white" title="Copy Key">
                <i class="fa-solid fa-copy"></i>
              </button>
            </div>
            ${t.notes ? `<div class="text-[10px] text-gray-400 mt-0.5 truncate max-w-xs">${escapeHtml(t.notes)}</div>` : ''}
          </td>

          <td class="p-3">
            <div class="text-white font-semibold">${escapeHtml(t.tool_name)}</div>
            <div class="text-[10px] text-gray-500">Scope: ${t.tool_id === 'all' ? 'Universal' : 'Specific Tool'}</div>
          </td>

          <td class="p-3">${deviceBadge}</td>

          <td class="p-3">
            <div class="text-white font-bold">${t.used_count || 0} / <span class="text-gray-400">${maxUsesText}</span> runs</div>
            <div class="text-[10px] text-gray-400">${t.active_accounts || 0} / ${maxUsersText} users</div>
          </td>

          <td class="p-3 text-gray-300">${expiryText}</td>

          <td class="p-3">
            <span class="text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${statusClass}">
              ${t.live_status}
            </span>
          </td>

          <td class="p-3 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="TokenManager.toggleBlock('${t.id}')" title="${t.blocked ? 'Unblock Key' : 'Block Key'}" class="btn-cyber-outline text-[11px] py-1 px-2.5 ${t.blocked ? 'border-green-500 text-green-400' : 'border-yellow-500 text-yellow-400'}">
                <i class="fa-solid ${t.blocked ? 'fa-lock-open' : 'fa-ban'}"></i>
              </button>
              <button onclick="TokenManager.deleteToken('${t.id}')" title="Delete Key" class="btn-cyber-danger text-[11px] py-1 px-2.5">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // VERIFY TOKEN & UNLOCK TOOL IN MODAL
  async verifyAndUnlockTool() {
    const keyInput = document.getElementById('unlock-token-input');
    const targetToolId = document.getElementById('unlock-target-tool-id')?.value;
    const errorBox = document.getElementById('unlock-error-msg');

    const key = keyInput ? keyInput.value.trim() : '';
    if (!key) {
      if (errorBox) {
        errorBox.textContent = 'Please enter your Token License Key!';
        errorBox.classList.remove('hidden');
      }
      return;
    }

    if (errorBox) errorBox.classList.add('hidden');

    try {
      const payload = {
        key: key,
        tool_id: targetToolId,
        device_id: this.myDeviceId
      };

      let res = await fetch('api/tokens/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch('api.php?action=verify_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();

      if (data && data.success) {
        // Save verified key session in session storage
        sessionStorage.setItem('foysal_unlocked_' + targetToolId, 'true');
        sessionStorage.setItem('foysal_master_unlocked', 'true');

        closeModal('token-unlock-modal');
        showToast('Access Granted! Launching tool...');
        this.loadTokens();

        // Launch tool directly
        if (window.app) {
          window.app.executeToolDirectly(targetToolId);
        }
      } else {
        if (errorBox) {
          errorBox.textContent = data.error || 'Invalid Token Key or Device Mismatch!';
          errorBox.classList.remove('hidden');
        }
      }
    } catch (e) {
      if (errorBox) {
        errorBox.textContent = 'Verification connection error: ' + e.message;
        errorBox.classList.remove('hidden');
      }
    }
  }
};

window.TokenManager = TokenManager;

document.addEventListener('DOMContentLoaded', () => {
  TokenManager.init();
});
