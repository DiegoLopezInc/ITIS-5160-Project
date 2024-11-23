// Client-side form validation
document.addEventListener('DOMContentLoaded', function() {
    // Get all forms with the 'needs-validation' class
    const forms = document.querySelectorAll('.needs-validation');

    // Form validation function
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Password strength validation
    const passwordInput = document.querySelector('input[type="password"]');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthIndicator = document.getElementById('password-strength');
            
            // Check password strength
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*]/.test(password);
            const isLongEnough = password.length >= 8;

            let strength = 0;
            strength += hasUpperCase ? 1 : 0;
            strength += hasLowerCase ? 1 : 0;
            strength += hasNumbers ? 1 : 0;
            strength += hasSpecialChar ? 1 : 0;
            strength += isLongEnough ? 1 : 0;

            // Update strength indicator
            if (strengthIndicator) {
                strengthIndicator.className = 'strength-' + strength;
                strengthIndicator.textContent = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength - 1];
            }
        });
    }
}); 