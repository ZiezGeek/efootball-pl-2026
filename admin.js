// =============================================
//  ADMIN.JS — PIN auth, toast, shared utils
// =============================================

// =============================================
//  HASH PIN (simple SHA-256 via Web Crypto)
// =============================================

export function hashPin(pin) {
  // For simplicity we store a pre-computed hash of "020707"
  // SHA-256("020707") = known value we compare against
  return "sha256:020707"; // placeholder marker
}

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// =============================================
//  TOAST NOTIFICATION
// =============================================

export function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// =============================================
//  ADMIN PIN MODAL SETUP
// =============================================

export function setupAdminPin(pinHash, onUnlock) {
  const openBtn = document.getElementById('openAdmin');
  const overlay = document.getElementById('pinOverlay');
  const input = document.getElementById('pinInput');
  const submitBtn = document.getElementById('pinSubmit');
  const cancelBtn = document.getElementById('pinCancel');
  const errorEl = document.getElementById('pinError');

  if (!openBtn || !overlay) return;

  const CORRECT_PIN = "020707";

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.classList.remove('hidden');
    input.value = '';
    errorEl.classList.add('hidden');
    setTimeout(() => input.focus(), 100);
  });

  cancelBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });

  const verify = () => {
    if (input.value === CORRECT_PIN) {
      overlay.classList.add('hidden');
      onUnlock();
    } else {
      errorEl.classList.remove('hidden');
      input.value = '';
      input.focus();
    }
  };

  submitBtn.addEventListener('click', verify);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') verify(); });
}
