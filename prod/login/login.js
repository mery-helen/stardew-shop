document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    M.updateTextFields();

    // validação de email
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
    });

    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
        M.updateTextFields();
        emailInput.classList.add('valid'); 

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const isFormValid = loginForm.checkValidity();

        if (isFormValid) {
            const enteredEmail = emailInput.value;
            const enteredPassword = passwordInput.value;

            const storedUserString = localStorage.getItem('currentUser');

            if (storedUserString) {
                const storedUser = JSON.parse(storedUserString);

                if (enteredEmail === storedUser.email && enteredPassword === storedUser.password) {
                    alert('Login realizado com sucesso! Bem-vindo(a)!');

                    if (rememberMeCheckbox.checked) {
                        localStorage.setItem('rememberedEmail', enteredEmail);
                    } else {
                        localStorage.removeItem('rememberedEmail');
                    }

                    window.location.href = '../index.html';
                } else {
                    alert('Email ou senha inválidos. Por favor, tente novamente.');
                    emailInput.classList.remove('valid');
                    emailInput.classList.add('invalid');
                    passwordInput.classList.remove('valid');
                    passwordInput.classList.add('invalid');
                }
            } else {
                alert('Nenhum usuário cadastrado encontrado. Por favor, cadastre-se primeiro.');
            }
        } else {
            alert('Por favor, preencha seu email e senha corretamente.');
        }
    });

    // event listener para o checkbox "lembrar-me"
    rememberMeCheckbox.addEventListener('change', function() {
        if (!rememberMeCheckbox.checked) {
            localStorage.removeItem('rememberedEmail'); // remove o email salvo se desmarcar
        }
    });
}});