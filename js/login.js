$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

if(sessionStorage.getItem(btoa('auth')) != undefined) {
    window.location.href = 'index.html';
}

$('#loginBtn').click(function () {
    $(this).css('transform', 'rotate3d(1, 1, 1, 360deg)');

    setTimeout(() => {
        $(this).css('transform', 'rotate3d(1, 1, 1, 0deg)');
    }, 1200);

    let username = $('#usernameInp').val();
    let password = $('#passwordInp').val();
    let datas    = "Basic " + btoa(`${username}:${password}`);
    let alertError = $('.alert-danger');
    let alertSuccess = $('.alert-success');

    $.ajax({
        type: "GET",
        url: "http://localhost:8024/compshop/authentications/login",
        headers: {
            'Authorization': datas
        },
        success: function (response) {
            $(alertSuccess).attr('class' , 'alert alert-success alert-dismissible w-50 fade show d-block');
            sessionStorage.setItem(btoa('auth') , datas);

            setTimeout(() => {
                $(alertSuccess).attr('class' , 'alert alert-success alert-dismissible w-50 fade d-none');
                window.location.href = 'index.html';
            }, 1500);
        },
        error : function (error) {
            $(alertError).attr('class' , 'alert alert-danger alert-dismissible w-50 fade show d-block');

            setTimeout(() => {
                $(alertError).attr('class' , 'alert alert-danger alert-dismissible w-50 fade d-none');
            }, 2000);
        }
    });
});