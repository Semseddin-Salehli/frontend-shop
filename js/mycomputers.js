$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

if (sessionStorage.getItem(btoa('auth')) == undefined) {
    window.location.href = 'login.html';
}

const auth = sessionStorage.getItem(btoa('auth'));
const username = atob(auth.split(" ")[1]).split(':')[0];

async function loadComputerDatas() {
    let userId = '';

    await $.ajax({
        type: "GET",
        url: paths.mainPath + paths.usersPath + `/${username}`,
        success: function (response) {
            userId = response.id;
        },
        error: function (error) {
            console.log(error);
        }
    });


    $.ajax({
        type: "GET",
        url: paths.mainPath + paths.computersPath + `/${userId}`,
        success: function (response) {
            let table = $('#tableBody');
            table.html('');

            for (let i = 0; i < response.length; i++) {

                table.append(`<tr>
                    <td>${response[i].id}</td>
                    <td>${response[i].brand}</td>
                    <td><img onclick = "viewImg(this)" data-toggle="modal" data-target="#imgModal" style = 'cursor : pointer' src = '${response[i].image}' width = '50px' height = '35px'></td>
                    <td>${response[i].price}</td>
                    <td><button class = 'btn btn-danger' onclick = 'deleteComp(${response[i].id})'>Sil</button> 
                        <button class = 'btn btn-warning' onclick = 'updateComp(${response[i].id})'>Redaktə et</button>
                    </td>
                </tr>`)
            }

        },
        error: function (error) {
            console.log(error);
        }
    });
}

async function addComp() {
    let brandInp = $('#brandInp').val();
    let modelInp = $('#modelInp').val();
    let priceInp = $('#priceInp').val();
    let contentInp = $('#contentInp').val();
    let newInp = $('#newInp').val();
    let imgInp = $('#imgInp');
    let ramInp = $('#ramInp').val();
    let cpuInp = $('#cpuInp').val();
    let dCapacityInp = $('#dCapacityInp').val();
    let dTypeInp = $('#dTypeInp').val();
    let sellerPhone = null;
    let sellerName = null;
    let userId = null;

    await $.ajax({
        type: "GET",
        url: paths.mainPath + paths.usersPath + `/${username}`,
        success: function (response) {
            userId = response.id;
            sellerPhone = response.phone;
            sellerName = response.name;
        },
        error: function (error) {
            console.log(error);
        }
    });

    let computerRequest = {
        "brand": brandInp,
        "model": modelInp,
        "price": priceInp,
        "ram": ramInp,
        "cpu": cpuInp,
        "compNew": newInp,
        "content": contentInp,
        "diskCapacity": dCapacityInp,
        "diskType": dTypeInp,
        "sellerName": sellerName,
        "sellerPhone": sellerPhone,
        "userId": String(userId)
    }

    let alertError = $('.alert-danger');
    let alertSuccess = $('.alert-success');

    try {
        for (let i = 0; i < Object.keys(computerRequest).length; i++) {
            let element = Object.values(computerRequest)[i];
            if (element == null || element == undefined || element.trim() == "") throw new Error("Lütfən boş yer saxlamayın!");
        }

        if (imgInp.val() == "") throw new Error("Lütfən şəkli düzgün seçin!");

        let imgFormat = $(imgInp).val();

        if (imgFormat.endsWith('png') || imgFormat.endsWith('gif') || imgFormat.endsWith('pjp')
            || imgFormat.endsWith('jpg')
            || imgFormat.endsWith('pjpeg') || imgFormat.endsWith('jpeg') || imgFormat.endsWith('jfif')
            || imgFormat.endsWith('svgz') || imgFormat.endsWith('svg') || imgFormat.endsWith('webp')) {
        } else throw new Error("Lütfən şəkli düzgün formatta seçin!");


        let compId = "";

        await $.ajax({
            type: "POST",
            url: paths.mainPath + paths.computersPath,
            data: JSON.stringify(computerRequest),
            contentType: 'application/json',
            success: function (response) {
                compId = response;
            },
            error: function (error) {
                console.log(error);
            }
        });

        await $.ajax({
            type: "PUT",
            url: paths.mainPath + paths.filePath + `/computers/${compId}`,
            data: imgInp,
            Headers : {
                'Content-Type' : 'multipart/form-data'
            },
            success: function (response) {
                console.log(response);
            },
            error: function (error) {
                console.log(error);
            }
        });

        $(alertSuccess).attr('class', 'alert alert-success w-50 fade show d-block');

        setTimeout(() => {
            $(alertSuccess).attr('class', 'alert alert-success w-50 fade d-none');
        }, 3000);

    } catch (err) {
        $(alertError).html(`<strong>Xəta! </strong>${err.message}`);

        $(alertError).attr('class', 'alert alert-danger w-50 fade show d-block');

        setTimeout(() => {
            $(alertError).attr('class', 'alert alert-danger w-50 fade d-none');
        }, 3000);
    }

}

function deleteComp(compId) {
    let confirmDel = confirm("Bu komputeri silmək istəyirsiniz ?");

    if (confirmDel) {
        $.ajax({
            type: "DELETE",
            url: paths.mainPath + paths.computersPath + `/${compId}`,
            success: function (response) {
                window.location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

}

function viewImg(clickedImg) {
    let imgPath = $(clickedImg).attr('src');
    $('#imgModal .modal-body').html(`<img src = '${imgPath}' width = '100%' height = '100%'>`);
}

function exportTableToExcel() {
    let table2excel = new Table2Excel();
    let table = $('.table');
    let fileName = prompt('Faylın adı :');

    if (fileName == null || fileName == undefined || fileName.trim() == "") {
        return;
    }

    table2excel.export(table, fileName);
}

loadComputerDatas();