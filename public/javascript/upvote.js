async function upvoteClickHandler(event) {
    event.preventDefault();

    // this grabs the 'post_id' from the url
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    // this console.log shows up in the browser console.log
    // console.log(id);

    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        method: 'PUT',
        body: JSON.stringify({
            post_id: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }
}

// listen from a click on the button with the class '.upvote-btn' on the single-post.handlebars page.
document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);