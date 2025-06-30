document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsAcceptedCheckbox = document.getElementById('termsAccepted');

    
    M.updateTextFields();

    // validação de formulário com api html e regex
    fullNameInput.addEventListener('input', function() {
        if (fullNameInput.validity.valid) {
            fullNameInput.classList.remove('invalid');
            fullNameInput.classList.add('valid');
        } else {
            fullNameInput.classList.remove('valid');
            fullNameInput.classList.add('invalid');
        }
    });

    // validação de telefone com regex
    phoneInput.addEventListener('input', function() {
        // regex para formatos (xx) xxxx-xxxx, (xx) xxxx-xxxx ou xxxxxxxxxxx
        const phoneRegex = /^(\(\d{2}\)\s?\d{4,5}-\d{4}|\d{10,11})$/;
        if (phoneRegex.test(phoneInput.value)) {
            phoneInput.classList.remove('invalid');
            phoneInput.classList.add('valid');
        } else {
            phoneInput.classList.remove('valid');
            phoneInput.classList.add('invalid');
        }
    });

    // validação de email com regex
    emailInput.addEventListener('input', function() {
        if (emailInput.validity.valid) {
            emailInput.classList.remove('invalid');
            emailInput.classList.add('valid');
        } else {
            emailInput.classList.remove('valid');
            emailInput.classList.add('invalid');
        }
    });

    // validação de senha
    passwordInput.addEventListener('input', function() {
        if (passwordInput.validity.valid) {
            passwordInput.classList.remove('invalid');
            passwordInput.classList.add('valid');
        } else {
            passwordInput.classList.remove('valid');
            passwordInput.classList.add('invalid');
        }
        // verifica a confirmação da senha
        validateConfirmPassword();
    });

    // validação confirmação de senha
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);

    function validateConfirmPassword() {
        if (confirmPasswordInput.value === passwordInput.value && confirmPasswordInput.value.length >= 8) {
            confirmPasswordInput.classList.remove('invalid');
            confirmPasswordInput.classList.add('valid');
        } else {
            confirmPasswordInput.classList.remove('valid');
            confirmPasswordInput.classList.add('invalid');
        }
    }

    // tratamento do formulário no submit
    cadastroForm.addEventListener('submit', function(event) {
        event.preventDefault(); // impede o envio padrão do formulário

        // garante os campos obrigatórios sejam validados e checados
        const isFormValid = cadastroForm.checkValidity() &&
                            phoneInput.classList.contains('valid') &&
                            confirmPasswordInput.classList.contains('valid') &&
                            termsAcceptedCheckbox.checked;

        if (isFormValid) {
            // dados no web storage
            const userData = {
                fullName: fullNameInput.value,
                phone: phoneInput.value,
                email: emailInput.value,
                password: passwordInput.value,
                newsletter: document.getElementById('newsletter').checked
            };

            localStorage.setItem('currentUser', JSON.stringify(userData));

            alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
            window.location.href = '../login/login.html';
        } else {
            alert('Por favor, preencha todos os campos corretamente e aceite os termos.');
        
        }
    });

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('Dados do último usuário salvo:', userData);
    }
});