// LOGIN
async function loginFormHandler(event){
    event.preventDefault();

    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (email && password) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            document.location.replace('/dashboard');
            document.location.reload();
            document.location.replace('/dashboard');
        } else {
            alert("E-mail or password incorrect!");
        }
    }
}

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);