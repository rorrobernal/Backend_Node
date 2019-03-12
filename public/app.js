let URL_BASE = 'http://localhost:8000';
let API = "/api/v1/";
let PROPIEDADES = 'propiedades';
let CIUDADES = 'ciudades';
let TIPOS = 'tipos';

let ciudadSeleccionada = 'Escoge una ciudad';
let tipoSeleccionado = 'Escoge un tipo';
let precioInicial = 1000;
let precioFinal = 20000;

//Inicializador del elemento Slider
$("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 100000,
    from: 1000,
    to: 20000,
    prefix: "$",
    onFinish: (data) => {
        precioInicial = data.from;
        precioFinal = data.to;

        actualizarListadoPropiedades();
    }
});

function actualizarListadoPropiedades(){
    $('#lista_propiedades').empty();

    $.get(URL_BASE + API + PROPIEDADES, {ciudad: ciudadSeleccionada, tipo: tipoSeleccionado,
        precioInicial: precioInicial, precioFinal: precioFinal})
        .done((data) => {
            let propiedades = JSON.parse(data);

            $.each(propiedades, (idx, val) =>{
                generarCard(val);
            });
        });
}

function setSearch() {

    $.get(URL_BASE + API + CIUDADES, {})
        .done((data) => {
            let ciudades = JSON.parse(JSON.stringify((data)));

            $.each(ciudades, (idx, val) => {
                let option = $('<option>', {'value': val});
                $(option).text(val);

                $('#ciudad').append(option);
            });
        });

    $.get(URL_BASE + API + TIPOS, {})
        .done((data) => {
            let tipos = JSON.parse(JSON.stringify((data)));

            $.each(tipos, (idx, val) => {
                let option = $('<option>', {'value': val});
                $(option).text(val);

                $('#tipo').append(option);
            });
        });

    let busqueda = $('#checkPersonalizada');
    busqueda.on('change', (e) => {
        if (this.customSearch === false) {
            this.customSearch = true;
            $('#ciudad').css('display', 'none');
            $('#tipo').css('display', 'none ');
            listarPropiedades();
        } else {
            this.customSearch = false;
            $('#ciudad').css('display', 'block');
            $('#tipo').css('display', 'block');
            actualizarListadoPropiedades();
        }
        $('#personalizada').toggleClass('invisible')
    });

    $('#ciudad').change(() => {
        ciudadSeleccionada = $('#ciudad option:selected').val();

        actualizarListadoPropiedades();
    });

    $('#tipo').change(() => {
        tipoSeleccionado = $('#tipo option:selected').val();

        actualizarListadoPropiedades();
    });

    $('#buscar').click(() => {
        listarPropiedades();
    });
}

function listarPropiedades(){
    $('#lista_propiedades').empty();

    $.get(URL_BASE + API + PROPIEDADES, {})
        .done((data) => {
            let propiedades = JSON.parse(JSON.stringify((data)));

            $.each(propiedades, (idx, val) =>{
                generarCard(val);
            });
        });
}

function generarCard(propiedad){
    let tplCard = `<div class='card horizontal'>
          <div class='card-image'>
            <img src='img/home.jpg'>
          </div>
          <div class='card-stacked'>
            <div class='card-content'>
              <div>
                <b>Direccion: ${propiedad.Direccion}</b><p></p>
              </div>
              <div>
                <b>Ciudad: ${propiedad.Ciudad}</b><p></p>
              </div>
              <div>
                <b>Telefono: ${propiedad.Telefono}</b><p></p>
              </div>
              <div>
                <b>Código postal: ${propiedad.Telefono}</b><p></p>
              </div>
              <div>
                <b>Precio: ${propiedad.Precio}</b><p></p>
              </div>
              <div>
                <b>Tipo: ${propiedad.Tipo}</b><p></p>
              </div>
            </div>
            <div class='card-action right-align'>
              <a href='#'>Ver más</a>
            </div>
          </div>
        </div>`;

    $('#lista_propiedades').append(tplCard);
}

setSearch();
