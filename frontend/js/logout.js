
  // ═══════════════════════════════════════════════════════════════
  //  SESSION MANAGEMENT & LOGOUT HANDLER
  // ═══════════════════════════════════════════════════════════════

  /**
   * Confirm and execute logout
   */
  async function confirmLogout() {
    const confirmBtn = document.getElementById('confirmLogoutBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const statusDiv = document.getElementById('logoutStatus');
    const logoutButtons = document.getElementById('logoutButtons');

    // Disable buttons and show status
    confirmBtn.disabled = true;
    cancelBtn.disabled = true;
    cancelBtn.style.display = 'none';
    logoutButtons.style.opacity = '0.5';
    statusDiv.classList.add('show');

    try {
      // Step 1: Clear localStorage
      await clearLocalStorage();
      updateStatus('statusSession', 'done', '✓');

      // Step 2: Clear sessionStorage
      await clearSessionStorage();
      updateStatus('statusTokens', 'done', '✓');

      // Step 3: Clear cookies
      await clearCookies();
      updateStatus('statusCache', 'done', '✓');

      // Step 4: Notify server (optional)
      await notifyServer();
      updateStatus('statusRedirect', 'done', '✓');

      // Show success message
      setTimeout(() => {
        showSuccessMessage();
      }, 500);

    } catch (error) {
      console.error('Logout error:', error);
      updateStatus('statusRedirect', 'error', '✕');
      confirmBtn.disabled = false;
      cancelBtn.disabled = false;
      cancelBtn.style.display = 'block';
      logoutButtons.style.opacity = '1';
    }
  }

  /**
   * Cancel logout and redirect back
   */
  function cancelLogout() {
    // Redirect back to dashboard
    window.location.href = '/frontend/Dashboard.html';
  }

  /**
   * Clear localStorage
   */
  async function clearLocalStorage() {
    return new Promise((resolve) => {
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userSession');
        localStorage.removeItem('userPreferences');
        localStorage.removeItem('dashboardSettings');
        localStorage.clear(); // Clear everything to be safe
        resolve();
      } catch (error) {
        console.error('LocalStorage clear error:', error);
        resolve(); // Continue even if error
      }
    });
  }

  /**
   * Clear sessionStorage
   */
  async function clearSessionStorage() {
    return new Promise((resolve) => {
      try {
        sessionStorage.removeItem('tempToken');
        sessionStorage.removeItem('sessionId');
        sessionStorage.clear(); // Clear everything
        resolve();
      } catch (error) {
        console.error('SessionStorage clear error:', error);
        resolve(); // Continue even if error
      }
    });
  }

  /**
   * Clear cookies
   */
  async function clearCookies() {
    return new Promise((resolve) => {
      try {
        // Clear auth cookies
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });

        // Specific cookies to clear
        const cookiesToClear = ['authToken', 'sessionId', 'userId', 'userRole'];
        cookiesToClear.forEach(cookieName => {
          document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        });

        resolve();
      } catch (error) {
        console.error('Cookie clear error:', error);
        resolve(); // Continue even if error
      }
    });
  }

  /**
   * Notify backend about logout
   */
  async function notifyServer() {
    return new Promise((resolve) => {
      try {
        // Try to notify server
        fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            reason: 'User logout'
          })
        }).then(response => {
          console.log('Server notified of logout:', response.status);
          resolve();
        }).catch(error => {
          console.error('Server notification failed (continuing anyway):', error);
          resolve(); // Continue even if notification fails
        });
      } catch (error) {
        console.error('Logout notification error:', error);
        resolve();
      }
    });
  }

  /**
   * Update status indicator
   */
  function updateStatus(elementId, status, text) {
    const element = document.getElementById(elementId);
    if (element) {
      element.className = `status-check ${status}`;
      element.textContent = text;
    }
  }

  /**
   * Show success message and redirect button
   */
  function showSuccessMessage() {
    const messageDiv = document.getElementById('logoutMessage');
    const statusDiv = document.getElementById('logoutStatus');
    const logoutButtons = document.getElementById('logoutButtons');
    const loginBtn = document.getElementById('loginBtn');
    const confirmBtn = document.getElementById('confirmLogoutBtn');

    messageDiv.classList.add('show');
    statusDiv.style.display = 'none';
    logoutButtons.style.display = 'none';
    loginBtn.classList.remove('hidden');

    // Auto-redirect after 3 seconds
    setTimeout(() => {
      redirectToLogin();
    }, 3000);
  }

  /**
   * Redirect to login page
   */
  function redirectToLogin() {
    // Add fade-out animation
    const container = document.getElementById('logoutContainer');
    container.style.animation = 'slideOut 0.4s ease forwards';

    setTimeout(() => {
      window.location.href = '/frontend/login.html';
    }, 400);
  }

  // ═══════════════════════════════════════════════════════════════
  //  INITIALIZATION & PAGE LOAD DETECTION
  // ═══════════════════════════════════════════════════════════════

  /**
   * Check if page was loaded as part of logout process
   */
  document.addEventListener('DOMContentLoaded', () => {
    // Check for redirect parameter
    const params = new URLSearchParams(window.location.search);
    const isAutoLogout = params.get('auto') === 'true';

    if (isAutoLogout) {
      // Auto-execute logout
      setTimeout(() => {
        confirmLogout();
      }, 500);
    }

    // Add slideOut animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideOut {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(20px);
        }
      }
    `;
    document.head.appendChild(style);
  });

  // ═══════════════════════════════════════════════════════════════
  //  KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Keyboard navigation
   */
  document.addEventListener('keydown', (e) => {
    const confirmBtn = document.getElementById('confirmLogoutBtn');

    if (e.key === 'Enter' && !confirmBtn.disabled) {
      confirmLogout();
    }
    if (e.key === 'Escape') {
      cancelLogout();
    }
  });

  // ═══════════════════════════════════════════════════════════════
  //  UNLOAD HANDLER (Session cleanup on page close)
  // ═══════════════════════════════════════════════════════════════

  /**
   * Clean up on page unload
   */
  window.addEventListener('beforeunload', (e) => {
    // Clear any remaining sensitive data
    if (window.sessionStorage) {
      sessionStorage.clear();
    }
  });

