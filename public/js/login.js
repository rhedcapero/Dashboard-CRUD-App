/**
 * ==============================================================================
 * CPSU REGISTRAR OFFICE STUDENT INFORMATION SYSTEM
 * Admin Login Page Client Application
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminLoginForm');
  const emailInput = document.getElementById('adminEmail');
  const passwordInput = document.getElementById('adminPassword');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeShowIcon = togglePasswordBtn.querySelector('.eye-show-icon');
  const eyeHideIcon = togglePasswordBtn.querySelector('.eye-hide-icon');
  const rememberMeCheckbox = document.getElementById('rememberMeCheckbox');
  const submitBtn = document.getElementById('loginSubmitBtn');
  const btnSpinner = document.getElementById('loginSpinner');
  const btnText = document.getElementById('loginBtnText');
  const alertBanner = document.getElementById('loginAlertBanner');
  const alertMessage = document.getElementById('loginAlertMessage');
  const successBanner = document.getElementById('loginSuccessBanner');
  const successMessage = document.getElementById('loginSuccessMessage');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  // Forgot password elements
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const forgotModal = document.getElementById('forgotPasswordModal');
  const closeForgotBtn = document.getElementById('closeForgotModalBtn');
  const cancelForgotBtn = document.getElementById('cancelForgotModalBtn');
  const sendRecoveryBtn = document.getElementById('sendRecoveryBtn');
  const recoveryEmailInput = document.getElementById('recoveryEmail');

  // Pre-fill remembered email if available
  const rememberedEmail = localStorage.getItem('cpsu_remembered_email');
  if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    rememberMeCheckbox.checked = true;
    passwordInput.focus();
  }

  // 1. Show/Hide Password Feature
  togglePasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    eyeShowIcon.classList.toggle('hidden', isPassword);
    eyeHideIcon.classList.toggle('hidden', !isPassword);
    togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });

  // 2. Real-time input error clearing
  emailInput.addEventListener('input', () => {
    emailError.textContent = '';
    alertBanner.classList.add('hidden');
  });

  passwordInput.addEventListener('input', () => {
    passwordError.textContent = '';
    alertBanner.classList.add('hidden');
  });

  // 3. Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = rememberMeCheckbox.checked;

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      emailError.textContent = 'Please enter your administrator email address.';
      valid = false;
    } else if (!emailRegex.test(email)) {
      emailError.textContent = 'Please enter a valid institutional email address.';
      valid = false;
    }

    if (!password) {
      passwordError.textContent = 'Please enter your administrator password.';
      valid = false;
    }

    if (!valid) return;

    // Set UI to loading state
    setLoading(true);
    alertBanner.classList.add('hidden');
    successBanner.classList.add('hidden');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe
        })
      });

      const result = await response.json();

      if (response.ok && result.success && result.token) {
        // Save token and user details according to Remember Me setting
        if (rememberMe) {
          localStorage.setItem('cpsu_admin_token', result.token);
          localStorage.setItem('cpsu_admin_user', JSON.stringify(result.user));
          localStorage.setItem('cpsu_remembered_email', email);
          sessionStorage.removeItem('cpsu_admin_token');
          sessionStorage.removeItem('cpsu_admin_user');
        } else {
          sessionStorage.setItem('cpsu_admin_token', result.token);
          sessionStorage.setItem('cpsu_admin_user', JSON.stringify(result.user));
          localStorage.removeItem('cpsu_admin_token');
          localStorage.removeItem('cpsu_admin_user');
          localStorage.removeItem('cpsu_remembered_email');
        }

        // Display success banner
        successMessage.textContent = 'Authentication verified! Redirecting to Dashboard Overview...';
        successBanner.classList.remove('hidden');

        // Smooth redirect to Dashboard Overview
        setTimeout(() => {
          window.location.replace('/');
        }, 500);
      } else {
        // Display authentication error message
        const message = result.message || 'Incorrect administrator credentials. Access denied.';
        alertMessage.textContent = message;
        alertBanner.classList.remove('hidden');
        passwordInput.value = '';
        passwordInput.focus();
        setLoading(false);
      }
    } catch (err) {
      console.error('Login request failed:', err);
      alertMessage.textContent = 'Unable to connect to the registrar authentication service. Please ensure the server is running.';
      alertBanner.classList.remove('hidden');
      setLoading(false);
    }
  });

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
      btnSpinner.classList.remove('hidden');
      btnText.textContent = 'Verifying Credentials...';
    } else {
      btnSpinner.classList.add('hidden');
      btnText.textContent = 'Login as Admin';
    }
  }

  // 4. Forgot Password Modal handlers
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (emailInput.value.trim()) {
      recoveryEmailInput.value = emailInput.value.trim();
    }
    forgotModal.classList.remove('hidden');
  });

  const closeForgotModal = () => {
    forgotModal.classList.add('hidden');
  };

  closeForgotBtn.addEventListener('click', closeForgotModal);
  cancelForgotBtn.addEventListener('click', closeForgotModal);
  forgotModal.addEventListener('click', (e) => {
    if (e.target === forgotModal) closeForgotModal();
  });

  sendRecoveryBtn.addEventListener('click', async () => {
    const recEmail = recoveryEmailInput.value.trim();
    if (!recEmail) {
      alert('Please enter your administrator email address.');
      return;
    }

    sendRecoveryBtn.disabled = true;
    sendRecoveryBtn.textContent = 'Submitting...';

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recEmail })
      });
      const data = await res.json();
      alert(data.message || 'Password reset request submitted to administration.');
      closeForgotModal();
    } catch (err) {
      alert('Password reset request submitted. Please check with your system administrator.');
      closeForgotModal();
    } finally {
      sendRecoveryBtn.disabled = false;
      sendRecoveryBtn.textContent = 'Request Assistance';
    }
  });
});

