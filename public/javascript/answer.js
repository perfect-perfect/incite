async function answerFormHandler(event) {
    event.preventDefault();

    const answer_text = document.querySelector('textarea[name="answer-body"]').value.trim();

    // grab post_id from the url
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    // console.log(answer_text, post_id);

    if (answer_text) {
        const response = await fetch('/api/answers', {
            method: 'POST',
            body: JSON.stringify({
                post_id,
                answer_text
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
}

// listens for 'submit' event on button with the class 'answer-form'
document.querySelector('.answer-form').addEventListener('submit', answerFormHandler);