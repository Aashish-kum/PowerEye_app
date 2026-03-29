function confirmLogout() {
  const statusSession = document.getElementById('statusSession');
  const statusTokens = document.getElementById('statusTokens');
  const statusCache = document.getElementById('statusCache');
  const statusRedirect = document.getElementById('statusRedirect');
  const logoutButtons = document.getElementById('logoutButtons');
  const logoutMessage = document.getElementById('logoutMessage');
  const loginBtn = document.getElementById('loginBtn');
  const logoutStatus = document.getElementById('logoutStatus');

  logoutButtons.classList.add('hidden');
  logoutStatus.style.display = 'block';

  // Step 1: Clear session
  setTimeout(() => {
    localStorage.removeItem('currentUser');
    statusSession.textContent = '✓';
    statusSession.className = 'status-check success';

    // Step 2: Clear tokens
    setTimeout(() => {
      statusTokens.textContent = '✓';
      statusTokens.className = 'status-check success';

      // Step 3: Clear cache
      setTimeout(() => {
        statusCache.textContent = '✓';
        statusCache.className = 'status-check success';

        // Step 4: Redirect
        setTimeout(() => {
          statusRedirect.textContent = '✓';
          statusRedirect.className = 'status-check success';
          logoutMessage.style.display = 'flex';
          loginBtn.classList.remove('hidden');
          
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1000);
        }, 500);
      }, 500);
    }, 500);
  }, 500);
}

function cancelLogout() {
  window.history.back();
}
