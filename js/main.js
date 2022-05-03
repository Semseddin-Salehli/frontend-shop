$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

if(sessionStorage.getItem(btoa('auth')) !=undefined) {
    $('.navLoginBtn').css('display' , 'none');
    $('.navExitBtn').css('display' , 'block');

    let username = atob(sessionStorage.getItem(btoa('auth')).split(' ')[1]).split(':')[0]

    $('.usernameText').html(username);
} else {
    $('.navLoginBtn').css('display' , 'block');
    $('.navExitBtn').css('display' , 'none');
}

function exit() {
    sessionStorage.removeItem(btoa('auth'));
    window.location.href = 'index.html';
}