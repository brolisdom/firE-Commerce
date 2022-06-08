// rutas de backend
const get_articles = "https://backend-tarea12.azurewebsites.net/api/get_articles?code=b_dePz2ZScaq-lMdl9kE5GrlxhdiE5QSI-l5CVmbD0Q6AzFuKAUuVQ==";
const create_article = "https://backend-tarea12.azurewebsites.net/api/create_article?code=HebbuXRgdK-DvxSlachQVHvHJkWSzXcUtIirt4zX_Ce2AzFuw4Rxrg==";
const update_article = "https://backend-tarea12.azurewebsites.net/api/update_article?code=hZtNkxJjQCSphF72GIgSOwguY0mPFPNYgYTgoveBNmYwAzFuqrcqNA==";
const delete_article = "https://backend-tarea12.azurewebsites.net/api/delete_article?code=vFiPfQcNgzQAiABP_lxrqo1xPdZ89ldPYITRfgi742Q5AzFuuP7xXg==";

// no requiere backend
const addOne = (id) => {
    const items = document.getElementById(id);
    var actual = parseInt(items.innerHTML);
    items.innerHTML = actual + 1;
}

const subOne = (id) => {
    const items = document.getElementById(id);
    var actual = parseInt(items.innerHTML);
    if (actual > 1) items.innerHTML = actual - 1;
}

const uploadItem = () => {
    document.getElementById("descripcion").value = '';
    document.getElementById("precio").value = '';
    document.getElementById("stock").value = '';
    document.getElementById('carga-tab').click();
}

const viewCar = () => {
    var str = '';
    var element = document.getElementById("lista-carrito");
    element.innerHTML = str;
    var flag = false;
    all_items.forEach(item => {
        if (item.carrito != 0) {
            flag = true;
            str = `
                <div class="card m-2" style="width: 18rem;">
                    <img src="${item.imagen || imagen}" class="img-fluid">
                    <div class="card-body">
                        <h5 class="card-title">${item.descripcion}</h5>
                        <p class="card-text">Precio: ${item.precio}</p>
                        <p class="card-text">Cantidad: ${item.carrito}</p>
                        <p class="card-text">Total a pagar: ${item.precio*parseInt(item.carrito)}</p>
                        <a class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Eliminar</i></a>
                    </div>
                </div>
            `;
            element.insertAdjacentHTML('beforeend', str);
        }
    });
    if (flag) str = '<button class="btn btn-link" type="button" onclick="deleteAll()">Vaciar carrito</button>';
    else str = 'Al parecer no hay ningún articulo en tu carrito';
    element.insertAdjacentHTML('beforeend', str);
    document.getElementById('carrito-tab').click();
}

// requiere backend
const addItem = () => {
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const stock = document.getElementById("stock").value;
    if (descripcion && precio > 0 && stock > 0) {
        const id = all_items.length + 1;
        const ruta = create_article+"&id="+id+"&descripcion="+descripcion+"&precio="+precio+".00&stock="+stock+"&carrito=0"; 
        fetch(ruta, { method:'POST' })
        .then(res => { showItems('Se ha agregado un nuevo item al comercio') })
        .catch((error) => { console.log(error) });
    } else {
        alert('Asegurate de haber llenado correctamente los campos');
    }
}

const addToCar = (id) => {
    const wanted = parseInt(document.getElementById(id).innerHTML);
    const item = all_items.find(e => e.id == id);
    const total = parseInt(item.stock)-wanted;
    if (total >= 0) {
        const carro = parseInt(item.carrito)+wanted;
        const ruta = update_article+"&id="+id+"&stock="+total+"&carrito="+carro; 
        fetch(ruta, { method:'POST' })
        .then(res => { showItems('Se ha actualizado el carrito de compras') })
        .catch((error) => { console.log(error) });
    } else {
        alert('Solo se cuenta con ' + item.stock + ' unidades de este artículo');
    }
}

const deleteAll = () => {
    if (confirm('¿Estas seguro de vaciar todo tu carrito?')) {
        fetch(delete_article)
        .then(res => { showItems('Se han eliminado todos los items del carrito') })
        .catch((error) => { console.log(error) });
    }
}

const deleteItem = (id) => {
    if (confirm('¿Estas seguro de eliminar este artículo?')) {
        fetch(delete_article+"&id="+id)
        .then(res => { showItems('Se ha eliminado el item del carrito') })
        .catch((error) => { console.log(error) });
    }
}

const showItems = (title='') => {
    var ruta = get_articles;
    const search = document.getElementById("search").value;
    if (search) ruta += '&descripcion='+search;
    fetch(ruta)
    .then(response => response.json())
    .then(items => {
        var str = '';
        var element = document.getElementById("lista");
        element.innerHTML = str;
        items.forEach(item => {
            if (item.stock > 0) var color = 'primary';
            else var color = 'secondary';
            str = `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div class="d-flex">
                        <img src=${item.imagen || imagen} height="75px">
                        <div class="mx-3">
                            ${item.descripcion}<br>
                            Precio: ${item.precio}<br>
                            <span class="badge bg-${color} rounded-pill">
                                Stock: <span>${item.stock}</span>
                            </span>
                        </div>
                    </div>
                    <div>
                        <div class="btn-group mt-1">
                            <button type="button" class="btn btn-secondary btn-sm" onclick="subOne(${item.id})">-</button>
                            <button type="button" class="btn btn-secondary btn-sm px-1" disabled id="${item.id}">1</button>
                            <button type="button" class="btn btn-secondary btn-sm" onclick="addOne(${item.id})">+</button>
                        </div>
                        <br>
                        <button type="button" class="btn btn-link btn-sm" onclick="addToCar(${item.id})">Comprar</button>
                    </div>
                </li>
            `;
            element.insertAdjacentHTML('beforeend', str);
        });
        all_items = items;
        document.getElementById('compra-tab').click();
        if (title) {
            const span = document.getElementById("title");
            span.textContent = title;
            const alert = document.querySelector('.toast');
            const bsAlert = new bootstrap.Toast(alert);
            bsAlert.show();
        }
    });
}

// funcion inicial
var all_items = [];
const imagen = "/assets/test.jpg";
window.onload = (event) => {
    showItems();
}
