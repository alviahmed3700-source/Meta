/* ============================================================
   FOYSAL TOOLS - ADVANCED BUILTIN TOOLS SUITE
   Author: Foysal Tools Admin System
   ============================================================ */

// PURE JAVASCRIPT MD5 IMPLEMENTATION
function md5(inputString) {
  function rotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function addUnsigned(lX, lY) {
    var lX4 = lX & 0x40000000, lY4 = lY & 0x40000000;
    var lX8 = lX & 0x80000000, lY8 = lY & 0x80000000;
    var lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  }
  function F(x, y, z) { return (x & y) | (~x & z); }
  function G(x, y, z) { return (x & z) | (y & ~z); }
  function H(x, y, z) { return x ^ y ^ z; }
  function I(x, y, z) { return y ^ (x | ~z); }

  function FF(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function wordToHex(lValue) {
    var WordToHexValue = '', WordToHexValue_temp = '', lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = '0' + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }

  var x = convertToWordArray(inputString);
  var a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

  for (var k = 0; k < x.length; k += 16) {
    var AA = a, BB = b, CC = c, DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);

    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);

    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);

    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }
  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

// SHA HASH HELPER (Web Crypto API)
async function shaHash(text, algorithm = 'SHA-256') {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// BUILT-IN TOOLS MODULE
const BuiltinTools = {
  // 1. HASH GENERATOR
  initHashTool() {
    const input = document.getElementById('hash-input');
    const compareInput = document.getElementById('hash-compare-input');
    if (!input) return;

    const compute = async () => {
      const text = input.value;
      const md5Val = md5(text);
      const sha1Val = await shaHash(text, 'SHA-1');
      const sha256Val = await shaHash(text, 'SHA-256');
      const sha512Val = await shaHash(text, 'SHA-512');

      document.getElementById('out-md5').textContent = text ? md5Val : '---';
      document.getElementById('out-sha1').textContent = text ? sha1Val : '---';
      document.getElementById('out-sha256').textContent = text ? sha256Val : '---';
      document.getElementById('out-sha512').textContent = text ? sha512Val : '---';

      BuiltinTools.checkHashMatch();
    };

    input.addEventListener('input', compute);
    if (compareInput) {
      compareInput.addEventListener('input', BuiltinTools.checkHashMatch);
    }
  },

  checkHashMatch() {
    const compareInput = document.getElementById('hash-compare-input');
    const resultBox = document.getElementById('hash-match-result');
    if (!compareInput || !resultBox) return;

    const target = compareInput.value.trim().toLowerCase();
    if (!target) {
      resultBox.innerHTML = '';
      return;
    }

    const md5V = document.getElementById('out-md5')?.textContent?.trim().toLowerCase();
    const sha1V = document.getElementById('out-sha1')?.textContent?.trim().toLowerCase();
    const sha256V = document.getElementById('out-sha256')?.textContent?.trim().toLowerCase();
    const sha512V = document.getElementById('out-sha512')?.textContent?.trim().toLowerCase();

    let matchedAlgo = null;
    if (target === md5V) matchedAlgo = 'MD5';
    else if (target === sha1V) matchedAlgo = 'SHA-1';
    else if (target === sha256V) matchedAlgo = 'SHA-256';
    else if (target === sha512V) matchedAlgo = 'SHA-512';

    if (matchedAlgo) {
      resultBox.innerHTML = `
        <div class="p-3 rounded-lg bg-green-500/20 border border-green-500 text-green-300 font-mono text-sm flex items-center gap-2">
          <i class="fa-solid fa-circle-check text-green-400 text-lg"></i>
          <span><strong>MATCH VERIFIED!</strong> Matches the generated <strong>${matchedAlgo}</strong> hash!</span>
        </div>
      `;
    } else {
      resultBox.innerHTML = `
        <div class="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-300 font-mono text-sm flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation text-red-400 text-lg"></i>
          <span>No match detected with current input text.</span>
        </div>
      `;
    }
  },

  // 2. MULTI ENCODER / DECODER
  processCodec(mode) {
    const input = document.getElementById('codec-input').value;
    const format = document.getElementById('codec-format').value;
    let output = '';

    try {
      if (mode === 'encode') {
        switch (format) {
          case 'base64':
            output = btoa(unescape(encodeURIComponent(input)));
            break;
          case 'hex':
            output = Array.from(new TextEncoder().encode(input))
              .map(b => b.toString(16).padStart(2, '0')).join(' ');
            break;
          case 'binary':
            output = Array.from(new TextEncoder().encode(input))
              .map(b => b.toString(2).padStart(8, '0')).join(' ');
            break;
          case 'url':
            output = encodeURIComponent(input);
            break;
          case 'html':
            output = input.replace(/[\u00A0-\u9999<>\&]/g, i => '&#' + i.charCodeAt(0) + ';');
            break;
          case 'rot13':
            output = input.replace(/[a-zA-Z]/g, c => 
              String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
            );
            break;
        }
      } else {
        // Decode
        switch (format) {
          case 'base64':
            output = decodeURIComponent(escape(atob(input.trim())));
            break;
          case 'hex':
            const hexClean = input.replace(/\s+/g, '');
            const hexBytes = [];
            for (let i = 0; i < hexClean.length; i += 2) {
              hexBytes.push(parseInt(hexClean.substr(i, 2), 16));
            }
            output = new TextDecoder().decode(new Uint8Array(hexBytes));
            break;
          case 'binary':
            const binClean = input.replace(/\s+/g, '');
            const binBytes = [];
            for (let i = 0; i < binClean.length; i += 8) {
              binBytes.push(parseInt(binClean.substr(i, 8), 2));
            }
            output = new TextDecoder().decode(new Uint8Array(binBytes));
            break;
          case 'url':
            output = decodeURIComponent(input);
            break;
          case 'html':
            const doc = new DOMParser().parseFromString(input, 'text/html');
            output = doc.documentElement.textContent;
            break;
          case 'rot13':
            output = input.replace(/[a-zA-Z]/g, c => 
              String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
            );
            break;
        }
      }
      document.getElementById('codec-output').value = output;
    } catch (err) {
      document.getElementById('codec-output').value = `[Error decoding: ${err.message}]`;
    }
  },

  swapCodec() {
    const inBox = document.getElementById('codec-input');
    const outBox = document.getElementById('codec-output');
    const temp = inBox.value;
    inBox.value = outBox.value;
    outBox.value = temp;
  },

  // 3. SECURE PASSWORD & KEY GENERATOR
  generatePassword() {
    const length = parseInt(document.getElementById('pass-len')?.value || 16, 10);
    const upper = document.getElementById('pass-upper')?.checked;
    const lower = document.getElementById('pass-lower')?.checked;
    const nums = document.getElementById('pass-nums')?.checked;
    const syms = document.getElementById('pass-syms')?.checked;

    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (nums) chars += '0123456789';
    if (syms) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    const outputEl = document.getElementById('pass-output');
    if (outputEl) outputEl.value = result;

    // Strength meter
    let score = 0;
    if (result.length >= 12) score += 25;
    if (result.length >= 16) score += 15;
    if (/[A-Z]/.test(result)) score += 20;
    if (/[0-9]/.test(result)) score += 20;
    if (/[^A-Za-z0-9]/.test(result)) score += 20;

    const meter = document.getElementById('pass-strength-bar');
    const label = document.getElementById('pass-strength-text');
    if (meter && label) {
      meter.style.width = `${Math.min(100, score)}%`;
      if (score < 40) {
        meter.className = 'h-full bg-red-500 rounded-full transition-all duration-300';
        label.textContent = 'Weak';
        label.className = 'text-xs text-red-400 font-bold';
      } else if (score < 75) {
        meter.className = 'h-full bg-yellow-500 rounded-full transition-all duration-300';
        label.textContent = 'Medium';
        label.className = 'text-xs text-yellow-400 font-bold';
      } else {
        meter.className = 'h-full bg-green-500 rounded-full transition-all duration-300';
        label.textContent = 'Military-Grade Strong';
        label.className = 'text-xs text-green-400 font-bold';
      }
    }
  },

  generateApiKey(bytes = 32) {
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);
    const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    const outputEl = document.getElementById('pass-output');
    if (outputEl) outputEl.value = hex;
    showToast('Secret 256-bit API key generated!');
  },

  generateUUID() {
    const uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
    const outputEl = document.getElementById('pass-output');
    if (outputEl) outputEl.value = uuid;
    showToast('UUIDv4 generated!');
  },

  // 4. NETWORK: IP & GEO INTELLIGENCE
  async lookupIP(target = '') {
    const resultDiv = document.getElementById('ip-result');
    if (!resultDiv) return;

    resultDiv.innerHTML = `
      <div class="text-center py-8">
        <i class="fa-solid fa-circle-notch fa-spin text-2xl text-[var(--primary)] mb-2"></i>
        <p class="text-sm text-gray-400">Querying global IP intelligence network...</p>
      </div>
    `;

    try {
      const endpoint = target.trim() ? `https://ipwho.is/${encodeURIComponent(target.trim())}` : 'https://ipwho.is/';
      const res = await fetch(endpoint);
      const data = await res.json();

      if (!data.success && target.trim()) {
        resultDiv.innerHTML = `
          <div class="p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-300 text-sm">
            <i class="fa-solid fa-circle-xmark mr-2"></i> Failed to lookup target IP: ${data.message || 'Unknown IP/Host'}
          </div>
        `;
        return;
      }

      resultDiv.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-lg bg-black/40 border border-white/10">
            <div class="text-xs text-gray-400 mb-1">IP ADDRESS & TYPE</div>
            <div class="text-lg font-bold font-mono text-[var(--primary)]">${data.ip} (${data.type})</div>
            <div class="text-xs text-gray-400 mt-2 mb-1">ISP / ORGANIZATION</div>
            <div class="text-sm font-semibold text-white">${data.connection?.isp || data.connection?.org || 'N/A'}</div>
            <div class="text-xs text-gray-400 mt-2 mb-1">ASN</div>
            <div class="text-sm font-mono text-gray-300">AS${data.connection?.asn || 'N/A'}</div>
          </div>

          <div class="p-4 rounded-lg bg-black/40 border border-white/10">
            <div class="text-xs text-gray-400 mb-1">LOCATION & REGION</div>
            <div class="text-base font-bold text-white flex items-center gap-2">
              <span>${data.country} (${data.country_code})</span>
              ${data.flag?.emoji ? `<span class="text-xl">${data.flag.emoji}</span>` : ''}
            </div>
            <div class="text-sm text-gray-300 mt-1">${data.city}, ${data.region} (${data.postal || 'N/A'})</div>
            
            <div class="text-xs text-gray-400 mt-2 mb-1">COORDINATES & MAP</div>
            <div class="text-xs font-mono text-gray-400 mb-2">Lat: ${data.latitude}, Lon: ${data.longitude}</div>
            <a href="https://www.google.com/maps?q=${data.latitude},${data.longitude}" target="_blank" class="btn-cyber text-xs py-1 px-3 inline-flex">
              <i class="fa-solid fa-map-location-dot"></i> View on Google Maps
            </a>
          </div>
        </div>
      `;
    } catch (e) {
      resultDiv.innerHTML = `
        <div class="p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-300 text-sm">
          <i class="fa-solid fa-triangle-exclamation mr-2"></i> Network error connecting to IP service. Ensure you are connected to the internet.
        </div>
      `;
    }
  },

  // 5. CLOUDFLARE DNS RESOLVER
  async resolveDNS() {
    const domain = document.getElementById('dns-domain')?.value.trim();
    const type = document.getElementById('dns-type')?.value || 'A';
    const resultBox = document.getElementById('dns-result');
    if (!resultBox) return;

    if (!domain) {
      showToast('Please enter a valid domain name!');
      return;
    }

    resultBox.innerHTML = `
      <div class="text-center py-6">
        <i class="fa-solid fa-circle-notch fa-spin text-2xl text-[var(--primary)] mb-2"></i>
        <p class="text-xs text-gray-400">Resolving ${type} records for ${domain}...</p>
      </div>
    `;

    try {
      const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`, {
        headers: { 'Accept': 'application/dns-json' }
      });
      const data = await res.json();

      if (!data.Answer || data.Answer.length === 0) {
        resultBox.innerHTML = `
          <div class="p-3 rounded-lg bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 text-xs font-mono">
            No ${type} records found for ${domain}.
          </div>
        `;
        return;
      }

      const rows = data.Answer.map(rec => `
        <tr class="border-b border-white/5 hover:bg-white/5 font-mono text-xs">
          <td class="p-2 text-white">${rec.name}</td>
          <td class="p-2 text-gray-400">${rec.TTL}s</td>
          <td class="p-2 text-[var(--primary)] break-all">${rec.data}</td>
        </tr>
      `).join('');

      resultBox.innerHTML = `
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-xs text-gray-400 border-b border-white/10 uppercase">
                <th class="p-2">Name</th>
                <th class="p-2">TTL</th>
                <th class="p-2">Data / Target</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    } catch (err) {
      resultBox.innerHTML = `
        <div class="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-300 text-xs">
          Error resolving DNS: ${err.message}
        </div>
      `;
    }
  },

  // 6. JSON BEAUTIFIER & VALIDATOR
  formatJSON(indent = 2) {
    const input = document.getElementById('json-input');
    const msg = document.getElementById('json-status');
    if (!input) return;

    try {
      const parsed = JSON.parse(input.value);
      input.value = JSON.stringify(parsed, null, indent);
      if (msg) {
        msg.className = 'text-xs text-green-400 font-semibold';
        msg.innerHTML = '<i class="fa-solid fa-check mr-1"></i> Valid JSON (Formatted)';
      }
    } catch (e) {
      if (msg) {
        msg.className = 'text-xs text-red-400 font-semibold';
        msg.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-1"></i> Invalid JSON: ${e.message}`;
      }
    }
  },

  minifyJSON() {
    const input = document.getElementById('json-input');
    const msg = document.getElementById('json-status');
    if (!input) return;

    try {
      const parsed = JSON.parse(input.value);
      input.value = JSON.stringify(parsed);
      if (msg) {
        msg.className = 'text-xs text-green-400 font-semibold';
        msg.innerHTML = '<i class="fa-solid fa-check mr-1"></i> JSON Minified successfully';
      }
    } catch (e) {
      if (msg) {
        msg.className = 'text-xs text-red-400 font-semibold';
        msg.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-1"></i> Invalid JSON: ${e.message}`;
      }
    }
  },

  // 7. REGEX PLAYGROUND
  testRegex() {
    const pattern = document.getElementById('regex-pattern')?.value || '';
    const flags = document.getElementById('regex-flags')?.value || 'g';
    const text = document.getElementById('regex-text')?.value || '';
    const output = document.getElementById('regex-matches');
    if (!output) return;

    if (!pattern) {
      output.innerHTML = '<span class="text-gray-500 text-xs font-mono">Enter a pattern to test...</span>';
      return;
    }

    try {
      const reg = new RegExp(pattern, flags);
      const matches = [...text.matchAll(reg)];

      if (matches.length === 0) {
        output.innerHTML = '<span class="text-yellow-400 text-xs font-mono">No matches found.</span>';
        return;
      }

      output.innerHTML = `
        <div class="text-xs text-green-400 font-bold mb-2">Found ${matches.length} match(es):</div>
        <div class="flex flex-wrap gap-2">
          ${matches.map((m, i) => `
            <span class="px-2 py-1 rounded bg-green-500/20 border border-green-500/40 text-green-300 font-mono text-xs">
              #${i + 1}: ${escapeHtml(m[0])} <small class="text-gray-400">(idx: ${m.index})</small>
            </span>
          `).join('')}
        </div>
      `;
    } catch (err) {
      output.innerHTML = `<span class="text-red-400 text-xs font-mono">Regex Error: ${err.message}</span>`;
    }
  },

  // 8. TEXT CASE TRANSFORMER
  transformText(type) {
    const input = document.getElementById('text-transform-input');
    if (!input) return;
    const str = input.value;

    switch (type) {
      case 'upper': input.value = str.toUpperCase(); break;
      case 'lower': input.value = str.toLowerCase(); break;
      case 'title':
        input.value = str.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
        break;
      case 'camel':
        input.value = str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
          if (+match === 0) return "";
          return index === 0 ? match.toLowerCase() : match.toUpperCase();
        });
        break;
      case 'snake':
        input.value = str.trim().toLowerCase().replace(/\s+/g, '_');
        break;
      case 'kebab':
        input.value = str.trim().toLowerCase().replace(/\s+/g, '-');
        break;
      case 'reverse':
        input.value = str.split('').reverse().join('');
        break;
    }
    BuiltinTools.updateTextStats();
  },

  updateTextStats() {
    const input = document.getElementById('text-transform-input');
    const stats = document.getElementById('text-stats');
    if (!input || !stats) return;

    const val = input.value;
    const chars = val.length;
    const words = val.trim() ? val.trim().split(/\s+/).length : 0;
    const lines = val ? val.split(/\r\n|\r|\n/).length : 0;

    stats.textContent = `${chars} Characters | ${words} Words | ${lines} Lines`;
  },

  // 9. QR CODE GENERATOR
  generateQR() {
    const text = document.getElementById('qr-text')?.value.trim();
    const container = document.getElementById('qr-output');
    if (!container) return;

    if (!text) {
      showToast('Please enter text or URL for QR code!');
      return;
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}&bgcolor=060913&color=00f0ff&margin=10`;

    container.innerHTML = `
      <div class="flex flex-col items-center gap-3">
        <div class="p-3 bg-black/60 rounded-xl border border-[var(--primary)] shadow-[0_0_20px_var(--primary-glow)]">
          <img src="${qrUrl}" alt="QR Code" class="w-48 h-48 rounded-lg" />
        </div>
        <a href="${qrUrl}" download="foysal-tools-qr.png" target="_blank" class="btn-cyber text-xs py-2 px-4">
          <i class="fa-solid fa-download"></i> Open / Download QR
        </a>
      </div>
    `;
  },

  // 10. META HORIZON AUTO PRO - ADVANCED ENTERPRISE ENGINE
  metaAccounts: [],
  activeMetaTab: 'accounts',
  activeFilter: 'all',
  metaMailHistory: [],
  metaMailProducts: [],
  activeSpotlightMail: null,
  isMailGenerating: false,
  mailOtpPollTimer: null,
  mailCountdownTimer: null,

  // Live Queue Pipeline Engine State
  mailQueue: [],
  queueCurrentIndex: 0,
  isQueueRunning: false,
  isQueuePaused: false,
  queueAdvanceTimer: null,
  queueAdvanceCountdownTimer: null,
  queuePollTimer: null,
  queuePropagationTimer: null,
  queueDelaySec: 2,
  queueAutoCopy: true,
  queueAutoSave: true,

  scrollMetaModal(direction) {
    const modal = document.getElementById('meta-modal');
    const dialog = document.getElementById('meta-modal-dialog');
    if (direction === 'top') {
      if (modal) modal.scrollTo({ top: 0, behavior: 'smooth' });
      if (dialog) dialog.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      if (modal) modal.scrollTo({ top: modal.scrollHeight, behavior: 'smooth' });
      if (dialog) dialog.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  },

  toggleMetaFullscreen() {
    const dialog = document.getElementById('meta-modal-dialog');
    const icon = document.getElementById('meta-fullscreen-icon');
    if (!dialog) return;
    const isFull = dialog.classList.contains('max-w-full');
    if (isFull) {
      dialog.classList.remove('max-w-full', 'min-h-[96vh]');
      dialog.classList.add('max-w-5xl');
      if (icon) {
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
      }
      showToast('Standard view restored');
    } else {
      dialog.classList.remove('max-w-5xl');
      dialog.classList.add('max-w-full', 'min-h-[96vh]');
      if (icon) {
        icon.classList.remove('fa-expand');
        icon.classList.add('fa-compress');
      }
      showToast('Expanded fullscreen view active');
    }
  },

  setMetaFilter(type) {
    this.activeFilter = type;
    const btns = ['all', 'cookie', 'today'];
    btns.forEach(b => {
      const el = document.getElementById(`meta-filter-chip-${b}`);
      if (el) {
        if (b === type) {
          el.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 cursor-pointer';
        } else {
          el.className = 'px-2 py-0.5 rounded text-[10px] font-mono text-gray-400 hover:text-white bg-black/40 border border-white/10 cursor-pointer';
        }
      }
    });
    this.filterMetaAccounts();
  },

  clearMetaSearch() {
    const input = document.getElementById('meta-search-input');
    if (input) {
      input.value = '';
      this.filterMetaAccounts();
    }
  },

  switchMetaTab(tabName) {
    if (tabName === 'mail') {
      closeModal('meta-modal');
      if (window.switchView) window.switchView('mail');
      return;
    }
    this.activeMetaTab = tabName;
    const tabs = ['accounts', 'creator', 'telegram'];
    tabs.forEach(t => {
      const panel = document.getElementById(`meta-tab-${t}`);
      const btn = document.getElementById(`meta-tab-btn-${t}`);
      if (panel) {
        if (t === tabName) panel.classList.remove('hidden');
        else panel.classList.add('hidden');
      }
      if (btn) {
        if (t === tabName) {
          btn.className = 'py-2 px-3 border-b-2 border-cyan-400 text-cyan-300 font-bold flex items-center gap-2';
        } else {
          btn.className = 'py-2 px-3 text-gray-400 hover:text-white flex items-center gap-2';
        }
      }
    });
  },

  async loadMetaStatus() {
    const statAcc = document.getElementById('meta-stat-accounts');
    const statStatus = document.getElementById('meta-stat-status');
    const statTg = document.getElementById('meta-stat-tg');
    const statPwd = document.getElementById('meta-stat-password');
    const inputPwd = document.getElementById('meta-input-default-pwd');
    const dupesBadge = document.getElementById('meta-stat-dupes-badge');
    const dupesBtn = document.getElementById('meta-stat-dupes-btn');
    const tabCountBadge = document.getElementById('meta-tab-count-badge');

    const tokenInput = document.getElementById('meta-tg-token');
    const chatIdInput = document.getElementById('meta-tg-chatid');
    const tgToggle = document.getElementById('meta-tg-toggle');

    if (statStatus) statStatus.innerHTML = '<span class="text-yellow-400 font-mono"><i class="fa-solid fa-circle-notch fa-spin"></i> Checking...</span>';

    try {
      const res = await fetch('/api/meta/status');
      const data = await res.json();

      if (data.success) {
        // Engine status
        if (statStatus) {
          statStatus.innerHTML = data.installed 
            ? '<span class="text-green-400 font-bold"><i class="fa-solid fa-circle-check"></i> READY</span>' 
            : '<span class="text-red-400"><i class="fa-solid fa-triangle-exclamation"></i> Not Installed</span>';
        }

        // Account stats
        const total = data.total_accounts || 0;
        const dupes = data.duplicate_count || 0;
        if (statAcc) statAcc.textContent = total;
        if (tabCountBadge) tabCountBadge.textContent = total;

        if (dupesBadge && dupesBtn) {
          if (dupes > 0) {
            dupesBadge.textContent = `${dupes} dupes`;
            dupesBadge.classList.remove('hidden');
            dupesBtn.classList.remove('hidden');
          } else {
            dupesBadge.classList.add('hidden');
            dupesBtn.classList.add('hidden');
          }
        }

        // Password
        const pwd = data.saved_password || 'Foysal37';
        if (statPwd) statPwd.textContent = pwd;
        if (inputPwd && !inputPwd.value) inputPwd.value = pwd;

        // Telegram status
        const tgOn = data.config && data.config.telegram_enabled;
        if (statTg) {
          statTg.innerHTML = tgOn 
            ? '<span class="text-green-400 font-bold">CONNECTED ✔</span>' 
            : '<span class="text-gray-500 font-mono">OFF</span>';
        }
        if (tokenInput && data.config?.telegram_token) tokenInput.value = data.config.telegram_token;
        if (chatIdInput && data.config?.telegram_chat_id) chatIdInput.value = data.config.telegram_chat_id;
        if (tgToggle) tgToggle.checked = !!tgOn;

        // Cache all accounts and render table
        this.metaAccounts = data.accounts || [];
        this.renderMetaAccounts();
      }
    } catch (err) {
      if (statStatus) statStatus.innerHTML = '<span class="text-red-400">API Error</span>';
      console.error('[Meta Horizon API Error]:', err);
    }
  },

  renderMetaAccounts(filterList = null) {
    const tbody = document.getElementById('meta-accounts-list');
    const counter = document.getElementById('meta-filter-counter');
    if (!tbody) return;

    const list = filterList !== null ? filterList : this.metaAccounts;
    if (counter) {
      counter.textContent = `Showing ${list.length} of ${this.metaAccounts.length} saved accounts`;
    }

    if (!list || list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-10 text-gray-500 font-mono">
            <i class="fa-solid fa-users-slash text-2xl mb-2 block text-gray-600"></i>
            No accounts found. ${filterList !== null ? 'Try a different search keyword.' : 'Run the Termux creator or click "Add Account" to get started.'}
          </td>
        </tr>
      `;
      return;
    }

    // Render accounts rows in reverse order (newest first)
    tbody.innerHTML = list.slice().reverse().map((a, i) => {
      const idx = list.length - i;
      const uid = escapeHtml(a.uid || '-');
      const name = escapeHtml(a.name || 'Meta User');
      const num = escapeHtml(a.number || '-');
      const pass = escapeHtml(a.password || '-');
      const cookie = a.cookie || '';
      const cookieLen = cookie.length;
      const createdAt = escapeHtml(a.created_at || '-');

      return `
        <tr class="border-b border-white/5 hover:bg-white/5 font-mono text-[11px] transition-colors">
          <td class="py-2.5 px-3 text-gray-500 font-bold">${idx}</td>
          <td class="py-2.5 px-3">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                ${name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div class="text-white font-bold leading-tight">${name}</div>
                ${a.uid ? `
                  <a href="https://facebook.com/${uid}" target="_blank" class="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 select-all" title="View profile on Facebook">
                    <span>${uid}</span> <i class="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
                  </a>
                ` : `<span class="text-gray-500 text-[10px]">-</span>`}
              </div>
            </div>
          </td>
          <td class="py-2.5 px-3">
            <div class="flex items-center gap-1 text-yellow-300 font-bold select-all">
              <span>+${num}</span>
              <button onclick="copyToClipboard('${num}'); showToast('Phone number copied!')" class="text-gray-500 hover:text-yellow-400 text-[10px] p-0.5">
                <i class="fa-solid fa-copy"></i>
              </button>
            </div>
          </td>
          <td class="py-2.5 px-3">
            <div class="flex items-center gap-1.5 font-bold">
              <span id="meta-pass-${idx}" data-pass="${pass}" class="text-green-300 font-mono tracking-wider">••••••••</span>
              <button onclick="BuiltinTools.toggleMetaPassMask(${idx})" class="text-gray-500 hover:text-white text-[10px] p-0.5" title="Toggle Show/Hide">
                <i id="meta-pass-icon-${idx}" class="fa-solid fa-eye text-[10px]"></i>
              </button>
              <button onclick="copyToClipboard('${pass}'); showToast('Password copied!')" class="text-gray-500 hover:text-green-400 text-[10px] p-0.5" title="Copy password">
                <i class="fa-solid fa-copy"></i>
              </button>
            </div>
          </td>
          <td class="py-2.5 px-3">
            ${cookieLen > 0 ? `
              <div class="flex items-center gap-1">
                <span class="px-1.5 py-0.5 rounded text-[9px] bg-green-500/20 text-green-300 border border-green-500/30">
                  Cookie (${cookieLen}b)
                </span>
                <button onclick="BuiltinTools.copyMetaCookie('${escapeHtml(cookie)}')" class="btn-cyber-outline text-[9px] py-0.5 px-1.5" title="Copy full cookie">
                  <i class="fa-solid fa-copy"></i>
                </button>
              </div>
            ` : `<span class="text-gray-500 text-[10px]">No Cookie</span>`}
          </td>
          <td class="py-2.5 px-3 text-gray-400 text-[10px] whitespace-nowrap">
            ${createdAt}
          </td>
          <td class="py-2.5 px-3 text-right">
            <div class="flex items-center justify-end gap-1">
              <button onclick="BuiltinTools.openMetaAccountDetails('${uid}')" class="btn-cyber text-[10px] py-1 px-2" title="Inspect Full Account & Cookie Details">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button onclick="BuiltinTools.checkMetaUidLive('${uid}', this)" class="btn-cyber-outline text-[10px] py-1 px-2 text-cyan-300 border-cyan-500/40" title="Check Facebook Live Profile Status">
                <i class="fa-solid fa-shield-halved"></i>
              </button>
              <button onclick="BuiltinTools.openMetaEditModal('${uid}')" class="btn-cyber-outline text-[10px] py-1 px-2 text-yellow-300 border-yellow-500/40" title="Edit Account">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button onclick="BuiltinTools.deleteMetaAccount('${uid}')" class="btn-cyber-outline text-[10px] py-1 px-2 text-red-400 hover:text-red-300 border-red-500/40" title="Delete Account">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  toggleMetaPassMask(idx) {
    const span = document.getElementById(`meta-pass-${idx}`);
    const icon = document.getElementById(`meta-pass-icon-${idx}`);
    if (!span) return;
    const realPass = span.getAttribute('data-pass');
    if (span.textContent === '••••••••') {
      span.textContent = realPass;
      if (icon) {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      }
    } else {
      span.textContent = '••••••••';
      if (icon) {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    }
  },

  filterMetaAccounts() {
    const query = document.getElementById('meta-search-input')?.value.toLowerCase().trim() || '';
    const clearBtn = document.getElementById('meta-search-clear-btn');
    if (clearBtn) {
      if (query) clearBtn.classList.remove('hidden');
      else clearBtn.classList.add('hidden');
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    let filtered = this.metaAccounts;

    // Filter by chip category
    if (this.activeFilter === 'cookie') {
      filtered = filtered.filter(a => a.cookie && a.cookie.trim().length > 0);
    } else if (this.activeFilter === 'today') {
      filtered = filtered.filter(a => (a.created_at || '').startsWith(todayStr));
    }

    // Filter by search query
    if (query) {
      filtered = filtered.filter(a => {
        const name = (a.name || '').toLowerCase();
        const uid = (a.uid || '').toLowerCase();
        const num = (a.number || '').toLowerCase();
        const pass = (a.password || '').toLowerCase();
        return name.includes(query) || uid.includes(query) || num.includes(query) || pass.includes(query);
      });
    }

    this.renderMetaAccounts(filtered);
  },

  openMetaAddModal() {
    document.getElementById('meta-edit-modal-title').innerHTML = '<i class="fa-solid fa-user-plus text-cyan-400"></i> Add New Account';
    document.getElementById('edit-acc-name').value = '';
    document.getElementById('edit-acc-uid').value = '';
    document.getElementById('edit-acc-number').value = '';
    document.getElementById('edit-acc-password').value = document.getElementById('meta-stat-password')?.textContent || 'Foysal37';
    document.getElementById('edit-acc-cookie').value = '';
    openModal('meta-account-edit-modal');
  },

  openMetaEditModal(uid) {
    const acc = this.metaAccounts.find(a => String(a.uid) === String(uid));
    if (!acc) {
      showToast('Account not found');
      return;
    }
    document.getElementById('meta-edit-modal-title').innerHTML = `<i class="fa-solid fa-user-pen text-cyan-400"></i> Edit Account (${escapeHtml(uid)})`;
    document.getElementById('edit-acc-name').value = acc.name || '';
    document.getElementById('edit-acc-uid').value = acc.uid || '';
    document.getElementById('edit-acc-number').value = acc.number || '';
    document.getElementById('edit-acc-password').value = acc.password || '';
    document.getElementById('edit-acc-cookie').value = acc.cookie || '';
    openModal('meta-account-edit-modal');
  },

  async saveMetaAccountForm() {
    const name = document.getElementById('edit-acc-name')?.value.trim();
    const uid = document.getElementById('edit-acc-uid')?.value.trim();
    const number = document.getElementById('edit-acc-number')?.value.trim();
    const password = document.getElementById('edit-acc-password')?.value.trim();
    const cookie = document.getElementById('edit-acc-cookie')?.value.trim();

    if (!uid && !number) {
      showToast('Please provide at least a Facebook UID or Phone Number!');
      return;
    }

    try {
      const res = await fetch('/api/meta/account/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, uid, number, password, cookie })
      });
      const data = await res.json();
      if (data.success) {
        showToast('✔ Account saved successfully!');
        closeModal('meta-account-edit-modal');
        this.loadMetaStatus();
      } else {
        showToast('✘ ' + (data.error || 'Failed to save account'));
      }
    } catch (err) {
      showToast('Error saving: ' + err.message);
    }
  },

  async deleteMetaAccount(uid) {
    if (!confirm(`Are you sure you want to delete account UID: ${uid}?`)) return;
    try {
      const res = await fetch('/api/meta/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid })
      });
      const data = await res.json();
      if (data.success) {
        showToast('✔ Account deleted successfully!');
        this.loadMetaStatus();
      } else {
        showToast('✘ ' + (data.error || 'Failed to delete'));
      }
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  },

  async deduplicateMetaAccounts() {
    showToast('Deduplicating accounts...');
    try {
      const res = await fetch('/api/meta/account/deduplicate', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`✔ ${data.message}`);
        this.loadMetaStatus();
      } else {
        showToast('✘ ' + (data.error || 'Deduplication failed'));
      }
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  },

  openMetaAccountDetails(uid) {
    const acc = this.metaAccounts.find(a => String(a.uid) === String(uid));
    if (!acc) return;

    document.getElementById('view-acc-name').textContent = acc.name || 'Meta User';
    document.getElementById('view-acc-date').textContent = 'Created: ' + (acc.created_at || 'Recently');
    document.getElementById('view-acc-uid').textContent = acc.uid || '-';
    document.getElementById('view-acc-phone').textContent = acc.number ? `+${acc.number}` : '-';
    document.getElementById('view-acc-password').textContent = acc.password || '-';
    document.getElementById('view-acc-cookie').value = acc.cookie || 'No cookie session recorded.';

    const combo = `${acc.uid || ''}|${acc.password || ''}|${acc.cookie || ''}|${acc.number || ''}|${acc.name || ''}|${acc.created_at || ''}`;
    document.getElementById('view-acc-combo').textContent = combo;

    const fbLink = document.getElementById('view-acc-fb-link');
    if (fbLink) {
      fbLink.href = acc.uid ? `https://facebook.com/${acc.uid}` : '#';
      fbLink.target = '_blank';
    }

    const badge = document.getElementById('view-acc-live-badge');
    if (badge) {
      badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-gray-500/20 text-gray-400 border border-gray-500/30';
      badge.textContent = 'READY';
    }

    openModal('meta-account-view-modal');
  },

  async checkMetaUidLiveFromView() {
    const uid = document.getElementById('view-acc-uid')?.textContent.trim();
    if (!uid || uid === '-') return;
    const badge = document.getElementById('view-acc-live-badge');
    if (badge) {
      badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      badge.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-1"></i> CHECKING...';
    }

    try {
      const res = await fetch('/api/meta/check_uid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid })
      });
      const data = await res.json();
      if (data.status === 'LIVE') {
        if (badge) {
          badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/40';
          badge.textContent = 'ACTIVE / LIVE ✔';
        }
        showToast(`✔ UID ${uid} is LIVE on Facebook!`);
      } else {
        if (badge) {
          badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40';
          badge.textContent = data.status || 'CHECKPOINT ✘';
        }
        showToast(`⚠ UID ${uid}: ${data.status}`);
      }
    } catch (err) {
      if (badge) {
        badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40';
        badge.textContent = 'ERROR';
      }
      showToast('Error checking status: ' + err.message);
    }
  },

  async checkMetaUidLive(uid, btn) {
    if (!uid || uid === '-') {
      showToast('Invalid UID');
      return;
    }
    const origHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-cyan-400"></i>';
    btn.disabled = true;

    try {
      const res = await fetch('/api/meta/check_uid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid })
      });
      const data = await res.json();
      if (data.status === 'LIVE') {
        showToast(`✔ UID ${uid} is LIVE! Profile active.`);
      } else {
        showToast(`⚠ UID ${uid} status: ${data.status}`);
      }
    } catch (err) {
      showToast('Check error: ' + err.message);
    } finally {
      btn.innerHTML = origHtml;
      btn.disabled = false;
    }
  },

  copyAllMetaCombos() {
    if (!this.metaAccounts || this.metaAccounts.length === 0) {
      showToast('No accounts to copy.');
      return;
    }
    const lines = this.metaAccounts.map(a => 
      `${a.uid || ''}|${a.password || ''}|${a.cookie || ''}|${a.number || ''}|${a.name || ''}|${a.created_at || ''}`
    ).join('\n');
    copyToClipboard(lines);
    showToast(`✔ Copied all ${this.metaAccounts.length} accounts to clipboard!`);
  },

  copyFromElement(elemId, successMsg = 'Copied!') {
    const el = document.getElementById(elemId);
    if (!el) return;
    const val = el.value !== undefined ? el.value : el.textContent;
    if (val && val !== '-') {
      copyToClipboard(val);
      showToast(`✔ ${successMsg}`);
    } else {
      showToast('No data to copy.');
    }
  },

  toggleMetaExportMenu(forceState) {
    const menu = document.getElementById('meta-export-dropdown');
    if (!menu) return;
    if (forceState !== undefined) {
      if (forceState) menu.classList.remove('hidden');
      else menu.classList.add('hidden');
    } else {
      menu.classList.toggle('hidden');
    }
  },

  async downloadMetaAccountsTxt() {
    try {
      const res = await fetch('/api/meta/accounts');
      const data = await res.json();
      if (!data.raw_txt && (!data.accounts || data.accounts.length === 0)) {
        showToast('No accounts found to export.');
        return;
      }
      let content = data.raw_txt;
      if (!content && data.accounts) {
        content = data.accounts.map(a => 
          `${a.uid || ''}|${a.password || ''}|${a.cookie || ''}|${a.number || ''}|${a.name || ''}|${a.created_at || ''}`
        ).join('\n');
      }
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `META_ACCOUNTS_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('✔ TXT export started!');
    } catch (err) {
      showToast('Export error: ' + err.message);
    }
  },

  downloadMetaAccountsJson() {
    if (!this.metaAccounts || this.metaAccounts.length === 0) {
      showToast('No accounts to export.');
      return;
    }
    const blob = new Blob([JSON.stringify(this.metaAccounts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `META_ACCOUNTS_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✔ JSON export started!');
  },

  downloadMetaAccountsCsv() {
    if (!this.metaAccounts || this.metaAccounts.length === 0) {
      showToast('No accounts to export.');
      return;
    }
    const escapeCsv = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
    const headers = ['UID', 'Name', 'Phone', 'Password', 'Cookie', 'CreatedAt'];
    const rows = this.metaAccounts.map(a => [
      escapeCsv(a.uid),
      escapeCsv(a.name),
      escapeCsv(a.number),
      escapeCsv(a.password),
      escapeCsv(a.cookie),
      escapeCsv(a.created_at)
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `META_ACCOUNTS_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✔ CSV export started!');
  },

  async saveMetaPassword() {
    const pwd = document.getElementById('meta-input-default-pwd')?.value.trim();
    if (!pwd) {
      showToast('Please enter a password!');
      return;
    }
    try {
      const res = await fetch('/api/meta/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      });
      const data = await res.json();
      if (data.success) {
        showToast('✔ Default creator password updated!');
        const statPwd = document.getElementById('meta-stat-password');
        if (statPwd) statPwd.textContent = pwd;
      } else {
        showToast('✘ ' + (data.error || 'Failed to save password'));
      }
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  },

  async saveMetaTelegram() {
    const token = document.getElementById('meta-tg-token')?.value.trim();
    const chatId = document.getElementById('meta-tg-chatid')?.value.trim();
    const enabled = document.getElementById('meta-tg-toggle')?.checked;

    try {
      const res = await fetch('/api/meta/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, chat_id: chatId, enabled })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Telegram settings saved successfully!');
        this.loadMetaStatus();
      } else {
        showToast(data.error || 'Failed to save settings');
      }
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  },

  async testMetaTelegram() {
    const token = document.getElementById('meta-tg-token')?.value.trim();
    const chatId = document.getElementById('meta-tg-chatid')?.value.trim();

    if (!token || !chatId) {
      showToast('Please enter both Bot Token and Chat ID!');
      return;
    }

    showToast('Sending test message to Telegram...');
    try {
      const res = await fetch('/api/meta/test_telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, chat_id: chatId })
      });
      const data = await res.json();
      if (data.success) {
        showToast('✔ Telegram alert sent successfully!');
      } else {
        showToast('✘ ' + (data.error || 'Failed to send alert'));
      }
    } catch (err) {
      showToast('Connection error: ' + err.message);
    }
  },

  copyMetaCookie(cookie) {
    if (!cookie) {
      showToast('No cookie data found.');
      return;
    }
    copyToClipboard(cookie);
    showToast('✔ Full Cookie copied to clipboard!');
  },

  copyMetaLaunchCmd() {
    copyToClipboard('cd ~/META-HORIZONE && ./meta.sh');
    showToast('✔ Launch command copied! Paste into Termux.');
  },

  // ========================================================
  // AUTO MAIL & OTP STUDIO ENGINE
  // ========================================================
  async loadMetaMailData() {
    this.refreshMetaMailBalance();
    this.loadMetaMailProducts();
    this.loadMetaMailHistory();
  },

  async refreshMetaMailBalance() {
    const balEl = document.getElementById('meta-mail-balance-badge');
    const emailEl = document.getElementById('meta-mail-user-email');
    if (balEl) balEl.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-amber-400"></i>';

    try {
      const res = await fetch('/api/meta/mail/config');
      const data = await res.json();
      if (data.success) {
        const bal = data.balance_info;
        if (balEl) {
          if (bal && bal.balance !== undefined) {
            this.lastHotmailBalance = parseFloat(bal.balance);
            balEl.textContent = `${bal.balance} ${bal.currency || 'BDT'}`;
          } else {
            balEl.textContent = 'Active (Connected)';
          }
        }
        if (emailEl && bal && bal.email) {
          emailEl.textContent = bal.email;
        }

        this.updateAffordability();

        const cfg = data.config || {};
        const hotmailInp = document.getElementById('meta-mail-cfg-hotmail');
        const defpidInp = document.getElementById('meta-mail-cfg-defpid');
        const timeoutInp = document.getElementById('meta-mail-cfg-timeout');

        if (hotmailInp && !hotmailInp.value) hotmailInp.value = cfg.hotmail_api_key || '';
        if (defpidInp && !defpidInp.value) defpidInp.value = cfg.default_product_id || 14;
        if (timeoutInp && !timeoutInp.value) timeoutInp.value = cfg.otp_timeout_sec || 60;
      }
    } catch (err) {
      if (balEl) balEl.textContent = 'Offline / Error';
      console.error('[Mail Balance Error]:', err);
    }
  },

  updateAffordability(balance) {
    const affordEl = document.getElementById('meta-mail-afford-badge');
    const customInp = document.getElementById('meta-mail-custom-pid');
    if (!affordEl) return;
    
    let price = 0.52;
    const pid = parseInt(customInp?.value || '14', 10);
    if (Array.isArray(this.metaMailProducts)) {
      const prod = this.metaMailProducts.find(p => p.id === pid);
      if (prod && prod.price) price = parseFloat(prod.price);
    }
    
    const bal = balance !== undefined ? balance : this.lastHotmailBalance;
    if (bal !== undefined && price > 0) {
      const count = Math.floor(bal / price);
      affordEl.textContent = `⚡ Can buy ~${count} account(s) (${price} BDT/ea)`;
    } else {
      affordEl.textContent = `⚡ High-speed auto creation ready`;
    }
  },

  async loadMetaMailProducts() {
    const select = document.getElementById('meta-mail-product-select');
    if (!select) return;

    try {
      const res = await fetch('/api/meta/mail/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        this.metaMailProducts = data.products;
        const curVal = select.value || document.getElementById('meta-mail-custom-pid')?.value || '4';
        select.innerHTML = '';

        const eduGroup = document.createElement('optgroup');
        eduGroup.label = '🎓 Edu Mail & Academic Domains';

        const hotmailGroup = document.createElement('optgroup');
        hotmailGroup.label = '📧 Hotmail & Outlook Fast (Recommended)';

        const countryGroup = document.createElement('optgroup');
        countryGroup.label = '🌐 Country Outlook Domains';

        const otherGroup = document.createElement('optgroup');
        otherGroup.label = '⚡ Other Services & Accounts';

        data.products.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.id;
          const stock = p.in_stock ? `✔ ${p.stock || 'In Stock'}` : '✖ Out of Stock';
          opt.textContent = `ID: ${p.id} | ${p.title} (${p.price} BDT) - ${stock}`;

          const titleLower = (p.title || '').toLowerCase();
          const catLower = (p.category?.name || '').toLowerCase();

          if (titleLower.includes('edu') || catLower.includes('edu') || titleLower.includes('domain')) {
            eduGroup.appendChild(opt);
          } else if (titleLower.startsWith('outlook.') || titleLower.startsWith('hotmail.')) {
            countryGroup.appendChild(opt);
          } else if (catLower.includes('hotmail') || titleLower.includes('outlook') || titleLower.includes('hotmail')) {
            hotmailGroup.appendChild(opt);
          } else {
            otherGroup.appendChild(opt);
          }
        });

        if (eduGroup.children.length > 0) select.appendChild(eduGroup);
        if (hotmailGroup.children.length > 0) select.appendChild(hotmailGroup);
        if (countryGroup.children.length > 0) select.appendChild(countryGroup);
        if (otherGroup.children.length > 0) select.appendChild(otherGroup);

        const customOpt = document.createElement('option');
        customOpt.value = 'custom';
        customOpt.textContent = '⚡ Enter Custom Product ID...';
        select.appendChild(customOpt);

        if (curVal && [...select.options].some(o => o.value == curVal)) {
          select.value = curVal;
        } else {
          select.value = '4';
        }
        this.updateAffordability();
      }
    } catch (err) {
      console.error('[Mail Products Error]:', err);
    }
  },

  onMetaMailProductSelectChange() {
    const select = document.getElementById('meta-mail-product-select');
    const customInp = document.getElementById('meta-mail-custom-pid');
    if (!select || !customInp) return;

    if (select.value === 'custom') {
      this.focusCustomPid();
    } else {
      customInp.value = select.value;
      this.highlightPresetCard(select.value);
    }
    this.updateAffordability();
  },

  toggleMetaMailSettingsModal(force) {
    const drawer = document.getElementById('meta-mail-settings-drawer');
    if (!drawer) return;
    if (typeof force === 'boolean') {
      if (force) drawer.classList.remove('hidden');
      else drawer.classList.add('hidden');
    } else {
      drawer.classList.toggle('hidden');
    }
  },

  async saveMetaMailConfig() {
    const hotmail_api_key = document.getElementById('meta-mail-cfg-hotmail')?.value.trim();
    const default_product_id = parseInt(document.getElementById('meta-mail-cfg-defpid')?.value || '14', 10);
    const otp_timeout_sec = parseInt(document.getElementById('meta-mail-cfg-timeout')?.value || '60', 10);

    try {
      const res = await fetch('/api/meta/mail/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotmail_api_key, default_product_id, otp_timeout_sec })
      });
      const data = await res.json();
      if (data.success) {
        showToast('✔ Mail & OTP API settings saved successfully!');
        this.toggleMetaMailSettingsModal(false);
        this.refreshMetaMailBalance();
      } else {
        showToast('✘ ' + (data.error || 'Failed to save config'));
      }
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  },

  appendMetaMailLog(msg, type = 'info') {
    const consoleEl = document.getElementById('meta-mail-console');
    if (!consoleEl) return;
    const time = new Date().toLocaleTimeString();
    const div = document.createElement('div');
    
    let colorClass = 'text-gray-300';
    if (type === 'success') colorClass = 'text-green-400 font-bold';
    else if (type === 'warn') colorClass = 'text-yellow-400';
    else if (type === 'error') colorClass = 'text-red-400 font-bold';
    else if (type === 'otp') colorClass = 'text-amber-300 font-black';

    div.className = `${colorClass} leading-relaxed`;
    div.innerHTML = `<span class="text-gray-500">[${time}]</span> ${escapeHtml(msg)}`;
    consoleEl.appendChild(div);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  },

  clearMetaMailLogs() {
    const consoleEl = document.getElementById('meta-mail-console');
    if (consoleEl) consoleEl.innerHTML = '<div class="text-gray-500">[System] Log cleared. Ready.</div>';
  },

  copyMetaMailLogs() {
    const consoleEl = document.getElementById('meta-mail-console');
    if (!consoleEl) return;
    copyToClipboard(consoleEl.innerText);
    showToast('✔ Console logs copied!');
  },

  setDomainPreset(pid) {
    const customInp = document.getElementById('meta-mail-custom-pid');
    const select = document.getElementById('meta-mail-product-select');
    if (customInp) customInp.value = pid;
    if (select) {
      if ([...select.options].some(o => o.value == pid)) {
        select.value = pid;
      } else {
        select.value = 'custom';
      }
    }
    this.highlightPresetCard(pid);
    this.updateAffordability();
    showToast(`✔ Selected Product ID: ${pid}`);
  },

  highlightPresetCard(pid) {
    document.querySelectorAll('.domain-preset-card').forEach(card => {
      const cardPid = card.getAttribute('data-pid');
      if (String(cardPid) === String(pid)) {
        card.classList.add('scale-[1.02]');
        if (cardPid == '124' || cardPid == '110' || cardPid == '84') {
          card.className = 'domain-preset-card p-2.5 rounded-xl bg-purple-500/25 border-2 border-purple-400 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer scale-[1.02] transition-all flex flex-col justify-between';
        } else if (cardPid == '4' || cardPid == '14') {
          card.className = 'domain-preset-card p-2.5 rounded-xl bg-amber-500/25 border-2 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer scale-[1.02] transition-all flex flex-col justify-between';
        } else if (cardPid == '6' || cardPid == '13') {
          card.className = 'domain-preset-card p-2.5 rounded-xl bg-red-500/25 border-2 border-red-400 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer scale-[1.02] transition-all flex flex-col justify-between';
        } else if (cardPid == '161' || cardPid == '5') {
          card.className = 'domain-preset-card p-2.5 rounded-xl bg-blue-500/25 border-2 border-blue-400 text-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.4)] cursor-pointer scale-[1.02] transition-all flex flex-col justify-between';
        } else {
          card.className = 'domain-preset-card p-2.5 rounded-xl bg-cyan-500/25 border-2 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer scale-[1.02] transition-all flex flex-col justify-between';
        }
      } else {
        card.className = 'domain-preset-card p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 cursor-pointer hover:border-white/30 hover:text-white hover:scale-[1.02] transition-all flex flex-col justify-between';
      }
    });
  },

  focusCustomPid() {
    const customInp = document.getElementById('meta-mail-custom-pid');
    const select = document.getElementById('meta-mail-product-select');
    if (select) select.value = 'custom';
    if (customInp) {
      customInp.focus();
      customInp.select();
    }
    this.highlightPresetCard('custom');
  },

  setMailQtyPreset(qty) {
    const el = document.getElementById('meta-mail-quantity');
    if (el) {
      el.value = qty;
      this.updateAffordability();
    }
    document.querySelectorAll('.qty-preset-box').forEach(btn => {
      if (btn.getAttribute('data-qty') == qty) {
        btn.className = 'qty-preset-box py-2 rounded-xl bg-cyan-500/30 border-2 border-cyan-400 text-cyan-200 font-black text-xs shadow-[0_0_12px_rgba(6,182,212,0.5)] scale-105 transition-all';
      } else {
        btn.className = 'qty-preset-box py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-black text-xs hover:border-cyan-400 hover:text-cyan-300 transition-all';
      }
    });
  },

  setServicePreset(svc) {
    const targetEl = document.getElementById('meta-mail-target-service');
    if (targetEl) targetEl.value = svc;
    document.querySelectorAll('.svc-preset-pill').forEach(btn => {
      if (btn.getAttribute('data-svc') === svc) {
        btn.className = 'svc-preset-pill py-2 px-1 rounded-xl bg-emerald-500/30 border-2 border-emerald-400 text-emerald-200 font-bold text-[11px] shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all';
      } else {
        btn.className = 'svc-preset-pill py-2 px-1 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold text-[11px] hover:border-emerald-400 hover:text-emerald-300 transition-all';
      }
    });
    showToast(`✔ Target Service: ${svc.toUpperCase()}`);
  },

  setQueueDelay(val) {
    this.queueDelaySec = val === 'manual' ? 'manual' : parseInt(val, 10) || 4;
    showToast(`✔ Advance delay set to: ${val === 'manual' ? 'Manual' : val + 's'}`);
  },

  toggleQueuePause() {
    if (!this.isQueueRunning) return;
    this.isQueuePaused = !this.isQueuePaused;
    const btn = document.getElementById('meta-queue-btn-pause');
    const pulse = document.getElementById('meta-queue-status-pulse');
    if (this.isQueuePaused) {
      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
        btn.className = 'btn-cyber text-[11px] py-1 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-1';
      }
      if (pulse) {
        pulse.className = 'px-2.5 py-1 rounded-md bg-yellow-500 text-black font-black text-[10px] tracking-wider uppercase inline-flex items-center gap-1.5';
        pulse.innerHTML = '<i class="fa-solid fa-pause"></i> QUEUE PAUSED';
      }
      this.appendMetaMailLog('[Queue Paused] Auto pipeline paused by user.', 'warn');
      showToast('⏸ Pipeline Paused');
    } else {
      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        btn.className = 'btn-cyber text-[11px] py-1 px-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold flex items-center gap-1';
      }
      if (pulse) {
        pulse.className = 'px-2.5 py-1 rounded-md bg-amber-500 text-black font-black text-[10px] tracking-wider uppercase shadow-[0_0_12px_rgba(245,158,11,0.8)] inline-flex items-center gap-1.5 animate-pulse';
        pulse.innerHTML = '<i class="fa-solid fa-bolt"></i> QUEUE RUNNER ACTIVE';
      }
      this.appendMetaMailLog('[Queue Resumed] Auto pipeline resumed.', 'info');
      showToast('▶ Pipeline Resumed');
    }
  },

  skipQueueCurrent() {
    if (!this.isQueueRunning || !this.mailQueue || this.mailQueue.length === 0) return;
    const current = this.mailQueue[this.queueCurrentIndex];
    if (current) {
      current.status = 'SKIPPED';
      this.appendMetaMailLog(`[Queue Skip] Skipped account: ${current.email}`, 'warn');
    }
    clearInterval(this.queuePropagationTimer);
    clearInterval(this.queuePollTimer);
    clearInterval(this.queueAdvanceCountdownTimer);
    this.advanceQueueNextImmediately();
  },

  stopQueueEngine() {
    clearInterval(this.queuePropagationTimer);
    clearInterval(this.queuePollTimer);
    clearInterval(this.queueAdvanceCountdownTimer);
    this.isQueueRunning = false;
    this.isQueuePaused = false;
    this.isMailGenerating = false;

    const pipelineBtn = document.getElementById('meta-mail-btn-pipeline');
    if (pipelineBtn) {
      pipelineBtn.disabled = false;
      pipelineBtn.innerHTML = '<i class="fa-solid fa-bolt-lightning text-sm animate-bounce text-black"></i> <span>START AUTO QUEUE PIPELINE (1-BY-1 CYCLE)</span>';
      pipelineBtn.classList.remove('opacity-80', 'opacity-60', 'cursor-not-allowed');
    }

    const pulse = document.getElementById('meta-queue-status-pulse');
    if (pulse) {
      pulse.className = 'px-2.5 py-1 rounded-md bg-red-500 text-white font-black text-[10px] tracking-wider uppercase inline-flex items-center gap-1.5';
      pulse.innerHTML = '<i class="fa-solid fa-stop"></i> QUEUE STOPPED';
    }
    const slotStatus = document.getElementById('meta-queue-slot-status');
    if (slotStatus) {
      slotStatus.textContent = 'Engine Stopped';
      slotStatus.className = 'text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-red-500/20 text-red-300 border border-red-400/30';
    }
    this.appendMetaMailLog('[Queue Stopped] Auto pipeline stopped by user.', 'error');
    showToast('⏹ Queue Runner Stopped');
  },

  advanceQueueNextImmediately() {
    clearInterval(this.queueAdvanceCountdownTimer);
    clearInterval(this.queuePollTimer);
    clearInterval(this.queuePropagationTimer);

    const advanceStrip = document.getElementById('meta-queue-advance-strip');
    if (advanceStrip) advanceStrip.classList.add('hidden');

    this.clearStudioSlotForTransition();

    this.queueCurrentIndex++;
    if (this.queueCurrentIndex < this.mailQueue.length) {
      this.processQueueCurrent();
    } else {
      this.finishQueuePipeline();
    }
  },

  clearStudioSlotForTransition() {
    const manualInput = document.getElementById('meta-mail-manual-uid');
    if (manualInput) {
      manualInput.value = '';
      this.onManualInputChanged('');
    }
    const slotOtp = document.getElementById('meta-queue-slot-otp');
    if (slotOtp) {
      slotOtp.textContent = 'WAITING...';
      slotOtp.className = 'text-xl font-black text-amber-300 font-mono tracking-widest select-all animate-pulse drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]';
    }
    const manualResult = document.getElementById('meta-mail-manual-result');
    if (manualResult) {
      manualResult.innerHTML = '<span class="text-gray-400 font-mono text-xs">Loading next queued mail...</span>';
    }
  },

  async queuePendingFromVault() {
    if (this.isQueueRunning) {
      showToast('Queue pipeline is already running.');
      return;
    }
    const pending = (this.metaMailHistory || []).filter(h => !h.last_otp || h.last_otp === 'WAITING' || h.last_otp === 'Waiting');
    if (pending.length === 0) {
      showToast('No pending/unverified accounts in Vault.');
      return;
    }

    this.mailQueue = pending.map((m, idx) => ({
      ...m,
      queueIndex: idx,
      status: 'PENDING'
    }));
    this.queueCurrentIndex = 0;
    this.isQueueRunning = true;
    this.isQueuePaused = false;

    const queueCard = document.getElementById('meta-mail-queue-card');
    if (queueCard) queueCard.classList.remove('hidden');

    this.appendMetaMailLog(`[Queue Vault] Loaded ${pending.length} pending account(s) from Vault into 1-by-1 runner!`, 'info');
    showToast(`⚡ Loaded ${pending.length} account(s) from Vault into Queue!`);
    this.processQueueCurrent();
  },

  async startAutoQueuePipeline() {
    if (this.isQueueRunning || this.isMailGenerating) {
      showToast('Queue or generation already running.');
      return;
    }

    const pidVal = document.getElementById('meta-mail-custom-pid')?.value.trim() || '4';
    const quantity = parseInt(document.getElementById('meta-mail-quantity')?.value || '1', 10);
    const autoSave = document.getElementById('meta-mail-autosave-toggle')?.checked !== false;
    const autoCopy = document.getElementById('meta-mail-autocopy-toggle')?.checked !== false;

    this.queueAutoCopy = autoCopy;
    this.queueAutoSave = autoSave;

    const pipelineBtn = document.getElementById('meta-mail-btn-pipeline');
    if (pipelineBtn) {
      pipelineBtn.disabled = true;
      pipelineBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-sm text-black"></i> <span>ORDERING ${quantity} MAIL(S)...</span>`;
      pipelineBtn.classList.add('opacity-80', 'cursor-not-allowed');
    }

    const queueCard = document.getElementById('meta-mail-queue-card');
    if (queueCard) queueCard.classList.remove('hidden');

    const totalCountEl = document.getElementById('meta-queue-total-count');
    const curIdxEl = document.getElementById('meta-queue-current-idx');
    const compCountEl = document.getElementById('meta-queue-completed-count');
    const pendCountEl = document.getElementById('meta-queue-pending-count');
    const slotStatus = document.getElementById('meta-queue-slot-status');
    const progressLabel = document.getElementById('meta-queue-progress-label');
    const progressBar = document.getElementById('meta-queue-progress-bar');
    const progressPct = document.getElementById('meta-queue-progress-pct');
    const pulse = document.getElementById('meta-queue-status-pulse');

    if (totalCountEl) totalCountEl.textContent = quantity;
    if (curIdxEl) curIdxEl.textContent = '1';
    if (compCountEl) compCountEl.textContent = '0';
    if (pendCountEl) pendCountEl.textContent = quantity;
    if (progressBar) progressBar.style.width = '10%';
    if (progressPct) progressPct.textContent = '10%';
    if (progressLabel) progressLabel.textContent = `Ordering ${quantity} mail(s) from Hotmail143...`;
    if (slotStatus) slotStatus.textContent = 'Ordering Mails...';
    if (pulse) {
      pulse.className = 'px-2.5 py-1 rounded-md bg-amber-500 text-black font-black text-[10px] tracking-wider uppercase shadow-[0_0_12px_rgba(245,158,11,0.8)] inline-flex items-center gap-1.5 animate-pulse';
      pulse.innerHTML = '<i class="fa-solid fa-bolt"></i> ORDERING MAILS...';
    }

    this.appendMetaMailLog(`[Hotmail143 Bulk Order] Requesting ${quantity} mail(s) (Product ID: ${pidVal})...`, 'info');

    try {
      this.isMailGenerating = true;
      const res = await fetch('/api/meta/mail/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: pidVal,
          quantity: quantity,
          auto_save_to_meta: autoSave
        })
      });
      const data = await res.json();
      this.isMailGenerating = false;

      if (!data.success) {
        if (queueCard) queueCard.classList.add('hidden');
        if (pipelineBtn) {
          pipelineBtn.disabled = false;
          pipelineBtn.innerHTML = '<i class="fa-solid fa-bolt-lightning text-sm animate-bounce text-black"></i> <span>START AUTO QUEUE PIPELINE (1-BY-1 CYCLE)</span>';
          pipelineBtn.classList.remove('opacity-80', 'cursor-not-allowed');
        }
        this.appendMetaMailLog(`[Order Error]: ${data.error}`, 'error');
        showToast('✘ Order failed: ' + (data.error || 'Unknown error'));
        return;
      }

      const accounts = data.accounts || (data.first_account ? [data.first_account] : []);
      if (accounts.length === 0) {
        if (queueCard) queueCard.classList.add('hidden');
        if (pipelineBtn) {
          pipelineBtn.disabled = false;
          pipelineBtn.innerHTML = '<i class="fa-solid fa-bolt-lightning text-sm animate-bounce text-black"></i> <span>START AUTO QUEUE PIPELINE (1-BY-1 CYCLE)</span>';
          pipelineBtn.classList.remove('opacity-80', 'cursor-not-allowed');
        }
        showToast('✘ No accounts returned from Hotmail143.');
        return;
      }

      this.mailQueue = accounts.map((a, idx) => ({
        ...a,
        queueIndex: idx,
        status: 'PENDING'
      }));

      this.queueCurrentIndex = 0;
      this.isQueueRunning = true;
      this.isQueuePaused = false;

      if (pipelineBtn) {
        pipelineBtn.innerHTML = '<i class="fa-solid fa-circle-play text-sm text-black animate-pulse"></i> <span>1-BY-1 AUTO PIPELINE RUNNING...</span>';
      }

      if (pulse) {
        pulse.innerHTML = '<i class="fa-solid fa-bolt"></i> QUEUE RUNNER ACTIVE';
      }

      this.refreshMetaMailBalance();
      this.loadMetaMailHistory();
      if (autoSave) this.loadMetaStatus();

      this.appendMetaMailLog(`[✔ Bulk Order Success] ${accounts.length} mail(s) acquired! Starting 1-by-1 Auto OTP Cycle...`, 'success');
      showToast(`✔ ${accounts.length} Mails Acquired! Pipeline Starting...`);

      // Start processing first queue item
      this.processQueueCurrent();

    } catch (err) {
      this.isMailGenerating = false;
      this.isQueueRunning = false;
      if (queueCard) queueCard.classList.add('hidden');
      if (pipelineBtn) {
        pipelineBtn.disabled = false;
        pipelineBtn.innerHTML = '<i class="fa-solid fa-bolt-lightning text-sm animate-bounce text-black"></i> <span>START AUTO QUEUE PIPELINE (1-BY-1 CYCLE)</span>';
        pipelineBtn.classList.remove('opacity-80', 'cursor-not-allowed');
      }
      this.appendMetaMailLog(`[Order Exception]: ${err.message}`, 'error');
      showToast('Error ordering mails: ' + err.message);
    }
  },

  startAutoMailCreation() {
    return this.startAutoQueuePipeline();
  },

  async buyMetaMailOnly() {
    const pidVal = document.getElementById('meta-mail-custom-pid')?.value.trim() || '14';
    const quantity = parseInt(document.getElementById('meta-mail-quantity')?.value || '1', 10);
    const autoSave = document.getElementById('meta-mail-autosave-toggle')?.checked !== false;

    showToast(`Ordering ${quantity} mail(s) from Hotmail143...`);
    this.appendMetaMailLog(`[Hotmail143 Bulk] Purchasing ${quantity} mail combo(s)...`, 'info');

    try {
      const res = await fetch('/api/meta/mail/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: pidVal,
          quantity: quantity,
          auto_save_to_meta: autoSave
        })
      });
      const data = await res.json();
      if (!data.success) {
        showToast('✘ Order failed: ' + (data.error || 'Unknown error'));
        this.appendMetaMailLog(`[Order Error]: ${data.error}`, 'error');
        return;
      }
      const accounts = data.accounts || (data.first_account ? [data.first_account] : []);
      this.refreshMetaMailBalance();
      this.loadMetaMailHistory();
      if (data.first_account) {
        this.activeSpotlightMail = data.first_account;
        this.renderSpotlightAccount(data.first_account);
      }
      this.appendMetaMailLog(`[✔ Bulk Buy Success] Acquired ${accounts.length} mail combo(s)! Added to Vault.`, 'success');
      showToast(`✔ Successfully purchased ${accounts.length} mail combo(s)!`);
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  },

  processQueueCurrent() {
    if (!this.isQueueRunning) return;
    if (this.queueCurrentIndex >= this.mailQueue.length) {
      this.finishQueuePipeline();
      return;
    }

    const acc = this.mailQueue[this.queueCurrentIndex];
    const total = this.mailQueue.length;
    const curNum = this.queueCurrentIndex + 1;
    const serviceType = document.getElementById('meta-mail-target-service')?.value || 'facebook';

    // Metrics & Progress
    const totalCountEl = document.getElementById('meta-queue-total-count');
    const curIdxEl = document.getElementById('meta-queue-current-idx');
    const compCountEl = document.getElementById('meta-queue-completed-count');
    const pendCountEl = document.getElementById('meta-queue-pending-count');
    const slotStatus = document.getElementById('meta-queue-slot-status');
    const progressLabel = document.getElementById('meta-queue-progress-label');
    const progressBar = document.getElementById('meta-queue-progress-bar');
    const progressPct = document.getElementById('meta-queue-progress-pct');
    const slotEmail = document.getElementById('meta-queue-slot-email');
    const slotPass = document.getElementById('meta-queue-slot-pass');
    const slotOtp = document.getElementById('meta-queue-slot-otp');
    const slotApi = document.getElementById('meta-queue-slot-api');
    const advanceStrip = document.getElementById('meta-queue-advance-strip');

    if (advanceStrip) advanceStrip.classList.add('hidden');
    if (totalCountEl) totalCountEl.textContent = total;
    if (curIdxEl) curIdxEl.textContent = curNum;
    if (compCountEl) compCountEl.textContent = this.mailQueue.filter(m => m.status === 'COMPLETED').length;
    if (pendCountEl) pendCountEl.textContent = this.mailQueue.filter(m => m.status === 'PENDING').length;

    const pct = Math.round((this.queueCurrentIndex / total) * 100);
    if (progressBar) progressBar.style.width = `${Math.max(15, pct)}%`;
    if (progressPct) progressPct.textContent = `${pct}%`;
    if (progressLabel) progressLabel.textContent = `Processing account ${curNum} of ${total} (${acc.email})...`;

    // Active Slot fields
    if (slotEmail) slotEmail.textContent = acc.email || '-';
    if (slotPass) slotPass.textContent = acc.password || '-';
    if (slotApi) slotApi.textContent = `lookup?email=${acc.email}`;
    if (slotOtp) {
      slotOtp.textContent = 'WAITING...';
      slotOtp.className = 'text-xl font-black text-amber-300 font-mono tracking-widest select-all animate-pulse drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]';
    }
    if (slotStatus) {
      slotStatus.textContent = '⏳ Propagating (20s)';
      slotStatus.className = 'text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30';
    }

    // ========================================================
    // AUTO SUBMIT INTO HOTMAIL143 LIVE OTP STUDIO
    // ========================================================
    const combo = acc.raw_account || `${acc.email}|${acc.password}|${acc.refresh_token || ''}|${acc.client_id || ''}`;
    const manualInput = document.getElementById('meta-mail-manual-uid');
    if (manualInput) {
      manualInput.value = combo;
      manualInput.classList.add('ring-2', 'ring-amber-400');
      this.onManualInputChanged(combo);
    }

    const manualResult = document.getElementById('meta-mail-manual-result');
    if (manualResult) {
      manualResult.innerHTML = `
        <div class="space-y-1.5 text-center py-1 w-full">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
            <i class="fa-solid fa-satellite-dish animate-pulse"></i> Queue #${curNum}/${total}: ${escapeHtml(acc.email)}
          </div>
          <span class="text-cyan-300 font-mono font-bold block text-xs">
            Auto-submitted to Hotmail143 Studio! Waiting 20s propagation...
          </span>
        </div>
      `;
    }

    this.activeSpotlightMail = acc;
    this.renderSpotlightAccount(acc);
    this.renderQueueVisualizer();

    // Auto-Copy Credentials if enabled
    if (this.queueAutoCopy) {
      copyToClipboard(`${acc.email} | ${acc.password}`);
      showToast(`✔ [Queue #${curNum}] Credentials auto-copied!`);
    }

    this.appendMetaMailLog(`[Queue #${curNum}/${total}] Auto-submitted: ${acc.email} | Pass: ${acc.password} to Hotmail143 Studio`, 'info');

    // Fast 3-second preparation & listen
    let prepSeconds = 3;
    if (slotStatus) {
      slotStatus.textContent = `⏳ Listening (${prepSeconds}s)`;
      slotStatus.className = 'text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30';
    }
    clearInterval(this.queuePropagationTimer);
    this.queuePropagationTimer = setInterval(() => {
      if (this.isQueuePaused) return;
      prepSeconds--;
      if (slotStatus) slotStatus.textContent = `⏳ Listening (${prepSeconds}s)`;
      if (prepSeconds <= 0) {
        clearInterval(this.queuePropagationTimer);
        this.runQueueOtpPolling(acc, curNum, total, serviceType);
      }
    }, 1000);
  },

  runQueueOtpPolling(acc, curNum, total, serviceType) {
    if (!this.isQueueRunning) return;

    const slotStatus = document.getElementById('meta-queue-slot-status');
    const slotOtp = document.getElementById('meta-queue-slot-otp');
    const advanceStrip = document.getElementById('meta-queue-advance-strip');
    const advanceCountdown = document.getElementById('meta-queue-advance-countdown');
    const manualResult = document.getElementById('meta-mail-manual-result');

    if (slotStatus) {
      slotStatus.textContent = '🔍 Polling Hotmail143...';
      slotStatus.className = 'text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30';
    }

    this.appendMetaMailLog(`[Queue #${curNum}] Querying /api/v1/otp-orders/lookup for ${acc.email}...`, 'info');

    let pollCount = 0;
    const maxPolls = 35;

    clearInterval(this.queuePollTimer);
    this.queuePollTimer = setInterval(async () => {
      if (this.isQueuePaused) return;
      pollCount++;

      try {
        const res = await fetch('/api/meta/mail/otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: acc.email,
            refresh_token: acc.refresh_token || '',
            client_id: acc.client_id || '',
            raw_account: acc.raw_account || '',
            password: acc.password || '',
            type: serviceType
          })
        });
        const data = await res.json();

        if (data.success && data.found) {
          clearInterval(this.queuePollTimer);
          const otpCode = data.otp || data.code || 'RECEIVED';
          acc.last_otp = otpCode;
          acc.status = 'COMPLETED';

          this.playCyberBeep('success');
          this.appendMetaMailLog(`[✔ Queue #${curNum} SUCCESS] OTP: ${otpCode} for ${acc.email}!`, 'otp');
          showToast(`⚡ Queue #${curNum} OTP: ${otpCode}`);

          if (slotOtp) {
            slotOtp.textContent = otpCode;
            slotOtp.className = 'text-2xl font-black text-emerald-400 font-mono tracking-widest select-all animate-bounce drop-shadow-[0_0_15px_rgba(16,185,129,0.9)]';
          }
          if (slotStatus) {
            slotStatus.textContent = '✔ OTP DELIVERED';
            slotStatus.className = 'text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40';
          }

          // Update Spotlight & Manual Result
          const spotlightOtp = document.getElementById('meta-mail-spotlight-otp');
          if (spotlightOtp) {
            spotlightOtp.textContent = otpCode;
            spotlightOtp.className = 'text-xl sm:text-2xl font-black text-emerald-400 tracking-widest select-all animate-bounce drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] font-mono';
          }

          if (manualResult) {
            manualResult.innerHTML = `
              <div class="text-left w-full space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-gray-400">Queue #${curNum}: <strong class="text-cyan-300 font-mono">${escapeHtml(acc.email)}</strong></span>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-bold">
                    HOTMAIL143: COMPLETED
                  </span>
                </div>
                <div class="p-2 rounded-xl bg-gradient-to-r from-emerald-950/80 via-black to-teal-950/80 border-2 border-emerald-400 text-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <span class="text-2xl font-black text-emerald-300 font-mono select-all tracking-widest">${escapeHtml(otpCode)}</span>
                </div>
              </div>
            `;
          }

          if (this.queueAutoCopy) {
            copyToClipboard(otpCode);
            showToast(`✔ OTP Code ${otpCode} copied!`);
          }

          this.loadMetaMailHistory();
          this.renderQueueVisualizer();

          // ========================================================
          // AUTO REMOVE & ADVANCE TO NEXT QUEUED MAIL
          // ========================================================
          const delayVal = this.queueDelaySec;
          if (delayVal === 'manual') {
            if (advanceStrip) advanceStrip.classList.remove('hidden');
            if (advanceCountdown) advanceCountdown.textContent = 'Manual';
          } else {
            let delayRemaining = parseInt(delayVal, 10) || 2;
            if (advanceStrip) advanceStrip.classList.remove('hidden');
            if (advanceCountdown) advanceCountdown.textContent = delayRemaining;

            clearInterval(this.queueAdvanceCountdownTimer);
            this.queueAdvanceCountdownTimer = setInterval(() => {
              if (this.isQueuePaused) return;
              delayRemaining--;
              if (advanceCountdown) advanceCountdown.textContent = delayRemaining;
              if (delayRemaining <= 0) {
                clearInterval(this.queueAdvanceCountdownTimer);
                this.advanceQueueNextImmediately();
              }
            }, 1000);
          }
          return;
        }

        // Still waiting
        const curStatus = data.status ? ` [${data.status}]` : '';
        if (slotStatus) slotStatus.textContent = `Polling #${pollCount} ${curStatus}`;
        if (manualResult) {
          manualResult.innerHTML = `
            <div class="space-y-1 text-center py-1 w-full">
              <span class="text-amber-300 font-mono text-xs block">
                <i class="fa-solid fa-spinner fa-spin mr-1"></i> Hotmail143 Polling #${pollCount}/${maxPolls} for ${escapeHtml(acc.email)}${curStatus}
              </span>
            </div>
          `;
        }

        if (pollCount >= maxPolls) {
          clearInterval(this.queuePollTimer);
          acc.status = 'TIMEOUT';
          this.appendMetaMailLog(`[Queue #${curNum} Timeout] OTP window reached for ${acc.email}. Advancing to next...`, 'warn');
          if (slotStatus) {
            slotStatus.textContent = 'Timed Out';
            slotStatus.className = 'text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-400/40';
          }
          this.renderQueueVisualizer();

          // Auto advance after short notice
          setTimeout(() => {
            this.advanceQueueNextImmediately();
          }, 2500);
        }

      } catch (err) {
        console.error('[Queue Poll Exception]:', err);
      }
    }, 3000);
  },

  renderQueueVisualizer() {
    const listEl = document.getElementById('meta-queue-visualizer-list');
    if (!listEl) return;

    listEl.innerHTML = (this.mailQueue || []).map((acc, idx) => {
      const isCur = idx === this.queueCurrentIndex && this.isQueueRunning;
      const isDone = acc.status === 'COMPLETED' || Boolean(acc.last_otp);
      const isTimeout = acc.status === 'TIMEOUT' || acc.status === 'SKIPPED';

      let borderClass = 'border-white/10 bg-black/40 text-gray-400';
      let icon = '<i class="fa-solid fa-clock text-gray-500 text-[10px]"></i>';
      let badge = `<span class="text-[9px] text-gray-500">Queued</span>`;

      if (isCur) {
        borderClass = 'border-amber-400/80 bg-amber-500/15 text-amber-200 ring-1 ring-amber-400';
        icon = '<i class="fa-solid fa-bolt text-amber-400 text-[10px] animate-bounce"></i>';
        badge = `<span class="text-[9px] text-amber-300 font-bold">Active</span>`;
      } else if (isDone) {
        borderClass = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
        icon = '<i class="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i>';
        badge = `<span class="text-[9px] text-emerald-300 font-black font-mono">${escapeHtml(acc.last_otp || 'DONE')}</span>`;
      } else if (isTimeout) {
        borderClass = 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300';
        icon = '<i class="fa-solid fa-triangle-exclamation text-yellow-400 text-[10px]"></i>';
        badge = `<span class="text-[9px] text-yellow-300">Skipped</span>`;
      }

      return `
        <div class="shrink-0 p-2 rounded-xl border ${borderClass} flex items-center gap-2 min-w-[170px] select-all cursor-pointer transition-all hover:scale-[1.02]" onclick="BuiltinTools.jumpToQueueItem(${idx})">
          ${icon}
          <div class="overflow-hidden">
            <div class="font-bold text-[10px] truncate max-w-[110px]">${escapeHtml(acc.email)}</div>
            <div class="flex items-center gap-1.5">${badge}</div>
          </div>
        </div>
      `;
    }).join('');
  },

  jumpToQueueItem(idx) {
    if (!this.mailQueue || !this.mailQueue[idx]) return;
    const acc = this.mailQueue[idx];
    this.activeSpotlightMail = acc;
    this.renderSpotlightAccount(acc);
    showToast(`Focused on Queue #${idx + 1}: ${acc.email}`);
  },

  finishQueuePipeline() {
    this.isQueueRunning = false;
    this.isQueuePaused = false;
    clearInterval(this.queuePropagationTimer);
    clearInterval(this.queuePollTimer);
    clearInterval(this.queueAdvanceCountdownTimer);

    const pipelineBtn = document.getElementById('meta-mail-btn-pipeline');
    if (pipelineBtn) {
      pipelineBtn.disabled = false;
      pipelineBtn.innerHTML = '<i class="fa-solid fa-bolt-lightning text-sm animate-bounce text-black"></i> <span>START AUTO QUEUE PIPELINE (1-BY-1 CYCLE)</span>';
      pipelineBtn.classList.remove('opacity-80', 'opacity-60', 'cursor-not-allowed');
    }

    const pulse = document.getElementById('meta-queue-status-pulse');
    const slotStatus = document.getElementById('meta-queue-slot-status');
    const progressBar = document.getElementById('meta-queue-progress-bar');
    const progressPct = document.getElementById('meta-queue-progress-pct');
    const progressLabel = document.getElementById('meta-queue-progress-label');

    if (pulse) {
      pulse.className = 'px-2.5 py-1 rounded-md bg-emerald-500 text-black font-black text-[10px] tracking-wider uppercase shadow-[0_0_15px_rgba(16,185,129,0.8)] inline-flex items-center gap-1.5';
      pulse.innerHTML = '<i class="fa-solid fa-circle-check"></i> ALL MAILS COMPLETED!';
    }
    if (slotStatus) {
      slotStatus.textContent = '🎉 Pipeline Finished';
      slotStatus.className = 'text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40';
    }
    if (progressBar) progressBar.style.width = '100%';
    if (progressPct) progressPct.textContent = '100%';
    if (progressLabel) progressLabel.textContent = `All ${this.mailQueue.length} accounts processed successfully!`;

    this.playCyberBeep('success');
    this.appendMetaMailLog(`[🎉 QUEUE COMPLETE] All ${this.mailQueue.length} accounts finished in Hotmail143 Auto Pipeline!`, 'success');
    showToast(`🎉 Queue Complete! All ${this.mailQueue.length} accounts processed!`);

    this.renderQueueVisualizer();
    this.loadMetaMailHistory();
  },

  runOtpPollingLoop(accountObj, serviceType = 'facebook') {
    const email = typeof accountObj === 'string' ? accountObj : (accountObj?.email || '');
    const refreshToken = typeof accountObj === 'object' ? (accountObj?.refresh_token || '') : '';
    const clientId = typeof accountObj === 'object' ? (accountObj?.client_id || '') : '';
    const rawAccount = typeof accountObj === 'object' ? (accountObj?.raw_account || '') : '';
    const password = typeof accountObj === 'object' ? (accountObj?.password || '') : '';

    const progressBar = document.getElementById('meta-mail-progress-bar');
    const progressTitle = document.getElementById('meta-mail-progress-title');
    const progressBadge = document.getElementById('meta-mail-progress-badge');
    const progressDesc = document.getElementById('meta-mail-progress-step-desc');
    const progressCard = document.getElementById('meta-mail-progress-card');

    if (progressBar) progressBar.style.width = '75%';
    if (progressTitle) progressTitle.textContent = 'Listening for Live OTP Code...';
    if (progressBadge) progressBadge.textContent = 'STEP 3/3';
    if (progressDesc) progressDesc.textContent = `Querying Hotmail143 /otp-orders/lookup for ${email}...`;

    this.appendMetaMailLog(`[Hotmail143 OTP Engine] Querying /api/v1/otp-orders/lookup for ${email}...`, 'info');

    let pollCount = 0;
    const maxPolls = 15;

    clearInterval(this.mailOtpPollTimer);
    this.mailOtpPollTimer = setInterval(async () => {
      pollCount++;
      try {
        const res = await fetch('/api/meta/mail/otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            refresh_token: refreshToken,
            client_id: clientId,
            raw_account: rawAccount,
            password: password,
            type: serviceType
          })
        });
        const data = await res.json();

        if (data.success && data.found) {
          clearInterval(this.mailOtpPollTimer);
          this.isMailGenerating = false;
          if (progressBar) progressBar.style.width = '100%';
          if (progressTitle) progressTitle.textContent = 'OTP Received Successfully!';
          if (progressDesc) progressDesc.textContent = `Extracted Code: ${data.otp || data.code || 'OTP Received'}`;
          
          const otpCode = data.otp || data.code || 'RECEIVED';
          this.playCyberBeep('success');
          this.appendMetaMailLog(`[✔ OTP MATCH] Code: ${otpCode} for ${email}! Ready for Meta AI!`, 'otp');
          showToast(`⚡ Meta OTP Code: ${otpCode}`);

          if (this.activeSpotlightMail && this.activeSpotlightMail.email === email) {
            this.activeSpotlightMail.last_otp = otpCode;
          }

          const spotlightOtp = document.getElementById('meta-mail-spotlight-otp');
          if (spotlightOtp) {
            spotlightOtp.textContent = otpCode;
            spotlightOtp.className = 'text-xl sm:text-2xl font-black text-emerald-400 tracking-widest select-all animate-bounce drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] font-mono';
          }

          setTimeout(() => {
            if (progressCard) progressCard.classList.add('hidden');
          }, 3500);

          this.loadMetaMailHistory();
          return;
        }

        const currentStatus = data.status ? ` [Status: ${data.status}]` : '';
        this.appendMetaMailLog(`[Poll ${pollCount}/${maxPolls}] Querying Hotmail143 lookup for ${email}${currentStatus}...`, 'info');

        if (pollCount >= maxPolls) {
          clearInterval(this.mailOtpPollTimer);
          this.isMailGenerating = false;
          if (progressCard) progressCard.classList.add('hidden');
          this.appendMetaMailLog(`[Notice] Polling window ended. Click 'Check OTP' button on account when ready.`, 'warn');
          showToast('OTP waiting period complete. You can re-check anytime.');
        }

      } catch (err) {
        console.error('[OTP Poll Error]:', err);
      }
    }, 4000);
  },

  renderSpotlightAccount(acc) {
    const card = document.getElementById('meta-mail-spotlight-card');
    const emailEl = document.getElementById('meta-mail-spotlight-email');
    const pwdEl = document.getElementById('meta-mail-spotlight-password');
    const otpEl = document.getElementById('meta-mail-spotlight-otp');
    const tokenEl = document.getElementById('meta-mail-spotlight-token');
    const tokenRawEl = document.getElementById('meta-mail-spotlight-token-raw');
    const cidEl = document.getElementById('meta-mail-spotlight-clientid');
    const comboEl = document.getElementById('meta-mail-spotlight-combo');

    if (!acc || !card) return;
    card.classList.remove('hidden');

    if (emailEl) emailEl.textContent = acc.email || '-';
    if (pwdEl) pwdEl.textContent = acc.password || '-';
    if (otpEl) {
      otpEl.textContent = acc.last_otp || 'WAITING...';
      otpEl.className = acc.last_otp 
        ? 'text-xl sm:text-2xl font-black text-emerald-400 tracking-widest select-all drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] font-mono'
        : 'text-lg sm:text-xl font-black text-amber-300 tracking-widest select-all animate-pulse font-mono';
    }

    const tokenStr = acc.refresh_token || '';
    if (tokenRawEl) tokenRawEl.value = tokenStr;
    if (tokenEl) {
      tokenEl.textContent = tokenStr ? (tokenStr.substring(0, 16) + '••••••••') : 'Standard Token';
      tokenEl.dataset.full = tokenStr;
      tokenEl.dataset.masked = 'true';
    }

    if (cidEl) {
      cidEl.textContent = acc.client_id ? `CID: ${acc.client_id.substring(0, 16)}...` : 'CID: 9e5f94bc-e8a4-4e73...';
    }

    if (comboEl) {
      comboEl.textContent = acc.raw_account || `${acc.email}|${acc.password}|${tokenStr}|${acc.client_id || ''}`;
    }
  },

  toggleSpotlightTokenVisibility() {
    const tokenEl = document.getElementById('meta-mail-spotlight-token');
    const icon = document.getElementById('meta-mail-spotlight-token-eye');
    if (!tokenEl) return;
    const full = tokenEl.dataset.full || '';
    if (!full) return;

    if (tokenEl.dataset.masked === 'true') {
      tokenEl.textContent = full;
      tokenEl.dataset.masked = 'false';
      if (icon) icon.className = 'fa-solid fa-eye';
    } else {
      tokenEl.textContent = full.substring(0, 16) + '••••••••';
      tokenEl.dataset.masked = 'true';
      if (icon) icon.className = 'fa-solid fa-eye-slash';
    }
  },

  openMetaAiPortalDirect() {
    const acc = this.activeSpotlightMail;
    if (acc && acc.email) {
      copyToClipboard(`${acc.email}`);
      showToast(`✔ Email (${acc.email}) copied! Opening Meta.ai...`);
    } else {
      showToast('Opening Meta.ai official portal...');
    }
    window.open('https://www.meta.ai', '_blank');
  },

  copyMetaRegistrationBundle() {
    const acc = this.activeSpotlightMail;
    if (!acc || !acc.email) {
      showToast('No active account selected.');
      return;
    }
    const otp = acc.last_otp || 'WAITING';
    const bundle = `Meta AI Registration:\nEmail: ${acc.email}\nPassword: ${acc.password}\nOTP: ${otp}\nFull Token: ${acc.refresh_token || ''}\nRaw Combo: ${acc.raw_account || ''}`;
    copyToClipboard(bundle);
    showToast('✔ Complete Meta AI Registration Bundle copied!');
  },

  onManualInputChanged(val) {
    const chipsBox = document.getElementById('meta-mail-manual-chips');
    const chipEmail = document.getElementById('meta-chip-email');
    const chipPass = document.getElementById('meta-chip-pass');
    const chipToken = document.getElementById('meta-chip-token');
    const chipCid = document.getElementById('meta-chip-cid');

    const str = String(val || '').trim();
    if (str.includes('|')) {
      if (chipsBox) chipsBox.classList.remove('hidden');
      const parts = str.split('|').map(p => p.trim());
      if (chipEmail) chipEmail.textContent = `📧 ${parts[0] || 'mail'}`;
      if (chipPass) chipPass.textContent = `🔑 ${parts[1] || 'pass'}`;
      if (chipToken) chipToken.textContent = parts[2] ? `🎟️ Token: ${parts[2].substring(0, 10)}...` : '🎟️ Token: None';
      if (chipCid) chipCid.textContent = parts[3] ? `🆔 CID: ${parts[3].substring(0, 10)}...` : '🆔 CID: Default';
    } else {
      if (chipsBox) chipsBox.classList.add('hidden');
    }
  },

  async checkSpotlightOtp() {
    if (!this.activeSpotlightMail || !this.activeSpotlightMail.email) {
      showToast('No active mail account selected.');
      return;
    }
    const acc = this.activeSpotlightMail;
    showToast(`Checking OTP for ${acc.email}...`);
    this.appendMetaMailLog(`[Hotmail143 Native OTP] Querying /api/v1/otp-orders/lookup for ${acc.email}...`, 'info');

    try {
      const res = await fetch('/api/meta/mail/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: acc.email,
          refresh_token: acc.refresh_token || '',
          client_id: acc.client_id || '',
          raw_account: acc.raw_account || '',
          password: acc.password || '',
          type: document.getElementById('meta-mail-target-service')?.value || 'facebook'
        })
      });
      const data = await res.json();
      if (data.success && data.found) {
        const otpCode = data.otp || data.code || 'RECEIVED';
        const otpEl = document.getElementById('meta-mail-spotlight-otp');
        if (otpEl) {
          otpEl.textContent = otpCode;
          otpEl.className = 'text-xl sm:text-2xl font-black text-emerald-400 tracking-widest select-all animate-bounce drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] font-mono';
        }
        this.activeSpotlightMail.last_otp = otpCode;
        this.playCyberBeep('success');
        this.appendMetaMailLog(`[✔ OTP MATCH] Code: ${otpCode}!`, 'otp');
        showToast(`✔ Meta OTP Found: ${otpCode}`);
        this.loadMetaMailHistory();
      } else {
        showToast('No OTP code delivered yet from Hotmail143.');
        this.appendMetaMailLog(`[Hotmail143] OTP not yet ready for ${acc.email} (Status: ${data.status || 'PENDING'}).`, 'warn');
      }
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  },

  async checkManualOtp() {
    const input = document.getElementById('meta-mail-manual-uid');
    const resultBox = document.getElementById('meta-mail-manual-result');
    const serviceType = document.getElementById('meta-mail-manual-service-type')?.value || 'facebook';
    const rawVal = input?.value.trim();

    if (!rawVal) {
      showToast('Please enter an email address or full combo.');
      return;
    }

    if (resultBox) {
      resultBox.innerHTML = '<span class="text-amber-400 font-mono flex items-center justify-center gap-2"><i class="fa-solid fa-circle-notch fa-spin"></i> Querying Hotmail143 Native OTP Engine (/api/v1/otp-orders/lookup)...</span>';
    }

    let email = rawVal;
    let password = '';
    let refreshToken = '';
    let clientId = '';

    if (rawVal.includes('|')) {
      const parts = rawVal.split('|').map(p => p.trim());
      email = parts[0] || '';
      password = parts[1] || '';
      refreshToken = parts[2] || '';
      clientId = parts[3] || '';
    }

    this.appendMetaMailLog(`[Hotmail143 Lookup] Checking order for ${email}...`, 'info');

    try {
      const res = await fetch('/api/meta/mail/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
          refresh_token: refreshToken,
          client_id: clientId,
          raw_account: rawVal,
          type: serviceType
        })
      });
      const data = await res.json();

      if (data.success) {
        if (data.found) {
          const otpCode = data.otp || data.code || 'RECEIVED';
          const statusText = (data.status || 'COMPLETED').toUpperCase();
          this.playCyberBeep('success');
          this.appendMetaMailLog(`[✔ Hotmail143 OTP Found] Code: ${otpCode} (Status: ${statusText})!`, 'otp');

          resultBox.innerHTML = `
            <div class="text-left w-full space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-gray-400">Target: <strong class="text-cyan-300 font-mono">${escapeHtml(email)}</strong></span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-bold">
                  HOTMAIL143: ${statusText}
                </span>
              </div>
              <div class="p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 via-black to-teal-950/80 border-2 border-emerald-400 text-center shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                <span class="text-[9px] uppercase tracking-wider text-emerald-300 font-bold block mb-1">
                  <i class="fa-solid fa-shield-halved mr-1"></i> EXTRACTED LIVE OTP CODE
                </span>
                <span class="text-3xl font-black text-emerald-300 font-mono select-all tracking-widest drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]">${escapeHtml(otpCode)}</span>
              </div>
              <div class="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                <span class="text-[10px] text-emerald-400 font-bold">✔ Code ready for Meta registration</span>
                <div class="flex items-center gap-1.5">
                  <button onclick="copyToClipboard('${escapeHtml(otpCode)}'); showToast('OTP copied!')" class="btn-cyber text-[10px] py-1 px-3 bg-emerald-500 text-black font-black">
                    <i class="fa-solid fa-copy mr-1"></i> Copy OTP
                  </button>
                  <button onclick="BuiltinTools.openMetaAiPortalDirect()" class="btn-cyber text-[10px] py-1 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black">
                    <i class="fa-solid fa-robot mr-1"></i> Open Meta.ai
                  </button>
                </div>
              </div>
            </div>
          `;
          showToast(`✔ Hotmail143 OTP Code: ${otpCode}`);
          this.loadMetaMailHistory();
        } else {
          const statusVal = (data.status || 'PENDING').toUpperCase();
          this.appendMetaMailLog(`[Hotmail143] Status: ${statusVal} - No OTP yet for ${email}.`, 'warn');

          resultBox.innerHTML = `
            <div class="space-y-2 text-center py-2 w-full">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
                <i class="fa-solid fa-hourglass-half fa-spin"></i> Hotmail143 Status: ${escapeHtml(statusVal)}
              </div>
              <span class="text-yellow-300 font-mono font-bold block text-xs">
                Waiting for OTP code delivery for ${escapeHtml(email)}...
              </span>
              <span class="text-[10px] text-gray-400 block">${escapeHtml(data.error_details || 'Hotmail143 order lookup completed. Code will appear once received.')}</span>
              <div class="pt-1">
                <button onclick="BuiltinTools.checkManualOtp()" class="btn-cyber text-[10px] py-1 px-4 bg-amber-500 hover:bg-amber-400 text-black font-black">
                  <i class="fa-solid fa-rotate mr-1"></i> Re-Check Hotmail143 Now
                </button>
              </div>
            </div>
          `;
          showToast(`Hotmail143 Status: ${statusVal}. Try again in a few seconds.`);
        }
      } else {
        resultBox.innerHTML = `<span class="text-red-400 font-mono font-bold"><i class="fa-solid fa-triangle-exclamation mr-1"></i> ${escapeHtml(data.error || 'Failed')}</span>`;
      }
    } catch (err) {
      if (resultBox) resultBox.innerHTML = `<span class="text-red-400 font-mono">Error: ${escapeHtml(err.message)}</span>`;
    }
  },

  async loadMetaMailHistory() {
    const countBadge = document.getElementById('meta-mail-history-count');
    try {
      const res = await fetch('/api/meta/mail/history');
      const data = await res.json();
      if (data.success) {
        this.metaMailHistory = data.history || [];
        if (countBadge) countBadge.textContent = `${this.metaMailHistory.length} Mails`;
        this.renderMetaMailHistory();
      }
    } catch (err) {
      console.error('[Mail History Error]:', err);
    }
  },

  filterMetaMailHistory() {
    const filterInput = document.getElementById('meta-mail-history-filter');
    const term = (filterInput?.value || '').toLowerCase().trim();
    if (!term) {
      this.renderMetaMailHistory();
      return;
    }
    const filtered = this.metaMailHistory.filter(h => {
      return (h.email || '').toLowerCase().includes(term) ||
             (h.password || '').toLowerCase().includes(term) ||
             (h.last_otp || '').toLowerCase().includes(term) ||
             (h.refresh_token || '').toLowerCase().includes(term) ||
             String(h.product_id || '').includes(term);
    });
    this.renderMetaMailHistory(filtered);
  },

  renderMetaMailHistory(filterList = null) {
    const tbody = document.getElementById('meta-mail-history-list');
    if (!tbody) return;

    const list = filterList !== null ? filterList : this.metaMailHistory;

    if (!list || list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-6 text-gray-500 font-mono text-xs">
            ${filterList !== null ? 'No matching mails found for search.' : 'No mails purchased yet. Click "CREATE ACCOUNT" to start.'}
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map((m, i) => {
      const idx = i + 1;
      const email = escapeHtml(m.email || '-');
      const pwd = escapeHtml(m.password || '-');
      const hasToken = Boolean(m.refresh_token);
      const tokenPill = hasToken 
        ? `<span class="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] border border-purple-500/30 font-bold inline-flex items-center gap-1 cursor-pointer" onclick="copyToClipboard('${escapeHtml(m.refresh_token)}'); showToast('OAuth2 token copied!')" title="Click to copy full token"><i class="fa-solid fa-key text-[9px]"></i> Token</span>`
        : `<span class="text-gray-500 text-[10px]">None</span>`;

      const domain = email.includes('@') ? email.split('@')[1] : '';
      const domainBadge = domain.includes('outlook')
        ? `<span class="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">Outlook</span>`
        : (domain.includes('hotmail') ? `<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">Hotmail</span>` : '');

      const otp = m.last_otp ? `
        <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/40 select-all shadow-[0_0_8px_rgba(16,185,129,0.4)] inline-flex items-center gap-1 cursor-pointer" onclick="copyToClipboard('${escapeHtml(m.last_otp)}'); showToast('OTP copied!')">
          <i class="fa-solid fa-shield-halved text-[9px]"></i> ${escapeHtml(m.last_otp)}
        </span>
      ` : `<span class="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 text-[10px] border border-yellow-500/20 font-mono">Waiting</span>`;

      const created = escapeHtml((m.created_at || '').substring(0, 19).replace('T', ' '));
      const combo = escapeHtml(m.raw_account || `${m.email}|${m.password}|${m.refresh_token || ''}|${m.client_id || ''}`);
      const savedBadge = m.saved_to_meta 
        ? '<span class="text-[9px] text-cyan-400 ml-1 font-bold" title="Synced in Meta Hub">✔ Hub</span>' 
        : '';

      return `
        <tr class="border-b border-white/5 hover:bg-white/5 transition font-mono text-xs">
          <td class="py-2.5 px-3 text-gray-500 font-bold">${idx}</td>
          <td class="py-2.5 px-3 font-medium text-cyan-300 select-all">
            <div class="flex items-center gap-1.5">
              <span>${email}</span>
              ${domainBadge}
              ${savedBadge}
            </div>
          </td>
          <td class="py-2.5 px-3 text-yellow-300 select-all font-mono font-bold">${pwd}</td>
          <td class="py-2.5 px-3">${tokenPill}</td>
          <td class="py-2.5 px-3">${otp}</td>
          <td class="py-2.5 px-3 text-[11px] text-gray-400">${created}</td>
          <td class="py-2.5 px-3 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="BuiltinTools.checkHistoryOtp('${escapeHtml(m.email || '')}')" class="btn-cyber-outline text-[10px] py-1 px-2 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/20" title="Check OTP with Full Token">
                <i class="fa-solid fa-rotate"></i>
              </button>
              <button onclick="BuiltinTools.inspectMetaMailMessages('${escapeHtml(m.email || '')}')" class="btn-cyber-outline text-[10px] py-1 px-2 text-sky-400 border-sky-500/30 hover:bg-sky-500/20" title="Inspect Full Messages">
                <i class="fa-solid fa-envelope-open-text"></i>
              </button>
              <button onclick="copyToClipboard('${combo}'); showToast('Full combo copied!')" class="btn-cyber-outline text-[10px] py-1 px-2 text-cyan-300 border-cyan-400/40 hover:bg-cyan-500/20" title="Copy Full Combo (mail|pass|token|id)">
                <i class="fa-solid fa-copy"></i>
              </button>
              <button onclick="BuiltinTools.saveHistoryToMetaHub('${escapeHtml(m.email || '')}', '${escapeHtml(m.password || '')}', '${combo}')" class="btn-cyber-outline text-[10px] py-1 px-2 text-purple-300 border-purple-500/30 hover:bg-purple-500/20" title="Push to Meta Accounts Hub">
                <i class="fa-solid fa-user-plus"></i>
              </button>
              <button onclick="BuiltinTools.deleteMetaMail('${m.id}', '${escapeHtml(m.email || '')}')" class="btn-cyber-outline text-[10px] py-1 px-1.5 text-red-400 border-red-500/30 hover:bg-red-500/20" title="Delete Mail">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  async checkHistoryOtp(email) {
    if (!email) return;
    const item = (this.metaMailHistory || []).find(h => (h.email || '').toLowerCase() === email.toLowerCase()) || {};
    showToast(`Checking OTP for ${email}...`);
    try {
      const res = await fetch('/api/meta/mail/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          refresh_token: item.refresh_token || '',
          client_id: item.client_id || '',
          raw_account: item.raw_account || '',
          password: item.password || '',
          type: 'facebook'
        })
      });
      const data = await res.json();
      if (data.success && data.found) {
        this.playCyberBeep('success');
        const code = data.otp || data.code || 'Received';
        showToast(`✔ Meta OTP for ${email}: ${code}`);
        this.loadMetaMailHistory();
      } else {
        showToast(`No OTP message found yet for ${email}.`);
      }
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  },

  async saveHistoryToMetaHub(email, pwd, combo) {
    if (!email) return;
    try {
      const res = await fetch('/api/meta/mail/save_to_meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pwd, cookie: combo })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✔ ${email} synced to Meta Horizon Accounts Hub!`);
        this.loadMetaStatus();
        this.loadMetaMailHistory();
      } else {
        showToast('✘ ' + (data.error || 'Failed to sync'));
      }
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  },

  async deleteMetaMail(id, email) {
    if (!confirm(`Delete mail record for ${email || id}?`)) return;
    try {
      const res = await fetch('/api/meta/mail/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, email })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Mail record removed.');
        this.loadMetaMailHistory();
      }
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  },

  copyMetaMailCombo() {
    if (!this.activeSpotlightMail) {
      showToast('No active mail account.');
      return;
    }
    const combo = this.activeSpotlightMail.raw_account || `${this.activeSpotlightMail.email}|${this.activeSpotlightMail.password}|${this.activeSpotlightMail.refresh_token || ''}|${this.activeSpotlightMail.client_id || ''}`;
    copyToClipboard(combo);
    showToast('✔ Full account combo (mail|pass|token|id) copied!');
  },

  copyText(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const txt = el.textContent.trim();
    if (txt && txt !== '-' && txt !== 'WAITING...') {
      copyToClipboard(txt);
      showToast(`✔ Copied: ${txt}`);
    } else {
      showToast('Nothing to copy.');
    }
  },

  playCyberBeep(type = 'success') {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.setValueAtTime(220, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {}
  },

  abortOtpWatcher() {
    clearInterval(this.mailCountdownTimer);
    clearInterval(this.mailOtpPollTimer);
    this.isMailGenerating = false;
    const progressCard = document.getElementById('meta-mail-progress-card');
    if (progressCard) progressCard.classList.add('hidden');
    this.appendMetaMailLog('[User] OTP watcher aborted.', 'warn');
    showToast('OTP watcher stopped.');
  },

  toggleMetaMailExportMenu(force) {
    const el = document.getElementById('meta-mail-export-dropdown');
    if (!el) return;
    if (typeof force === 'boolean') {
      if (force) el.classList.remove('hidden');
      else el.classList.add('hidden');
    } else {
      el.classList.toggle('hidden');
    }
  },

  downloadMetaMailsTxt() {
    if (!this.metaMailHistory || this.metaMailHistory.length === 0) {
      showToast('No mail accounts to export.');
      return;
    }
    const lines = this.metaMailHistory.map(m => {
      const email = m.email || '';
      const pwd = m.password || '';
      const otp = m.last_otp || '';
      const raw = m.raw_account || '';
      const dt = m.created_at || '';
      return `${email}|${pwd}|${otp}|${dt}|${raw}`;
    }).join('\n');

    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `META_MAILS_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✔ Exported TXT file successfully!');
  },

  downloadMetaMailsCsv() {
    if (!this.metaMailHistory || this.metaMailHistory.length === 0) {
      showToast('No mail accounts to export.');
      return;
    }
    const rows = [
      ['Email', 'Password', 'Product ID', 'Latest OTP', 'Created At', 'Raw Account']
    ];
    this.metaMailHistory.forEach(m => {
      rows.push([
        m.email || '',
        m.password || '',
        m.product_id || '',
        m.last_otp || '',
        m.created_at || '',
        m.raw_account || ''
      ]);
    });
    const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `META_MAILS_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✔ Exported CSV file successfully!');
  },

  downloadMetaMailsJson() {
    if (!this.metaMailHistory || this.metaMailHistory.length === 0) {
      showToast('No mail accounts to export.');
      return;
    }
    const blob = new Blob([JSON.stringify(this.metaMailHistory, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `META_MAILS_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✔ Exported JSON file successfully!');
  },

  copyAllMetaMails() {
    if (!this.metaMailHistory || this.metaMailHistory.length === 0) {
      showToast('No mail accounts to copy.');
      return;
    }
    const text = this.metaMailHistory.map(m => m.raw_account || `${m.email}|${m.password}`).join('\n');
    copyToClipboard(text);
    showToast(`✔ Copied ${this.metaMailHistory.length} account combos to clipboard!`);
  },

  async clearAllMetaMailHistory() {
    if (!confirm('Are you sure you want to clear all purchased mail history records?')) return;
    try {
      const res = await fetch('/api/meta/mail/clear_history', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('All mail history cleared.');
        this.loadMetaMailHistory();
      }
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  },

  async inspectMetaMailMessages(email) {
    if (!email) return;
    const modal = document.getElementById('meta-mail-msg-modal');
    const content = document.getElementById('meta-mail-msg-modal-content');
    if (!modal || !content) return;

    modal.classList.remove('hidden');
    content.innerHTML = '<div class="py-8 text-center text-amber-400 font-mono"><i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2 block"></i> Querying Hotmail143 Native Order & OTP Engine...</div>';

    try {
      const res = await fetch(`/api/meta/mail/otp?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (data.success) {
        const statusVal = (data.status || 'PENDING').toUpperCase();
        const statusBadge = statusVal === 'COMPLETED'
          ? `<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold">STATUS: ${statusVal}</span>`
          : `<span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">STATUS: ${statusVal}</span>`;

        const otpHeader = data.otp 
          ? `<div class="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/80 via-black to-teal-950/80 border-2 border-emerald-400 flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.35)]">
              <div>
                <span class="text-[9px] uppercase tracking-wider text-emerald-300 font-bold block">Hotmail143 Extracted OTP:</span>
                <span class="text-2xl font-black text-emerald-400 tracking-widest font-mono select-all">${escapeHtml(data.otp)}</span>
              </div>
              <button onclick="copyToClipboard('${escapeHtml(data.otp)}'); showToast('OTP Copied!')" class="btn-cyber text-xs py-1.5 px-3 bg-emerald-500 text-black font-black">
                <i class="fa-solid fa-copy mr-1"></i> Copy OTP
              </button>
            </div>`
          : `<div class="p-3 rounded-xl bg-black/60 border border-amber-500/30 text-amber-300 text-center font-mono text-xs">
              <i class="fa-solid fa-clock mr-1.5"></i> Hotmail143 Status: <strong>${statusVal}</strong>. Code has not arrived yet.
            </div>`;

        const msgs = Array.isArray(data.messages) ? data.messages : [];
        const msgItems = msgs.length > 0 ? msgs.map(m => {
          const subj = escapeHtml(typeof m === 'object' ? (m.subject || 'Order Info') : 'Message');
          const body = escapeHtml(typeof m === 'object' ? (m.body || m.content || JSON.stringify(m, null, 2)) : String(m));
          const date = escapeHtml(typeof m === 'object' ? (m.date || '-') : '-');

          return `
            <div class="p-3 rounded-lg bg-black/70 border border-white/10 space-y-1.5">
              <div class="flex items-center justify-between text-[11px] border-b border-white/5 pb-1">
                <span class="font-bold text-white"><i class="fa-solid fa-bolt mr-1 text-amber-400"></i> ${subj}</span>
                <span class="text-gray-500 text-[10px]">${date}</span>
              </div>
              <div class="p-2 rounded bg-black/90 font-mono text-[11px] text-cyan-200 whitespace-pre-wrap select-all border border-white/5">${body}</div>
            </div>
          `;
        }).join('') : '<div class="text-center py-4 text-gray-500">No active OTP records found for this email on Hotmail143.</div>';

        const rawJsonStr = data.raw ? escapeHtml(JSON.stringify(data.raw, null, 2)) : '';
        const rawBox = rawJsonStr ? `
          <details class="text-[10px] text-gray-400">
            <summary class="cursor-pointer hover:text-white py-1 text-[10px] font-bold text-amber-300">View Raw Hotmail143 API Payload</summary>
            <pre class="p-2 rounded bg-black/90 text-gray-300 font-mono text-[10px] select-all overflow-x-auto max-h-[120px] mt-1 border border-white/5">${rawJsonStr}</pre>
          </details>
        ` : '';

        content.innerHTML = `
          <div class="space-y-3 font-mono text-xs">
            <div class="flex items-center justify-between flex-wrap gap-1 text-[11px] text-gray-400 border-b border-white/10 pb-2">
              <span>Target Email: <strong class="text-cyan-300 select-all">${escapeHtml(email)}</strong></span>
              ${statusBadge}
            </div>
            ${otpHeader}
            <div class="space-y-2">
              <span class="text-[10px] text-gray-400 uppercase font-bold">Hotmail143 Lookup Activity:</span>
              ${msgItems}
            </div>
            ${rawBox}
          </div>
        `;
      } else {
        content.innerHTML = `<div class="py-6 text-center text-red-400 font-mono"><i class="fa-solid fa-triangle-exclamation mr-1"></i> ${escapeHtml(data.error || 'Failed to fetch details')}</div>`;
      }
    } catch (err) {
      content.innerHTML = `<div class="py-6 text-center text-red-400 font-mono">Connection Error: ${escapeHtml(err.message)}</div>`;
    }
  },

  async clearMetaAccounts() {
    if (!confirm('Are you sure you want to clear all saved Meta accounts and cookies?')) return;
    try {
      const res = await fetch('/api/meta/clear_accounts', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('All saved accounts cleared.');
        this.loadMetaStatus();
      }
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  },

  // BIDIRECTIONAL SYNC: AUTO MAIL & OTP STUDIO <-> ACCOUNTS & COOKIES HUB
  async pushMailToAccountsHub(email, password, token, otp) {
    if (!email) {
      showToast('No mail account selected to push.');
      return;
    }
    try {
      const res = await fetch('/api/meta/account/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: email.split('@')[0],
          uid: email,
          number: '',
          password: password || '',
          cookie: token ? `TOKEN:${token}` : (otp ? `OTP:${otp}` : '')
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✔ ${email} added to Meta All Hub!`);
        this.appendMetaMailLog(`[Sync Hub] Account ${email} synced to Meta All Hub.`, 'success');
        this.loadMetaStatus();
      } else {
        showToast('✘ ' + (data.error || 'Failed to sync'));
      }
    } catch (err) {
      showToast('Sync error: ' + err.message);
    }
  },

  async pushAllVerifiedMailsToAccountsHub() {
    if (!this.metaMailHistory || this.metaMailHistory.length === 0) {
      showToast('No mails in history to push!');
      return;
    }
    let count = 0;
    for (const item of this.metaMailHistory) {
      if (item && item.email) {
        try {
          await fetch('/api/meta/account/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: item.email.split('@')[0],
              uid: item.email,
              number: '',
              password: item.password || '',
              cookie: item.refresh_token ? `TOKEN:${item.refresh_token}` : (item.last_otp ? `OTP:${item.last_otp}` : '')
            })
          });
          count++;
        } catch (e) {}
      }
    }
    showToast(`✔ Synced ${count} mail account(s) to Meta All Hub!`);
    this.appendMetaMailLog(`[Sync Hub] Batch synced ${count} accounts to Meta All Hub.`, 'success');
    this.loadMetaStatus();
  },

  openAccountsHub() {
    if (window.switchView) window.switchView('tools');
    openModal('meta-modal');
    this.switchMetaTab('accounts');
  },

  openMetaAll() {
    this.openAccountsHub();
  }
};
