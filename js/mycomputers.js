$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

if (sessionStorage.getItem(btoa('auth')) == undefined) {
    window.location.href = 'login.html';
}

const auth = sessionStorage.getItem(btoa('auth'));
const username = atob(auth.split(" ")[1]).split(':')[0];
var userId = null;
var sellerName = null;
var sellerPhone = null;

async function loadComputerDatas() {
    let userId = '';

    await $.ajax({
        type: "GET",
        url: paths.mainPath + paths.usersPath + `/${username}`,
        headers : {
            "Authorization" : auth
        },
        success: function (response) {
            userId = response.id;
        },
        error: function (error) {
            alert("Xəta!" + error.message);
        }
    });

    $.ajax({
        type: "GET",
        url: paths.mainPath + paths.computersPath + `/users/${userId}`,
        headers : {
            "Authorization" : auth
        },
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
                        <button class = 'btn btn-warning' data-toggle="modal" data-target="#computerModal" onclick = 'openComputerModal("update" , ${response[i].id})'>Redaktə et</button>
                    </td>
                </tr>`)
            }

        },
        error: function (error) {
            alert("Xəta!" + error.message);
        }
    });
}

async function addOrUpdateMethod(method, compId) {
    let brandInp = $('#brandInp').val();
    let modelInp = $('#modelInp').val();
    let priceInp = $('#priceInp').val();
    let contentInp = $('#contentInp').val();
    let newInp = $('#newInp').val();
    let imgInp = document.getElementById('imgInp').files[0];
    let ramInp = $('#ramInp').val();
    let cpuInp = $('#cpuInp').val();
    let dCapacityInp = $('#dCapacityInp').val();
    let dTypeInp = $('#dTypeInp').val();

    let alertError = $('.alert-danger');
    let alertSuccess = $('.alert-success');

    try {

        let computerRequest = {
            'brand': brandInp,
            'model': modelInp,
            'price': priceInp,
            'ram': ramInp,
            'cpu': cpuInp,
            'compNew': newInp,
            'content': contentInp,
            'diskCapacity': dCapacityInp,
            'diskType': dTypeInp,
            'sellerName': sellerName,
            'sellerPhone': sellerPhone,
            'userId': String(userId)
        }

        for (let i = 0; i < Object.keys(computerRequest).length; i++) {
            let element = Object.values(computerRequest)[i];
            if (element == null || element == undefined || element.trim() == "") throw new Error("Lütfən boş yer saxlamayın!");
        }

        if (method == 'add') {

            if (imgInp == undefined) throw new Error("Lütfən şəkli düzgün seçin!");

            let imgFormat = $(imgInp)[0].type;

            if (imgFormat == 'image/png' || imgFormat == 'image/gif'
                || imgFormat == 'image/jfif' || imgFormat == 'image/jpeg'
                || imgFormat == 'image/svg+xml' || imgFormat == 'image/webp') {
            } else throw new Error("Lütfən şəkli düzgün formatta seçin!");

            let formData = new FormData();
            formData.append("file", imgInp);

            computerRequest.image = await uploadImage(formData)

            await $.ajax({
                type: 'POST',
                url: paths.mainPath + paths.computersPath,
                data: JSON.stringify(computerRequest),
                headers : {
                    "Authorization" : auth
                },
                contentType: 'application/json',
                success: function (response) {
                    emptyInputs();
                },
                error: function (error) {
                    alert("Xəta!" + error.message);
                }
            });
        } else if (method == 'update') {
            
            if (imgInp == undefined) {
                computerRequest.image = $('#updateBtn').attr('data-path');
            } else {
                let formData = new FormData();
                formData.append("file", imgInp);
                computerRequest.image = await uploadImage(formData);
            }

            await $.ajax({
                type: 'PUT',
                url: paths.mainPath + paths.computersPath + `/${compId}`,
                data: JSON.stringify(computerRequest),
                headers : {
                    "Authorization" : auth
                },
                contentType: 'application/json',
                success: function (response) {
                    emptyInputs();
                },
                error: function (error) {
                    alert("Xəta!" + error.message);
                }
            });
        }

        $('#computerModal').modal('hide');

        loadComputerDatas();

        $(alertSuccess).attr('class', 'alert alert-success mt-2 w-50 fade show d-block');

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

async function uploadImage(formData) {

    let filePath = "";

    await $.ajax({
        type: "POST",
        url: paths.mainPath + paths.filePath,
        headers : {
            "Authorization" : auth
        },
        data: formData,
        processData: false,
        mimeType: 'multipart/form-data',
        contentType: false,
        success: function (response) {
            filePath = response;
        },
        error: function (error) {
            alert("Xəta!" + error.message);
        }
    });

    return filePath;
}

async function deleteComp(compId) {
    let confirmDel = confirm("Bu komputeri silmək istəyirsiniz ?");

    if (confirmDel) {

        $.ajax({
            type: "DELETE",
            url: paths.mainPath + paths.basketPath + `/computers/${compId}`,
            headers : {
                "Authorization" : auth
            },
            error: function (error) {
                alert("Xəta!" + error.message);
            }
        });

        await $.ajax({
            type: "DELETE",
            url: paths.mainPath + paths.computersPath + `/${compId}`,
            headers : {
                "Authorization" : auth
            },
            success: function (response) {
                window.location.reload();
            },
            error: function (error) {
                alert("Xəta!"+ error.message);
            }
        });
    }

}

function viewImg(clickedImg) {
    let imgPath = $(clickedImg).attr('src');
    $('#imgModal .modal-body').html(`<img src = '${imgPath}' width = '100%' height = '100%'>`);
}

async function openComputerModal(process, compId) {
    emptyInputs();

    if (process == 'add') {

        $('#imgFormGroup img').removeAttr('src');
        $('#imgFormGroup img').removeAttr('width');
        $('#imgFormGroup img').removeAttr('height');
        $('#computerModal .modal-title').html('Yeni Kompüter');
        $('#computerModal .modal-footer').html(`
            <div class="alert alert-danger w-50 fade d-none"></div>

            <button class="btn btn-success w-25" onclick="addOrUpdateMethod('add' , null)"><i class="fa-solid fa-circle-plus mr-1"></i> Əlavə
                et</button>
        `);

    } else if (process == 'update') {
        let imgPath = null;
        
        await $.ajax({
            type: "GET",
            url: paths.mainPath + paths.computersPath + `/${compId}`,
            headers : {
                "Authorization" : auth
            },
            success: function (response) {
                $('#brandInp').val(response.brand);
                $('#modelInp').val(response.model);
                $('#priceInp').val(response.price);
                $('#contentInp').val(response.content);
                $('#newInp').val(response.compNew);
                $('#ramInp').val(response.ram);
                $('#cpuInp').val(response.cpu);
                $('#dCapacityInp').val(response.diskCapacity);
                $('#dTypeInp').val(response.diskType);

                imgPath = response.image;
            },
            error: function (error) {
                alert("Xəta!" + error.message);
            }
        });

        $('#imgFormGroup img').attr('src' , imgPath);
        $('#imgFormGroup img').attr('width' , "50px");
        $('#imgFormGroup img').attr('height' , "50px");
        $('#computerModal .modal-title').html('Redaktə');
        $('#computerModal .modal-footer').html(`
            <div class="alert alert-danger w-50 fade d-none"></div>

            <button class="btn btn-success w-25" data-path = ${imgPath} id = 'updateBtn' onclick="addOrUpdateMethod('update',${compId})"><i class="fa-solid fa-plus i-update"></i> Yadda
                Saxla</button>
            
            <button class="btn btn-danger w-25" onclick="clearInputs()"><i class="fa-solid fa-beer-mug-empty i-update"></i> Məlumatları
                Sıfırla</button>
        `);
    }

}

function imgInpChanged() {
    let file = document.getElementById('imgInp').files[0];
    let imgPath = (window.URL || window.webkitURL).createObjectURL(file);
    $('#imgFormGroup img').attr('src' , imgPath);
}

async function exportTableToExcel() {
    let rsp = null;

    await $.ajax({
        type: "GET",
        url: paths.mainPath + paths.computersPath + `/users/${userId}`,
        headers : {
            "Authorization" : auth
        },
        success: function (response) {
            rsp = response;
        },
        error: function (error) {
            alert("Xəta!" + error.message);
        }
    });

    if (rsp.length == 0) {
        alert('Heç bir komputeriniz yoxdur!');
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

function getUserInfoByUsername() {
    $.ajax({
        type: "GET",
        url: paths.mainPath + paths.usersPath + `/${username}`,
        headers : {
            "Authorization" : auth
        },
        success: function (response) {
            userId = response.id;
            sellerPhone = response.phone;
            sellerName = response.name;
        },
        error: function (error) {
            alert("Xəta!" + error.message);
        }
    });
}

function emptyInputs() {
    $('#brandInp').val("");
    $('#modelInp').val("");
    $('#priceInp').val("");
    $('#contentInp').val("");
    document.getElementById('imgInp').value = "";
    $('#ramInp').val("");
    $('#cpuInp').val("");
    $('#dCapacityInp').val("");
    $('#dTypeInp').val("");
}


getUserInfoByUsername();
loadComputerDatas();