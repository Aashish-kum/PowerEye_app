
  // ═══════════════════════════════════════════════════════════════
  //  POLE FORM HANDLER
  // ═══════════════════════════════════════════════════════════════

  /**
   * Handle form submission
   */
  async function handleSubmit(event) {
    event.preventDefault();

    // Clear previous alerts
    clearAlerts();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Get form data
    const formData = new FormData(document.getElementById('poleForm'));
    const poleData = Object.fromEntries(formData);

    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const submitBtnText = document.getElementById('submitBtnText');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtnText.innerHTML = '<span class="spinner"></span>';

    try {
      // Submit to server
      const response = await submitPoleData(poleData);

      if (response.success) {
        showSuccess('Pole created successfully! Redirecting...');

        // Redirect after delay
        setTimeout(() => {
          window.location.href = '/home.html?newPole=' + response.poleId;
        }, 1500);

      } else {
        showError(response.message || 'Failed to create pole');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtnText.textContent = 'Create Pole';
      }

    } catch (error) {
      console.error('Error:', error);
      showError('An error occurred. Please try again.');
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Create Pole';
    }
  }

  /**
   * Validate form fields
   */
  function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      field.classList.remove('error', 'success');

      if (!field.value.trim()) {
        field.classList.add('error');
        isValid = false;
      } else {
        field.classList.add('success');

        // Additional validation
        if (field.name === 'poleId' && !validatePoleId(field.value)) {
          field.classList.remove('success');
          field.classList.add('error');
          isValid = false;
        }

        if (field.name === 'voltage' && (isNaN(field.value) || field.value <= 0)) {
          field.classList.remove('success');
          field.classList.add('error');
          isValid = false;
        }

        if (field.name === 'current' && (isNaN(field.value) || field.value <= 0)) {
          field.classList.remove('success');
          field.classList.add('error');
          isValid = false;
        }

        if (field.name === 'power' && (isNaN(field.value) || field.value <= 0)) {
          field.classList.remove('success');
          field.classList.add('error');
          isValid = false;
        }

        if (field.name === 'connections' && (isNaN(field.value) || field.value < 0)) {
          field.classList.remove('success');
          field.classList.add('error');
          isValid = false;
        }
      }
    });

    if (!isValid) {
      showError('Please fill in all required fields correctly');
    }

    return isValid;
  }

  /**
   * Validate pole ID format
   */
  function validatePoleId(poleId) {
    const poleIdPattern = /^P0L-\d{3}$/;
    return poleIdPattern.test(poleId);
  }

  /**
   * Submit pole data to server
   */
  async function submitPoleData(poleData) {
    // Simulate API call - replace with actual endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        // Demo mode - always succeed
        resolve({
          success: true,
          poleId: poleData.poleId,
          message: 'Pole created successfully'
        });

        // For real implementation:
        /*
        fetch('/api/poles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
          },
          body: JSON.stringify(poleData)
        })
          .then(response => response.json())
          .then(data => resolve(data))
          .catch(error => {
            console.error('Error:', error);
            resolve({ success: false, message: 'Network error' });
          });
        */
      }, 1000);
    });
  }

  /**
   * Show error message
   */
  function showError(message) {
    const alert = document.getElementById('errorAlert');
    const messageEl = document.getElementById('errorMessage');
    messageEl.textContent = message;
    alert.classList.add('show');
    window.scrollTo(0, 0);
  }

  /**
   * Show success message
   */
  function showSuccess(message) {
    const alert = document.getElementById('successAlert');
    alert.classList.add('show');
    window.scrollTo(0, 0);
  }

  /**
   * Clear all alerts
   */
  function clearAlerts() {
    document.getElementById('errorAlert').classList.remove('show');
    document.getElementById('successAlert').classList.remove('show');
  }

  /**
   * Go back to previous page
   */
  function goBack() {
    const confirmed = confirm('Are you sure? Unsaved changes will be lost.');
    if (confirmed) {
      window.location.href = '/home.html';
    }
  }

  /**
   * Calculate power from voltage and current
   */
  function calculatePower() {
    const voltage = parseFloat(document.getElementById('voltage').value) || 0;
    const current = parseFloat(document.getElementById('current').value) || 0;
    const power = voltage * current;

    if (power > 0) {
      document.getElementById('power').value = power.toFixed(2);
      document.getElementById('power').classList.add('success');
    }
  }

  /**
   * Auto-calculate power when voltage or current changes
   */
  document.getElementById('voltage')?.addEventListener('change', calculatePower);
  document.getElementById('current')?.addEventListener('change', calculatePower);

  /**
   * Real-time validation feedback
   */
  document.getElementById('poleForm')?.addEventListener('input', function(e) {
    const field = e.target;

    if (!field.required) return;

    if (field.value.trim()) {
      field.classList.remove('error');
      field.classList.add('success');
    } else {
      field.classList.remove('success');
      field.classList.add('error');
    }

    clearAlerts();
  });

  /**
   * Set default date to today
   */
  document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('lastInspection').value = today;
  });

