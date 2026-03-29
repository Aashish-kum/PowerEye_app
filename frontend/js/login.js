function toggleEye(id, btn) {
  const inp = document.getElementById(id);
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.innerHTML = show
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

function showMsg(text, type) {
  const el = document.getElementById('msg');
  if (el) {
    el.textContent = text;
    el.className = 'msg ' + type;
  }
}

function handleLogin() {
  const email = document.getElementById('email').value.trim();
  const empid = document.getElementById('empid').value.trim();
  const pass = document.getElementById('pass').value;

  if (!email || !empid || !pass) {
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

  // Check if user exists
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.empid === empid && u.pass === pass);

  if (!user) {
    showMsg('Invalid credentials. Please try again.', 'error');
    return;
  }

  // Set "session"
  localStorage.setItem('currentUser', JSON.stringify(user));

  showMsg('Authenticating… please wait.', 'success');
  setTimeout(() => {
    showMsg('Signed in! Redirecting to dashboard…', 'success');
    setTimeout(() => {
      window.location.href = 'Dashboard.html';
    }, 1000);
  }, 1400);
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
