
  let selectedPriority = 'low';

  function setPriority(val, btn) {
    selectedPriority = val;
    document.querySelectorAll('.priority-btn').forEach(b => {
      b.className = 'priority-btn';
    });
    btn.classList.add('selected-' + val);
  }

  function updateCount(el) {
    const len = el.value.length;
    document.getElementById('char-num').textContent = len;
    if (len > 1000) el.value = el.value.slice(0, 1000);
  }

  function showMsg(text, type) {
    const el = document.getElementById('msg');
    el.innerHTML = (type === 'error')
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>${text}`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>${text}`;
    el.className = 'msg ' + type;
  }

  function clearMsg() {
    const el = document.getElementById('msg');
    el.className = 'msg'; el.innerHTML = '';
  }

  function handleSubmit() {
    const fname   = document.getElementById('fname').value.trim();
    const lname   = document.getElementById('lname').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    clearMsg();

    if (!fname)             { showMsg('Please enter your first name.', 'error'); return; }
    if (!email)             { showMsg('Please enter your email address.', 'error'); return; }
    if (!email.includes('@')) { showMsg('Please enter a valid email address.', 'error'); return; }
    if (!subject)           { showMsg('Please select a subject for your message.', 'error'); return; }
    if (!message)           { showMsg('Please write your message before sending.', 'error'); return; }
    if (message.length < 10){ showMsg('Message is too short — please provide more detail.', 'error'); return; }

    // Build mailto link with all details
    const empid   = document.getElementById('empid').value.trim();
    const to      = 'ashishpraj357@gmail.com';
    const subLine = encodeURIComponent(`[VoltGrid] ${subject} — ${fname} ${lname}`);
    const body    = encodeURIComponent(
      `Hello Aashish,\n\n` +
      `Name: ${fname} ${lname}\n` +
      `Email: ${email}\n` +
      (empid ? `Employee ID: ${empid}\n` : '') +
      `Subject: ${subject}\n` +
      `Priority: ${selectedPriority.toUpperCase()}\n\n` +
      `Message:\n${message}\n\n` +
      `---\nSent via VoltGrid Monitor Contact Page`
    );

    // Open mail client
    const mailLink = `mailto:${to}?subject=${subLine}&body=${body}`;
    window.location.href = mailLink;

    // Show success after short delay (mail client may open)
    setTimeout(() => {
      document.getElementById('form-content').style.display = 'none';
      document.getElementById('success-overlay').classList.add('show');
    }, 800);
  }

  function resetForm() {
    // Reset all fields
    ['fname','lname','email','empid','message'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('subject').value = '';
    document.getElementById('char-num').textContent = '0';

    // Reset priority
    document.querySelectorAll('.priority-btn').forEach(b => b.className = 'priority-btn');
    document.querySelector('.priority-btn').classList.add('selected-low');
    selectedPriority = 'low';

    clearMsg();

    document.getElementById('success-overlay').classList.remove('show');
    document.getElementById('form-content').style.display = 'block';
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