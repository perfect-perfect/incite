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
            document.location.replace('/dashboard');
            // document.location.reload();
        } else {
            // if the 'response' is not '.ok' then we 'alert()' the rror
            alert(response.statusText);
        }
    }
}

// event listerner that listens for a 'submit' from form class="signup-form"
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);