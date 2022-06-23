async function newFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value;
    const question = document.querySelector('input[name="question"]').value;

    const fileElement = document.getElementById('fileInput')

    const file = fileElement.files[0]
    var fromData = new FormData();
    formData.append('file', file);
    console.log(file);

    const response = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            question,
            file
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        // document.location.replace('/dashboard');
        console.log(file)
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);