$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

if (sessionStorage.getItem(btoa('auth')) != undefined) {
    window.location.href = 'index.html';
}

$('.btnRegister').click(function () {
    let username = $('#usernameInp').val();
    let password = $('#passwordInp').val();
    let rePassword = $('#rePasswordInp').val();
    let email = $('#emailInp').val();
    let phone = $('#phoneInp').val();
    let name = $('#nameInp').val();
    let surname = $('#surnameInp').val();

    let alertSuccess = $('.alert-success');
    let alertError = $('.alert-danger');

    const datas = {
        "username": username,
        "password": password,
        "email": email,
        "phone": phone,
        "name": name,
        "surname": surname
    }

    let inpControlElements = { username, password, rePassword, email, phone, name, surname };

    try {
        for (let i = 0; i < Object.keys(inpControlElements).length; i++) {
            let element = Object.values(inpControlElements)[i];

            if (element == undefined || element.trim() == "")
                throw new Error('Lüftən məlumatları düzgün daxil edin!')
        }

        if (password != rePassword) throw new Error('Şifrələr fərqli ola bilməz!');

        $.ajax({
            type: "POST",
            url: paths.mainPath + paths.usersPath,
            data: JSON.stringify(datas),
            contentType: "application/json",
            
            success: function (response) {
                $(alertSuccess).attr('class', 'alert alert-success w-50 fade show d-block');

                setTimeout(() => {
                    $(alertSuccess).attr('class', 'alert alert-success w-50 fade d-none');
                    window.location.href = 'login.html';
                }, 2500);

            },

            error: function (xhr) {
                if (xhr.status == 400) {
                    $(alertError).html('<strong>Xəta! </strong>Bu istifadəçi adı mövcuddur!');

                    $(alertError).attr('class', 'alert alert-danger w-50 fade show d-block');

                    setTimeout(() => {
                        $(alertError).attr('class', 'alert alert-danger w-50 fade d-none');
                    }, 2500);
                }
            }
        });

    } catch (err) {
        $(alertError).html(`<strong>Xəta! </strong>${err.message}`);

        $(alertError).attr('class', 'alert alert-danger w-50 fade show d-block');

        setTimeout(() => {
            $(alertError).attr('class', 'alert alert-danger w-50 fade d-none');
        }, 2500);
    }

});

function passOpen(value , i) {
    if(value == 'first') {
        $('#passwordInp').attr('type' , 'text');
    } else if(value == 'second') {
        $('#rePasswordInp').attr('type' , 'text');
    }

    $(i).attr('class' , 'fa-solid fa-eye');
    $(i).attr('onclick' , `passClose("${value}" , this)`);
}

function passClose(value , i) {
    if(value == 'first') {
        $('#passwordInp').attr('type' , 'password');
    } else if(value == 'second') {
        $('#rePasswordInp').attr('type' , 'password');
    }
    
    $(i).attr('class' , 'fa-solid fa-eye-slash');
    $(i).attr('onclick' , `passOpen("${value}" , this)`);
}