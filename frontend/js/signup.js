function toggleEye(id, btn) {
  const inp = document.getElementById(id);
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.innerHTML = show
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

function checkStrength(val) {
  const bars = ['sb1', 'sb2', 'sb3', 'sb4'];
  bars.forEach(b => {
    const el = document.getElementById(b);
    if (el) el.className = 's-bar';
  });
  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const cls = score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong';
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  for (let i = 0; i < score; i++) {
    const el = document.getElementById(bars[i]);
    if (el) el.className = 's-bar ' + cls;
  }
  const labelEl = document.getElementById('strength-label');
  if (labelEl) labelEl.textContent = score ? labels[score] : 'Enter a password';
}

function showMsg(text, type) {
  const el = document.getElementById('msg');
  if (el) {
    el.textContent = text;
    el.className = 'msg ' + type;
  }
}

function handleSignup() {
  const email = document.getElementById('email').value.trim();
  const empid = document.getElementById('empid').value.trim();
  const pass = document.getElementById('pass').value;
  const confirm = document.getElementById('confirm').value;

  if (!email || !empid || !pass || !confirm) {
    showMsg('Please fill in all fields.', 'error');
    return;
  }
  if (!email.includes('@')) {
    showMsg('Enter a valid email address.', 'error');
    return;
  }
  if (!/^EMP-?\d{4,6}$/i.test(empid)) {
    showMsg('Employee ID must be like EMP-12345.', 'error');
    return;
  }
  if (pass.length < 6) {
    showMsg('Password must be at least 6 characters.', 'error');
    return;
  }
  if (pass !== confirm) {
    showMsg('Passwords do not match.', 'error');
    return;
  }

  // Check if user already exists
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.find(u => u.email === email || u.empid === empid)) {
    showMsg('User already exists with this email or employee ID.', 'error');
    return;
  }

  // Create new user
  const newUser = { email, empid, pass };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  showMsg('Creating your account…', 'success');
  setTimeout(() => {
    showMsg('Account created! Redirecting to Sign In…', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  }, 1200);
}

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburger');
  const open = menu.classList.toggle('open');
  btn.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
}

function closeMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

// Add event listeners for input fields if they exist
document.addEventListener('DOMContentLoaded', () => {
  const passInput = document.getElementById('pass');
  if (passInput) {
    passInput.addEventListener('input', (e) => checkStrength(e.target.value));
  }
});
