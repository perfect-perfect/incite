async function helpfulClickHandler(event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    const answer_id = this.dataset.answerId

    console.log(answer_id);

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


// gets all the helpful buttons and places them in an array
btns = document.getElementsByClassName('helpful-btn');
// for loop assigns an event listener to every helpful button in the btns array.
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', helpfulClickHandler);
}