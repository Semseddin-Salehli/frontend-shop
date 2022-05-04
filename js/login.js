$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

if(sessionStorage.getItem(btoa('auth')) != undefined) {
    window.location.href = 'index.html';
}

$('#loginBtn').click(function () {
    $(this).css('transform', 'scale(0.9)');

    setTimeout(() => {
        $(this).css('transform', 'scale(1)');
    }, 300);

    let username = $('#usernameInp').val();
    let password = $('#passwordInp').val();
    let datas    = "Basic " + btoa(`${username}:${password}`);
    let alertError = $('.alert-danger');
    let alertSuccess = $('.alert-success');

    $.ajax({
        type: "GET",
        url: paths.mainPath + paths.loginPath,
        headers: {
            'Authorization': datas
        },
        success: function (response) {
            $(alertSuccess).attr('class' , 'alert alert-success alert-dismissible w-50 fade show d-block');
            sessionStorage.setItem(btoa('auth') , datas);

            setTimeout(() => {
                $(alertSuccess).attr('class' , 'alert alert-success alert-dismissible w-50 fade d-none');
                window.location.href = 'index.html';
            }, 2000);
        },
        error : function (error) {
            $(alertError).attr('class' , 'alert alert-danger alert-dismissible w-50 fade show d-block');

            setTimeout(() => {
                $(alertError).attr('class' , 'alert alert-danger alert-dismissible w-50 fade d-none');
            }, 2500);
        }
    });
});

function passOpen(i) {
    $('#passwordInp').attr('type' , 'text');
    
    $(i).attr('class' , 'fa-solid fa-eye');
    $(i).attr('onclick' , `passClose(this)`);
}

function passClose(i) {
    $('#passwordInp').attr('type' , 'password');

    $(i).attr('class' , 'fa-solid fa-eye-slash');
    $(i).attr('onclick' , `passOpen(this)`);
}