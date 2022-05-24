$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

if (sessionStorage.getItem(btoa('auth')) == undefined) {
    window.location.href = 'login.html';
}

const auth = sessionStorage.getItem(btoa('auth'));

function loadComputers() {
    $('.loader').remove();
    $('.container-fluid').css('background-image', 'linear-gradient(to left bottom, #dd01ff, #e600c5, #de0092, #cb0069, #b10649)')

    $.ajax({
        type: "GET",
        url: paths.mainPath + paths.computersPath,
        headers: {
            "Authorization" : auth
        },
        success: function (response) {

            for (let i = 0; i < response.length; i++) {
                $('.container-fluid').append(`
                <div class="card" id = 'card${response[i].id}'>
                    <img class="card-img-top" src="${response[i].image}">
                    <div class="card-body">
                        <p class="card-text">
                            <span class="badge badge-info">Marka</span> : <span>${response[i].brand}</span><br>
                            <span class="badge badge-info">Təsvir</span> : <span>${response[i].content}</span><br>
                            <span class="badge badge-info">Qiymət</span> : <span>${response[i].price} AZN</span><br>
                            <span class="badge badge-info">Yeni</span> : <span>${response[i].compNew}</span>
                        </p>
                        <button class="btn btn-primary" data-toggle="modal" data-target="#compModal" onclick = 'viewCompDetails(${response[i].id})'>Ətraflı</button>
                    </div>
                </div>
                `);

                let authUsername = null;

                if (sessionStorage.getItem(btoa('auth')) != undefined) {
                    authUsername = atob(sessionStorage.getItem(btoa('auth')).split(' ')[1]).split(':')[0];
                }

                if (authUsername != null) {

                    if (authUsername != response[i].user.username) {
                        $(`#card${response[i].id} .card-body`).append(`<button class = 'btn btn-success' onclick = 'addBasket(${response[i].id} , this)'>Səbətə at</button>`)
                    } else {
                        $(`#card${response[i].id}`).prepend("<span class = 'badge badge-light yoursTag'>SİZİNDİR</span>");
                        $(`#card${response[i].id}`).css('background-color', '#e28743')
                    }

                } else {
                    $(`#card${response[i].id} .card-body`).append(`<button class = 'btn btn-success' onclick = 'addBasket(${response[i].id} , this)'>Səbətə at</button>`);
                }

            }

        },
        error: function (error) {
            alert("Xəta!" + error.message);
        }
    });
}

var userId = null;

function getUserIdByUsername() {

    let username = atob(sessionStorage.getItem(btoa('auth')).split(" ")[1]).split(':')[0]

    $.ajax({
        type: "GET",
        url: paths.mainPath + paths.usersPath + `/${username}`,
        headers: {
            "Authorization" : auth
        },
        success: function (response) {
            userId = response.id;
        },
        error: function (error) {
            alert("Xəta!" + error.message);
        }
    });

}

async function getBasketsByUserId() {
    let data = null;

    await $.ajax({
        type: "GET",
        url: paths.mainPath + paths.basketPath + `/users/${userId}`,
        headers: {
            "Authorization" : auth
        },
        success: function (response) {
            data = response;
        },
        error: function (error) {
            alert("Xəta!" + error.message);
        }
    })
    return data;
}

async function loadBasketInf() {
    let table = $('#tableBody');
    let responseBaskets = await getBasketsByUserId();
    $(table).html(``);

    if (responseBaskets != undefined) {
        for (let i = 0; i < responseBaskets.length; i++) {
            $(table).append(`
        <tr>
            <td>${responseBaskets[i].computer.content}</td>
            <td><img src = '${responseBaskets[i].computer.image}' width = '50px' height = '35px'></td>
            <td>${responseBaskets[i].computer.price} AZN</td>
            <td id = 'inpTd${responseBaskets[i].id}'><input type = 'number' value = '${responseBaskets[i].quantity}' min = '1' id = 'inp${responseBaskets[i].id}' onchange = "inpChanged('${responseBaskets[i].id}' , '${responseBaskets[i].computer.id}' , 'inp${responseBaskets[i].id}')"></td>
            <td id = 'process${responseBaskets[i].id}'>
                <button class = 'btn btn-lg btn-danger' onclick = 'deleteBasketById(${responseBaskets[i].id})'>Sil</button>
            </td>
        </tr>
    `);
        }
    }
}

function addBasket(compId, thiss) {

    let datas = {
        "compId": String(compId),
        "userId": String(userId),
        "quantity": "1"
    }

    $.ajax({
        type: "POST",
        url: paths.mainPath + paths.basketPath,
        data: JSON.stringify(datas),
        headers : {
            "Authorization" : auth
        },
        contentType: 'application/json',
        success: function (response) {
            basketNumber();
        },
        error: function (error) {
            alert("Xəta!" + error.message);
        }
    });

    $(thiss).html('Əlavə olundu!');
    $(thiss).attr('class', 'btn btn-primary');
    $(thiss).attr('onclick', '');

    setTimeout(() => {
        $(thiss).html('Səbətə at');
        $(thiss).attr('class', 'btn btn-success');
        $(thiss).attr('onclick', `addBasket(${compId} , this)`);
    }, 1000);
}

async function deleteBasketById(id) {
    let checking = confirm('Bu komputeri səbəttən silmək istəyirsiniz ?');

    if (checking) {

        await $.ajax({
            type: "DELETE",
            url: paths.mainPath + paths.basketPath + `/${id}`,
            headers: {
                "Authorization" : auth
            },
            success: function (response) {
                basketNumber();
            },
            error: function (error) {
                alert("Xəta!" + error.message);
            }
        });

        loadBasketInf();
    }

}

function emptyBasket() {
    let checking = confirm('Səbəti təmizləmək istəyirsiniz ?');

    if (checking) {
        deleteAllBasketsByUserId();
    }
}

async function applyBasket() {
    let baskets = await getBasketsByUserId();
    
    if(baskets.length < 1) {
        alert('Sizin səbətdə komputeriniz yoxdur!');
        return;
    }

    for (let i = 0; i < baskets.length; i++) {
        
        let orderRequest = {
            "compBrand" : baskets[i].computer.brand,
            "compModel" : baskets[i].computer.model,
            "compContent" : baskets[i].computer.content,
            "price" : baskets[i].computer.price,
            "buyerName" : baskets[i].user.name,
            "buyerSurname" : baskets[i].user.surname,
            "buyerPhone" : baskets[i].user.phone,
            "quantity" : baskets[i].quantity,
            "sellerId" : baskets[i].computer.user.id
        }
    
        $.ajax({
            type: "POST",
            url: paths.mainPath + paths.ordersPath,
            data: JSON.stringify(orderRequest),
            headers: {
                "Authorization" : auth
            },
            contentType : "application/json",
            success: function (response) {
                
            },
            error: function (error) {
                alert("Xəta!" + error.message);
            }
        });
    }

    deleteAllBasketsByUserId();
    
}

function deleteAllBasketsByUserId() {
    $.ajax({
        type: "DELETE",
        url: paths.mainPath + paths.basketPath + `/users/${userId}`,
        headers : {
            "Authorization" : auth
        },
        success: function (response) {
            loadBasketInf();
            $('#basketModal').modal('hide');
            $('#basketNumber').html('0');
        },
        error: function (error) {
            alert("Xəta!" + error.message);
        }
    });
}

function updateBasket(basketId, compId, thisInputId) {

    let quantity = document.getElementById(thisInputId).value;

    let datas = {
        "userId": userId,
        "compId": compId,
        "quantity": quantity
    }

    $.ajax({
        type: "PUT",
        url: paths.mainPath + paths.basketPath + `/${basketId}`,
        data: JSON.stringify(datas),
        headers: {
            "Authorization" : auth
        },
        contentType: 'application/json',
        success: function (response) {
            loadBasketInf();
        },
        error: function (error) {
            alert("Xəta!" + error.message)
        }
    });
}

function basketNumber() {
    $.ajax({
        type: "GET",
        url: paths.mainPath + paths.basketPath + `/users/${userId}`,
        headers: {
            "Authorization" : auth
        },
        success: function (response) {
            $('#basketNumber').html(response.length)
        },
        error: function (error) {
            alert("Xəta!" + error.message);
        }
    });
}

function viewCompDetails(compId) {

    $.ajax({
        type: "GET",
        url: paths.mainPath + paths.computersPath + `/${compId}`,
        headers: {
            "Authorization" : auth
        },
        success: function (response) {

            $('.modal-body').html(`
                <img src="${response.image}"><br>

                <span class="badge badge-primary">Marka : </span> <span>${response.brand}</span><br>
                <span class="badge badge-primary">Model : </span> <span>${response.model}</span><br>
                <span class="badge badge-primary">Təsvir : </span> <span>${response.content}</span><br>
                <span class="badge badge-primary">Qiymət : </span> <span>${response.price} AZN</span><br>
                <span class="badge badge-primary">Telefon : </span> <span>${response.sellerPhone}</span><br>
                <span class="badge badge-primary">Yeni : </span> <span>${response.compNew}</span><br>
                <span class="badge badge-primary">Əməli Yaddaş : </span> <span>${response.ram}</span><br>
                <span class="badge badge-primary">Cpu : </span> <span>${response.cpu}</span><br>
                <span class="badge badge-primary">Daimi Yaddaş : </span> <span>${response.diskCapacity}</span>
    `);
        },
        error: function (error) {
            alert("Xəta!" + error.message);
        }
    });

}

function inpChanged(basketId, compId, thisInputId) {
    let processTd = document.getElementById(`process${basketId}`);
    let isExist = processTd.contains(document.getElementById("updateBtn"));

    if (!isExist) {
        processTd.innerHTML = `
            <button class = 'btn btn-lg btn-danger' onclick = 'deleteBasketById(${basketId})'>Sil</button>
            <button class = 'btn btn-lg btn-info' id = 'updateBtn' onclick = "updateBasket('${basketId}' , '${compId}' , '${thisInputId}')">Yadda Saxla</button>
        `;
    }

}

setTimeout(() => {
    loadComputers();
}, 2000);

getUserIdByUsername();

setTimeout(() => {
    basketNumber();
}, 500);