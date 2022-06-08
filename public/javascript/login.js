// SIGN-UP
// we will use 'async/await'  to add some error handling
//  - will help make our promises more readable 
//  - async here tells us that this function does something asynchronous
async function signupFormHandler(event) {
    event.preventDefault();

    // grab data from the form '<input>' with the id="username-signup"
    const username = document.querySelector('#username-signup').value.trim();
    // grab data from the form '<input>' with the id="email-signup"
    const email = document.querySelector('#email-signup').value.trim();
    // grab data from the form '<input>' with the id="password-signup"
    const password = document.querySelector('#password-signup').value.trim();

    // if all fields completed
    if (username && email && password) {
        // make a fetch POST request to '/api/users'
        // we add the 'await' keyword before the 'Promise'
        //  - when using 'await' we can assign the result of the promise to a variable
        //      - for example: 'const response = await fetch();'
        //      - this way we don't need to use 'catch()' or 'then()' to tell the code what to do after the Promise completes
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            // telling therequest what type of data we're sending?
            headers: { 'Content-Type': 'application/json' }
        })//.then((response) => {console.log(response)}) -- we removed this once we used async/await-- this allowed us not to use '.then()' and '.catch()'
        
        // check th response status
        // we use '.ok' property to add error handling. it it is ok then we console.log('success')
        if (response.ok) {
            console.log('success');
        } else {
            // if the 'response' is not '.ok' then we 'alert()' the rror
            alert(response.statusText);
        }
    }
}

// event listerner that listens for a 'submit' from form class="signup-form"
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);

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
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);