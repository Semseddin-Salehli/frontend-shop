$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

function loadComputers() {
    $.ajax({
        type: "GET",
        url: paths.mainPath + paths.computersPath,
        success: function (response) {

            for (let i = 0; i < response.length; i++) {
                $('.container-fluid').append(`
                <div class="card">
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
            }



        },
        error: function (error) {
            console.log(error);
        }
    });
}

function viewCompDetails(compId) {

    $.ajax({
        type: "GET",
        url: paths.mainPath + paths.computersPath + `/${compId}`,
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
            console.log(error);
        }
    });

}

loadComputers();