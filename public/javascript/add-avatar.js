const form = document.getElementById("avatar");

form.addEventListener("submit", submitAvatar);

function submitAvatar(e) {
    e.preventDefault();
    // const username = document.getElementById("username");
    const files = document.getElementById("avatarImage");
    // const files = document.getElementsByName('avatarImage');
    // console.log(files.files[0]);
    // console.log(files)
    const formData = new FormData();
    // formData.append("username", username.value)
    formData.append("files", files.files[0]);
    // console.log('formdData below');
    // console.log(formData.files);
    console.log('form data below');
    console.log(...formData)

    fetch('/api/users/avatar', {
        method: 'POST',
        body: formData,
        headers: {
            "Content-Type": undefined
        }
    })
    .then(res => res.text()).then(res => {
    console.log('res: ', res)
    }).catch(console.log)
    // .then(rawResp => console.log(rawResp))
    // .then((res) => console.log(res))
    // .catch((err) => ("Error occured", err));
}



// if (response.ok) {
//     document.location.replace('/dashboard');
// } else {
//     alert(response.statusText);
// }