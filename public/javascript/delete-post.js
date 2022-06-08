async function deleteFormHandler(event) {
    event.preventDefault();

    // capture the id of the post
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];


    // make delete request to '/api/posts/:id'
    const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
        // no headers necessary because there is no body, we simply are making an HTTPS request
    })

    // if succesful redirect to dashboard using 'document.location.replace('/dashboard/')
    if (response.ok) {
        document.location.replace('/dashboard/');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);