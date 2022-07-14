async function editFormHandler(event) {
    event.preventDefault();

    // capture the id of the post
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    // capture the value of the 'post-title' form element
    const title = document.querySelector('input[name="post-title"]').value.trim();

    const question = document.querySelector('textarea[name="post-question"]').value.trim();


    // PUT request to '/api/posts/${id}'. include the title in the 'body'. stringify the body
    if (title && question) {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title,
                question
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.replace('/dashboard/');
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);