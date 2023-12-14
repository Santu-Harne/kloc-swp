const resetPasswordTemplate = (token) => {
    return `<div>
        <h1>Hi, Welcome to KLOC-SWP</h1>
        <article style="margin:auto; object-fit:cover;">
            <img src="https://media.istockphoto.com/id/1321309032/vector/change-password-linear-icon-password-reset-line-icon-circular-arrow-lock-reload-concept.jpg?s=612x612&w=0&k=20&c=t6WjVPvwwyJ8b3ttJjRisSuNKCUqRohNierufmezWn8=" width="300" height="300"/>
            <h4>To reset your password click below link</h4>
            <a href="http://localhost:3000/auth/resetPassword/${token}">Reset Password</a>
        </article>
    </div>`
}

module.exports = resetPasswordTemplate
