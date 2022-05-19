$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

if (sessionStorage.getItem(btoa('auth')) == undefined) {
    window.location.href = 'login.html';
}

const auth = sessionStorage.getItem(btoa('auth'));
const username = atob(auth.split(" ")[1]).split(':')[0];
var userId = null;

async function loadOrder() {
    let tBody = document.getElementsByTagName('tbody');
    $(tBody).html('');

    await $.ajax({
        type: "GET",
        url: paths.mainPath + paths.usersPath + `/${username}`,
        success: function (response) {
            userId = response.id
        },
        error: function (error) {
            console.log(error);
        }
    });

    $.ajax({
        type: "GET",
        url: paths.mainPath + paths.ordersPath + `/users/${userId}`,
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                $(tBody).append(`
                    <tr>
                        <td>${response[i].id}</td>
                        <td>${response[i].compBrand}</td>
                        <td>${response[i].compModel}</td>
                        <td>${response[i].price}</td>
                        <td>${response[i].quantity}</td>
                        <td>${response[i].buyerName}</td>
                        <td>${response[i].buyerSurname}</td>
                        <td>${response[i].buyerPhone}</td>
                    </tr>
                `);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

async function exportTableToExcel() {
    let rsp = null;

    await $.ajax({
        type: "GET",
        url: paths.mainPath + paths.ordersPath + `/users/${userId}`,
        success: function (response) {
            rsp = response;
        },
        error: function (error) {
            console.log(error);
        }
    });

    if(rsp.length == 0) {
        alert('Heç bir sifarişiniz yoxdur!');
        return;
    }


    let table2excel = new Table2Excel();
    let table = $('.table');
    let fileName = prompt('Faylın adı :');

    if (fileName == null || fileName == undefined || fileName.trim() == "") {
        return;
    }

    table2excel.export(table, fileName);
}

loadOrder();