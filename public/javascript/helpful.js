async function helpfulClickHandler(event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];
    // const helpfulButton = document.getElementsByClassName('helpful-btn');
    // console.log(helpfulButton);
    // const answer_id = helpfulButton.getAttribute('answer-id');

    // console.log(answer_id)
    

    // const button = document.querySelector('#helpful-btn');

    // answer_id = button.dataset.answerId

    const answer_id = this.dataset.answerId

    console.log(answer_id);

    // console.log(this);

    // console.log(button);

    const response = await fetch('/api/answers/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id,
            answer_id: answer_id
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

// document.querySelector('.helpful-btn').addEventListener('click', helpfulClickHandler);

btns = document.getElementsByClassName('helpful-btn');

for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', helpfulClickHandler);
}