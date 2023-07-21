// declarar variables de mapa base street
const servidorGeoserver = "http://localhost:8080/geoserver/";
let ofertaUbicada;

var mymap = L.map("mapid").setView([3.42, -76.5221987], 13);

const ruta = `${servidorGeoserver}ofertas_cali/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ofertas_cali%3Aofertas_cali&outputFormat=application%2Fjson`;

const traerDatosJSON = async (url) => {
  const response = await (await fetch(url)).json();
  return response;
};
const APIEliminaOferta = async (url) => {
  const response = await (
    await fetch(url, {
      method: "DELETE", // or 'PUT'
    })
  ).json();
  return response;
};
const APIEditarOferta = async (url) => {
  const response = await (
    await fetch(url, {
      method: "POST", // or 'PUT'
    })
  ).json();
  return response;
};

var s_light_style = {
  radius: 6,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};

var s_light_style_consulta = {
  radius: 5,
  fillColor: "#38761d",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};

var s_light_style_mio = {
  radius: 7,
  fillColor: "#004444",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};

var street = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

var basemaps = {
  //Grayscale: gray,
  Streets: street,
};

// declarar variables de cada capa

/* var wms_educacion = L.tileLayer.wms(`${servidorGeoserver}ofertas_cali/wms`, {
  layers: "ofertas_cali:educacion",
  format: "image/png",
  transparent: true,
});

var wms_cultura = L.tileLayer.wms(`${servidorGeoserver}ofertas_cali/wms`, {
  layers: "ofertas_cali:cultura",
  format: "image/png",
  transparent: true,
});

var wms_recreacion = L.tileLayer.wms(`${servidorGeoserver}ofertas_cali/wms`, {
  layers: "ofertas_cali:recreacion",
  format: "image/png",
  transparent: true,
});

var wms_salud = L.tileLayer.wms(`${servidorGeoserver}ofertas_cali/wms`, {
  layers: "ofertas_cali:salud",
  format: "image/png",
  transparent: true,
});

var wms_culto = L.tileLayer.wms(`${servidorGeoserver}ofertas_cali/wms`, {
  layers: "ofertas_cali:culto",
  format: "image/png",
  transparent: true,
}); */

var wms_comunas = L.tileLayer.wms(`${servidorGeoserver}ofertas_cali/wms`, {
  layers: "ofertas_cali:comunas",
  format: "image/png",
  transparent: true,
});

/* var wms_deporte = L.tileLayer.wms(`${servidorGeoserver}ofertas_cali/wms`, {
  layers: "ofertas_cali:deporte",
  format: "image/png",
  transparent: true,
});

var wms_estaciones_mio = L.tileLayer.wms(
  `${servidorGeoserver}ofertas_cali/wms`,
  {
    layers: "ofertas_cali:estaciones_mio",
    format: "image/png",
    transparent: true,
  }
); */
let ofertas;

// crear el grupo de capas

var groupedOverlays = {
  Comunas: wms_comunas,
};

//boton de prender capas
var layerControl = L.control.layers(basemaps, groupedOverlays).addTo(mymap);

let markers = L.markerClusterGroup();

traerDatosJSON(ruta).then((data) => {
  ofertas = new L.GeoJSON(data, {
    onEachFeature: (feature, layer) => {
      layer.setStyle({
        color: "black",
        weight: 1.9,
      });
      layer.bindPopup(
        '<h4 class = "text-primary">Inmuebles</h4>' +
          '<div class="container"><table class="table table-striped">' +
          "<thead><tr><th>Propiedad</th><th>Valor</th></tr></thead>" +
          "<tbody><tr><td> Barrio </td><td>" +
          feature.properties.barrio +
          "</td></tr>" +
          "<tr><td>Comuna </td><td>" +
          feature.properties.comuna +
          "</td></tr>" +
          "<tr><td> Tipo de inmueble </td><td>" +
          feature.properties.inmueble +
          "</td></tr>" +
          "<tr><td> Tipo de oferta </td><td>" +
          feature.properties.tipo_ofert +
          "</td></tr>" +
          "<tr><td> Estrato </td><td>" +
          feature.properties.estrato +
          "</td></tr>" +
          "<tr><td> Acabados </td><td>" +
          feature.properties.acabados +
          "</td></tr>" +
          "<tr><td> Estado </td><td>" +
          feature.properties.estado +
          "</td></tr>" +
          "<tr><td> Valor pedido </td><td>$" +
          thousands_separators(feature.properties.valor_pedi) +
          "</td></tr>"
      );
    },
    pointToLayer: (feature, latlng) => {
      capa_ofertas = L.circleMarker(latlng, s_light_style);
      groupedOverlays["Ofertas"] = capa_ofertas;
      return capa_ofertas;
    },
  });
  markers.addLayer(ofertas);
  layerControl.addOverlay(markers, "Ofertas");
  markers.addTo(mymap);
});

/* var wms_ofertas_cali = L.tileLayer.wms(`${servidorGeoserver}ofertas_cali/wms`, {
  layers: "ofertas_cali:ofertas_cali",
  format: "image/png",
  transparent: true,
}); */

/* var wms_perimetro_urbano = L.tileLayer.wms(
  `${servidorGeoserver}ofertas_cali/wms`,
  {
    layers: "ofertas_cali:perimetro_urbano",
    format: "image/png",
    transparent: true,
  }
);

var wms_seguridad = L.tileLayer.wms(`${servidorGeoserver}ofertas_cali/wms`, {
  layers: "ofertas_cali:seguridad",
  format: "image/png",
  transparent: true,
});

var wms_terrenos = L.tileLayer.wms(`${servidorGeoserver}ofertas_cali/wms`, {
  layers: "ofertas_cali:terrenos",
  format: "image/png",
  transparent: true,
});

var wms_vias = L.tileLayer.wms(`${servidorGeoserver}ofertas_cali/wms`, {
  layers: "ofertas_cali:vias",
  format: "image/png",
  transparent: true,
}); */

//var contenido = L.control.layers(); //crea un mapa de contenido o control de layers
//contenido.addOverlay(wms_educacion,"Capa educacion");
//contenido.addOverlay(wms_cultura,"Capa cultura");
//contenido.addOverlay(wms_recreacion,"Capa recreacion");
//contenido.addOverlay(wms_salud,"Capa salud");
//contenido.addOverlay(wms_culto,"Capa culto");
//contenido.addOverlay(wms_comunas, "Capa comuna");
//contenido.addOverlay(wms_deporte,"Capa deporte");
//contenido.addOverlay(wms_estaciones_mio,"Capa estaciones mio");
//contenido.addOverlay(wms_ofertas_cali, "Capa ofertas inmobiliarias");
//contenido.addOverlay(wms_perimetro_urbano,"Capa perimetro urbano");
//contenido.addOverlay(wms_seguridad,"Capa seguridad");
//contenido.addOverlay(wms_terrenos,"Capa terrenos");
//contenido.addOverlay(wms_vias,"Capa vias");
//contenido.addOverlay(marker,"Marcador");

// Agregar escala grafica con tamaño de 200 pixeles
L.control
  .scale({
    imperial: false,
    maxWidth: 200,
  })
  .addTo(mymap);

//llamar capas creadas
//contenido.addTo(mymap);

wms_comunas.addTo(mymap);
/*wms_ofertas_cali.addTo(mymap);
 wms_perimetro_urbano.addTo(mymap);
wms_terrenos.addTo(mymap);
wms_educacion.addTo(mymap);
wms_cultura.addTo(mymap);
wms_recreacion.addTo(mymap);
wms_salud.addTo(mymap);
wms_culto.addTo(mymap);
wms_deporte.addTo(mymap);
wms_seguridad.addTo(mymap);
wms_estaciones_mio.addTo(mymap);
wms_vias.addTo(mymap); */
street.addTo(mymap);

wms_comunas.on("click", (event) => {
  console.log(event);
});

L.easyButton(
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
  <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z"/>
</svg>`,
  function (btn, map) {
    mymap.flyTo([3.42, -76.5221987], 13);
  }
).addTo(mymap);

function thousands_separators(num) {
  var num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
}

/*************************** PRIMERA_CONSULTA  ***************************/
const form = document.getElementById("comunas");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  document
    .querySelector("button#reiniciar-consulta")
    .removeAttribute("disabled");

  const datoComuna = event.target["select-comunas"].value;
  const datoEstado = event.target["select-estado"].value;
  const datoTipo = event.target["select-tipo"].value;

  // Lo siguiente es para conocer el centroide de la comuna seleccionada
  const comunasCompletas = document
    .querySelector("#mapa-despliegue")
    .getAttribute("comunas_completas");

  const comunasFiltra = JSON.parse(comunasCompletas.replace(/'/g, '"')).filter(
    (element) => element.comuna == datoComuna
  );
  console.log(comunasFiltra[0].lat, comunasFiltra[0].lng);
  // Finaliza traer las coords del centroide

  traerDatosJSON(
    `http://127.0.0.1:5000/api/estadistica/${datoComuna}/${datoEstado}/${datoTipo}`
  ).then((data) => {
    document.getElementById(
      "resultado-modal"
    ).innerHTML = `<p>Estadísticas de las ofertas para la comuna <strong>${datoComuna}</strong>, con estado <strong>${datoEstado}</strong> y de tipo <strong>${datoTipo}</strong></p>
    <table class="table">
     <thead>
       <tr>
         <th scope="col">Inmueble</th>
         <th scope="col">Promedio</th>
         <th scope="col">Máximo</th>
         <th scope="col">Mínimo</th>
       </tr>
     </thead>
     <tbody>
       ${data.map((dato) => {
         return `<tr>
        <td>${dato["tipo_inmueble"]}</td>
        <td>$${thousands_separators(dato["promedio"])}</td>
        <td>$${thousands_separators(dato["maximo"])}</td>
        <td>$${thousands_separators(dato["minimo"])}</td>
      </tr>`;
       })}
     </tbody>
   </table>`;
  });

  const urlConsulta = `http://localhost:8080/geoserver/ofertas_cali/ows?
service=WFS&
version=1.0.0&
request=GetFeature&
typeName=ofertas_cali:ofertas_estadistica&
viewparams=comuna:${datoComuna};estado:${datoEstado};tipo_ofert:${datoTipo}&
outputFormat=application%2Fjson`;

  traerDatosJSON(urlConsulta).then((data) => {
    ofertasSelect = new L.GeoJSON(data, {
      onEachFeature: (feature, layer) => {
        layer.setStyle({
          color: "black",
          weight: 1.9,
        });
        layer.bindPopup(
          '<h4 class = "text-primary">Inmuebles</h4>' +
            '<div class="container"><table class="table table-striped">' +
            "<thead><tr><th>Propiedad</th><th>Valor</th></tr></thead>" +
            "<tbody><tr><td> Barrio </td><td>" +
            feature.properties.barrio +
            "</td></tr>" +
            "<tr><td> Tipo de oferta </td><td>" +
            feature.properties.tipo_ofert +
            "</td></tr>" +
            "<tr><td> Tipo de inmueble </td><td>" +
            feature.properties.inmueble +
            "</td></tr>" +
            "<tr><td> Estrato </td><td>" +
            feature.properties.estrato +
            "</td></tr>" +
            "<tr><td> Acabados </td><td>" +
            feature.properties.acabados +
            "</td></tr>" +
            "<tr><td> Estado </td><td>" +
            feature.properties.estado +
            "</td></tr>" +
            "<tr><td> Valor pedido </td><td>$" +
            thousands_separators(feature.properties.valor_pedi) +
            "</td></tr>"
        );
      },
      pointToLayer: (feature, latlng) => {
        capa_ofertas = L.circleMarker(latlng, s_light_style_consulta);
        groupedOverlays["Ofertas select"] = capa_ofertas;
        return capa_ofertas;
      },
    });
    layerControl.addOverlay(ofertasSelect, "Ofertas select");
    markers.remove(mymap);
    ofertasSelect.addTo(mymap);
  });

  mymap.flyTo([comunasFiltra[0].lat, comunasFiltra[0].lng], 14);

  try {
    mymap.removeLayer(ofertasSelect);
    layerControl.removeLayer(ofertasSelect);
    groupedOverlays["Ofertas select"] = null;
  } catch (error) {
    console.log("No se ha definido la capa");
  }
});

const reiniciarConsulta = () => {
  /* Se reinicia el formulario de consulta */
  document.querySelector("form #select-comunas").value = "Seleccione la comuna";
  document.querySelector("form #select-estado").value = "Estado del inmueble";
  document.querySelector("form #select-tipo").value = "Tipo de oferta";

  /* Se habilita el botón de reiniciar consulta */
  document
    .querySelector("button#reiniciar-consulta")
    .setAttribute("disabled", true);
  /* Se remueven las capas de consulta */
  mymap.removeLayer(ofertasSelect);
  layerControl.removeLayer(ofertasSelect);
  ofertas.addTo(mymap);
  mymap.flyTo([3.42, -76.5221987], 13);
};
/*************************** TERMINA PRIMERA_CONSULTA  ***************************/
/*************************** SEGUNDA_CONSULTA  ***************************/
document
  .getElementById("ofertas-precio")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    document
      .querySelector("button#reiniciar-consulta2")
      .removeAttribute("disabled");

    const datoComuna = event.target["select-comunas"].value;
    const datoInmueble = event.target["select-inmueble"].value;
    const datoTipo = event.target["select-tipo"].value;
    const datoDesde = event.target["select-precio-desde"].value;
    const datoHasta = event.target["select-precio-hasta"].value;

    console.log(datoComuna, datoInmueble, datoTipo, datoDesde, datoHasta);

    // Lo siguiente es para conocer el centroide de la comuna seleccionada
    const comunasCompletas = document
      .querySelector("#mapa-despliegue")
      .getAttribute("comunas_completas");

    const comunasFiltra = JSON.parse(
      comunasCompletas.replace(/'/g, '"')
    ).filter((element) => element.comuna == datoComuna);
    console.log(comunasFiltra[0].lat, comunasFiltra[0].lng);
    // Finaliza traer las coords del centroide

    const urlConsulta = `http://localhost:8080/geoserver/ofertas_cali/ows?
service=WFS&
version=1.0.0&
request=GetFeature&
typeName=ofertas_cali:ofertas_precio&
viewparams=comuna:${datoComuna};inmueble:${datoInmueble};tipo_ofert:${datoTipo};min:${datoDesde};max:${datoHasta}&
outputFormat=application%2Fjson`;

    traerDatosJSON(urlConsulta).then((data) => {
      ofertasSelect = new L.GeoJSON(data, {
        onEachFeature: (feature, layer) => {
          layer.setStyle({
            color: "black",
            weight: 1.9,
          });
          layer.bindPopup(
            '<h4 class = "text-primary">Inmuebles</h4>' +
              '<div class="container"><table class="table table-striped">' +
              "<thead><tr><th>Propiedad</th><th>Valor</th></tr></thead>" +
              "<tbody><tr><td> Barrio </td><td>" +
              feature.properties.barrio +
              "</td></tr>" +
              "<tr><td> Comuna </td><td>" +
              feature.properties.comuna +
              "</td></tr>" +
              "<tr><td> Tipo de oferta </td><td>" +
              feature.properties.tipo_ofert +
              "</td></tr>" +
              "<tr><td> Estrato </td><td>" +
              feature.properties.estrato +
              "</td></tr>" +
              "<tr><td> Valor pedido </td><td>$" +
              thousands_separators(feature.properties.valor_pedi) +
              "</td></tr>"
          );
        },
        pointToLayer: (feature, latlng) => {
          capa_ofertas = L.circleMarker(latlng, s_light_style_consulta);
          groupedOverlays["Ofertas rango precios"] = capa_ofertas;
          return capa_ofertas;
        },
      });
      layerControl.addOverlay(ofertasSelect, "Ofertas rango precios");
      markers.remove(mymap);
      ofertasSelect.addTo(mymap);
    });

    mymap.flyTo([comunasFiltra[0].lat, comunasFiltra[0].lng], 14);

    try {
      mymap.removeLayer(ofertasSelect);
      layerControl.removeLayer(ofertasSelect);
      groupedOverlays["Ofertas rango precios"] = null;
    } catch (error) {
      console.log("No se ha definido la capa");
    }
  });

const reiniciarConsulta2 = () => {
  /* Se reinicia el formulario de consulta */
  document.querySelector("#ofertas-precio #select-comunas").value =
    "Seleccione la comuna";
  document.querySelector("#ofertas-precio #select-inmueble").value =
    "Tipo de inmueble";
  document.querySelector("#ofertas-precio #select-tipo").value =
    "Tipo de oferta";

  /* Se habilita el botón de reiniciar consulta */
  document
    .querySelector("button#reiniciar-consulta2")
    .setAttribute("disabled", true);
  /* Se remueven las capas de consulta */
  mymap.removeLayer(ofertasSelect);
  layerControl.removeLayer(ofertasSelect);
  markers.addTo(mymap);
  mymap.flyTo([3.42, -76.5221987], 13);
};
/*************************** TERMINA SEGUNDA_CONSULTA  ***************************/

/*************************** TERCERA_CONSULTA  ***************************/
document
  .getElementById("busqueda-apartamentos")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    document
      .querySelector("button#reiniciar-consulta3")
      .removeAttribute("disabled");

    const datoComuna = event.target["select-comunas"].value;
    const datoEstado = event.target["select-estado"].value;
    const datoTipo = event.target["select-tipo"].value;
    console.log(datoComuna, datoEstado, datoTipo);

    // Lo siguiente es para conocer el centroide de la comuna seleccionada
    const comunasCompletas = document
      .querySelector("#mapa-despliegue")
      .getAttribute("comunas_completas");

    const comunasFiltra = JSON.parse(
      comunasCompletas.replace(/'/g, '"')
    ).filter((element) => element.comuna == datoComuna);
    console.log(comunasFiltra[0].lat, comunasFiltra[0].lng);
    // Finaliza traer las coords del centroide

    const urlConsulta = `http://localhost:8080/geoserver/ofertas_cali/ows?
service=WFS&
version=1.0.0&
request=GetFeature&
typeName=ofertas_cali:ofertas_apartamentos&
viewparams=comuna:${datoComuna};estado:${datoEstado};tipo_ofert:${datoTipo}&
outputFormat=application%2Fjson`;

    traerDatosJSON(urlConsulta).then((data) => {
      ofertasSelect = new L.GeoJSON(data, {
        onEachFeature: (feature, layer) => {
          layer.setStyle({
            color: "black",
            weight: 1.9,
          });
          layer.bindPopup(
            '<h4 class = "text-primary">Inmuebles</h4>' +
              '<div class="container"><table class="table table-striped">' +
              "<thead><tr><th>Propiedad</th><th>Valor</th></tr></thead>" +
              "<tbody><tr><td> Barrio </td><td>" +
              feature.properties.barrio +
              "</td></tr>" +
              "<tr><td> Comuna </td><td>" +
              feature.properties.comuna +
              "</td></tr>" +
              "<tr><td> Tipo de oferta </td><td>" +
              feature.properties.tipo_ofert +
              "</td></tr>" +
              "<tr><td> Estrato </td><td>" +
              feature.properties.estrato +
              "</td></tr>" +
              "<tr><td> Estado </td><td>" +
              feature.properties.estado +
              "</td></tr>" +
              "<tr><td> Número de parqueaderos </td><td>" +
              feature.properties.parqueader +
              "</td></tr>" +
              "<tr><td> Valor pedido </td><td>$" +
              thousands_separators(feature.properties.valor_pedi) +
              "</td></tr>"
          );
        },
        pointToLayer: (feature, latlng) => {
          capa_ofertas = L.circleMarker(latlng, s_light_style_consulta);
          groupedOverlays["Apartamentos"] = capa_ofertas;
          return capa_ofertas;
        },
      });
      layerControl.addOverlay(ofertasSelect, "Apartamentos");
      markers.remove(mymap);
      ofertasSelect.addTo(mymap);
    });

    mymap.flyTo([comunasFiltra[0].lat, comunasFiltra[0].lng], 14);

    try {
      mymap.removeLayer(ofertasSelect);
      layerControl.removeLayer(ofertasSelect);
      groupedOverlays["Apartamentos"] = null;
    } catch (error) {
      console.log("No se ha definido la capa");
    }
  });

const reiniciarConsulta3 = () => {
  /* Se reinicia el formulario de consulta */
  document.querySelector("#busqueda-apartamentos #select-comunas").value =
    "Seleccione la comuna";
  document.querySelector("#busqueda-apartamentos #select-estado").value =
    "Estado del inmueble";
  document.querySelector("#busqueda-apartamentos #select-tipo").value =
    "Tipo de oferta";

  /* Se habilita el botón de reiniciar consulta */
  document
    .querySelector("button#reiniciar-consulta3")
    .setAttribute("disabled", true);
  /* Se remueven las capas de consulta */
  mymap.removeLayer(ofertasSelect);
  layerControl.removeLayer(ofertasSelect);
  markers.addTo(mymap);
  mymap.flyTo([3.42, -76.5221987], 13);
};
/*************************** TERMINA TERCERA_CONSULTA  ***************************/
/*************************** CUARTA_CONSULTA  ***************************/

const habilitarConsulta4 = () => {
  alert("Se habilitó la consulta de estaciones cercanas");
  // Función toggle
  document
    .querySelector("button#reiniciar-consulta4")
    .removeAttribute("disabled");
  document
    .querySelector("button#habilitar-consulta4")
    .setAttribute("disabled", true);
  // Termina toggle

  mymap.removeLayer(markers);
  layerControl.removeLayer(markers);
  //markers.addTo(mymap);

  markers = L.markerClusterGroup();

  const zoomToFeature = (e) => {
    console.log(e.latlng.lat, e.latlng.lng);
    mymap.flyTo([e.latlng.lat, e.latlng.lng], 17);
  };

  traerDatosJSON(ruta).then((data) => {
    ofertas = new L.GeoJSON(data, {
      onEachFeature: (feature, layer) => {
        layer.setStyle({
          color: "black",
          weight: 1.9,
        });
        layer.on({
          click: zoomToFeature,
        });
        layer.bindPopup(
          `<h4 class = "text-primary">Inmuebles</h4>
              <div class="container">
                <table class="table table-striped">
                  <thead><tr><th>Propiedad</th><th>Valor</th></tr></thead>
                  <tbody>
                    <tr><td> Barrio </td><td>${
                      feature.properties.barrio
                    }</td></tr>
                    <tr><td> Comuna </td><td>${
                      feature.properties.comuna
                    }</td></tr>
                    <tr><td> Valor pedido </td><td>${thousands_separators(
                      feature.properties.valor_pedi
                    )}</td></tr>
                  </tbody>
                </table>
              </div>
            
            <button
                id="reiniciar-consulta4"
                onclick="traerEstacionesMIO(${feature.id.substr(
                  13,
                  feature.id.length
                )},${feature.geometry.coordinates[0]},${
            feature.geometry.coordinates[1]
          })"
                class="btn btn-success"
              >
                Estaciones MIO
            </button>`
        );
      },
      pointToLayer: (feature, latlng) => {
        capa_ofertas = L.circleMarker(latlng, s_light_style);
        groupedOverlays["Ofertas"] = capa_ofertas;
        return capa_ofertas;
      },
    });
    markers.addLayer(ofertas);
    layerControl.addOverlay(markers, "Ofertas");
    markers.addTo(mymap);
  });
};

const reiniciarConsulta4 = () => {
  document
    .querySelector("button#habilitar-consulta4")
    .removeAttribute("disabled");
  document
    .querySelector("button#reiniciar-consulta4")
    .setAttribute("disabled", true);

  mymap.removeLayer(markers);
  layerControl.removeLayer(markers);
  //markers.addTo(mymap);

  markers = L.markerClusterGroup();

  traerDatosJSON(ruta).then((data) => {
    ofertas = new L.GeoJSON(data, {
      onEachFeature: (feature, layer) => {
        layer.setStyle({
          color: "black",
          weight: 1.9,
        });
        layer.bindPopup(
          '<h4 class = "text-primary">Inmuebles</h4>' +
            '<div class="container"><table class="table table-striped">' +
            "<thead><tr><th>Propiedad</th><th>Valor</th></tr></thead>" +
            "<tbody><tr><td> Barrio </td><td>" +
            feature.properties.barrio +
            "</td></tr>" +
            "<tr><td>Comuna </td><td>" +
            feature.properties.comuna +
            "</td></tr>" +
            "<tr><td> Tipo de inmueble </td><td>" +
            feature.properties.inmueble +
            "</td></tr>" +
            "<tr><td> Tipo de oferta </td><td>" +
            feature.properties.tipo_ofert +
            "</td></tr>" +
            "<tr><td> Estrato </td><td>" +
            feature.properties.estrato +
            "</td></tr>" +
            "<tr><td> Acabados </td><td>" +
            feature.properties.acabados +
            "</td></tr>" +
            "<tr><td> Estado </td><td>" +
            feature.properties.estado +
            "</td></tr>" +
            "<tr><td> Valor pedido </td><td>$" +
            thousands_separators(feature.properties.valor_pedi) +
            "</td></tr>"
        );
      },
      pointToLayer: (feature, latlng) => {
        capa_ofertas = L.circleMarker(latlng, s_light_style);
        groupedOverlays["Ofertas"] = capa_ofertas;
        return capa_ofertas;
      },
    });
    markers.addLayer(ofertas);
    layerControl.addOverlay(markers, "Ofertas");
    markers.addTo(mymap);
  });

  /* Se remueven las capas de consulta */
  mymap.removeLayer(ofertasSelect);
  mymap.removeLayer(ofertaUbicada);
  layerControl.removeLayer(ofertasSelect);
  markers.addTo(mymap);
  mymap.flyTo([3.42, -76.5221987], 13);
};

const traerEstacionesMIO = (valor, x, y) => {
  console.log("TRAIGA ESTACIONES CERCANAS A VALOR", valor);

  try {
    mymap.removeLayer(ofertaUbicada);
    mymap.removeLayer(ofertasSelect);
    layerControl.removeLayer(ofertasSelect);
  } catch (error) {
    console.log("No se ha agregado aún la capa");
  }

  ofertaUbicada = L.marker([y, x], s_light_style);

  ofertaUbicada.addTo(mymap).bindPopup("Oferta seleccionada");

  const urlConsulta = `${servidorGeoserver}ofertas_cali/ows?
service=WFS&
version=1.0.0&
request=GetFeature&
typeName=ofertas_cali:ofertas_miocercanas&
viewparams=gid:${valor}&
outputFormat=application%2Fjson`;

  traerDatosJSON(urlConsulta).then((data) => {
    ofertasSelect = new L.GeoJSON(data, {
      onEachFeature: (feature, layer) => {
        layer.setStyle({
          color: "black",
          weight: 1.9,
        });
        layer.bindPopup(
          `<h4 class = "text-primary">Estación MIO</h4>
              <div class="container">
                <table class="table table-striped">
                  <thead><tr><th>Propiedad</th><th>Valor</th></tr></thead>
                  <tbody>
                    <tr><td> Estación </td><td>${
                      feature.properties.estacion
                    }</td></tr>
                    <tr><td> Dirección </td><td>${
                      feature.properties.direccion
                    }</td></tr>
                    <tr><td> Distancia al inmueble </td><td>${feature.properties.distancia.toFixed(
                      2
                    )} m</td></tr>
                  </tbody>
                </table>
              </div>`
        );
      },
      pointToLayer: (feature, latlng) => {
        capa_ofertas = L.circleMarker(latlng, s_light_style_mio);
        groupedOverlays["Estaciones MIO"] = capa_ofertas;
        return capa_ofertas;
      },
    });
    layerControl.addOverlay(ofertasSelect, "Estaciones MIO");
    markers.remove(mymap);
    ofertasSelect.addTo(mymap);
  });

  mymap.setZoom(14);
};
/*************************** TERMINA CUARTA_CONSULTA  ***************************/
/*************************** ELIMINAR OFERTAS  ***************************/
const eliminarOfertas = () => {
  console.log("Se habilita eliminar ofertas");
  document
    .querySelector("button#deshabilitar-eliminar-oferta")
    .removeAttribute("disabled");
  document
    .querySelector("button#habilitar-eliminar-oferta")
    .setAttribute("disabled", true);

  mymap.removeLayer(markers);
  layerControl.removeLayer(markers);
  //markers.addTo(mymap);

  markers = L.markerClusterGroup();

  const zoomToFeature = (e) => {
    console.log(e.latlng.lat, e.latlng.lng);
    mymap.flyTo([e.latlng.lat, e.latlng.lng], 17);
  };

  traerDatosJSON(ruta).then((data) => {
    ofertas = new L.GeoJSON(data, {
      onEachFeature: (feature, layer) => {
        layer.setStyle({
          color: "black",
          weight: 1.9,
        });
        layer.bindPopup(
          `<h4 class = "text-primary">Inmuebles</h4>
              <div class="container">
                <table class="table table-striped">
                  <thead><tr><th>Propiedad</th><th>Valor</th></tr></thead>
                  <tbody>
                    <tr><td> Barrio </td><td>${
                      feature.properties.barrio
                    }</td></tr>
                    <tr><td> Comuna </td><td>${
                      feature.properties.comuna
                    }</td></tr>
                    <tr><td> Tipo de inmueble </td><td>${
                      feature.properties.inmueble
                    }</td></tr>
                    <tr><td> Tipo de oferta </td><td>${
                      feature.properties.tipo_ofert
                    }</td></tr>
                    <tr><td> Valor pedido </td><td>${thousands_separators(
                      feature.properties.valor_pedi
                    )}</td></tr>
                  </tbody>
                </table>
              </div>
            
            <button
                id="reiniciar-consulta4"
                onclick="eliminarOfertaSeleccionada(${feature.id.substr(
                  13,
                  feature.id.length
                )},${feature.geometry.coordinates[0]},${
            feature.geometry.coordinates[1]
          })"
                class="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Eliminar oferta
            </button>`
        );
      },
      pointToLayer: (feature, latlng) => {
        capa_ofertas = L.circleMarker(latlng, s_light_style);
        groupedOverlays["Ofertas"] = capa_ofertas;
        return capa_ofertas;
      },
    });
    markers.addLayer(ofertas);
    layerControl.addOverlay(markers, "Ofertas");
    markers.addTo(mymap);
  });
};

const eliminarOfertaSeleccionada = (valor, x, y) => {
  console.log("ELIMINE OFERTA ", valor);

  APIEliminaOferta(`http://127.0.0.1:5000/api/elimina_oferta/${valor}`).then(
    (data) => {
      document.getElementById(
        "resultado-modal"
      ).innerHTML = `<p style="color:rgb(170, 7, 7)"><strong>Se eliminó la oferta seleccionada</strong></p>`;
    }
  );

  try {
    desEliminarOfertas();
  } catch (error) {
    console.log("No se ha agregado aún la capa");
  }
};

const desEliminarOfertas = () => {
  console.log("Se deshabilita eliminar ofertas");
  document
    .querySelector("button#habilitar-eliminar-oferta")
    .removeAttribute("disabled");
  document
    .querySelector("button#deshabilitar-eliminar-oferta")
    .setAttribute("disabled", true);

  mymap.removeLayer(markers);
  layerControl.removeLayer(markers);
  //markers.addTo(mymap);

  markers = L.markerClusterGroup();

  traerDatosJSON(ruta).then((data) => {
    ofertas = new L.GeoJSON(data, {
      onEachFeature: (feature, layer) => {
        layer.setStyle({
          color: "black",
          weight: 1.9,
        });
        layer.bindPopup(
          '<h4 class = "text-primary">Inmuebles</h4>' +
            '<div class="container"><table class="table table-striped">' +
            "<thead><tr><th>Propiedad</th><th>Valor</th></tr></thead>" +
            "<tbody><tr><td> Barrio </td><td>" +
            feature.properties.barrio +
            "</td></tr>" +
            "<tr><td>Comuna </td><td>" +
            feature.properties.comuna +
            "</td></tr>" +
            "<tr><td> Tipo de inmueble </td><td>" +
            feature.properties.inmueble +
            "</td></tr>" +
            "<tr><td> Tipo de oferta </td><td>" +
            feature.properties.tipo_ofert +
            "</td></tr>" +
            "<tr><td> Estrato </td><td>" +
            feature.properties.estrato +
            "</td></tr>" +
            "<tr><td> Acabados </td><td>" +
            feature.properties.acabados +
            "</td></tr>" +
            "<tr><td> Estado </td><td>" +
            feature.properties.estado +
            "</td></tr>" +
            "<tr><td> Valor pedido </td><td>$" +
            thousands_separators(feature.properties.valor_pedi) +
            "</td></tr>"
        );
      },
      pointToLayer: (feature, latlng) => {
        capa_ofertas = L.circleMarker(latlng, s_light_style);
        groupedOverlays["Ofertas"] = capa_ofertas;
        return capa_ofertas;
      },
    });
    markers.addLayer(ofertas);
    layerControl.addOverlay(markers, "Ofertas");
    markers.addTo(mymap);
  });

  /* Se remueven las capas de consulta */
  mymap.removeLayer(ofertasSelect);
  mymap.removeLayer(ofertaUbicada);
  layerControl.removeLayer(ofertasSelect);
  markers.addTo(mymap);
  //mymap.flyTo([3.42, -76.5221987], 13);
};
/*************************** TERMINA ELIMINAR OFERTAS  ***************************/
/*************************** INGRESAR OFERTAS  ***************************/
const ingresarOfertas = () => {
  console.log("Se habilita ingresar ofertas");
  document
    .querySelector("button#deshabilitar-ingresar-oferta")
    .removeAttribute("disabled");
  document
    .querySelector("button#habilitar-ingresar-oferta")
    .setAttribute("disabled", true);
};
const desIngresarOfertas = () => {
  console.log("Se deshabilita ingresar ofertas");
  document
    .querySelector("button#habilitar-ingresar-oferta")
    .removeAttribute("disabled");
  document
    .querySelector("button#deshabilitar-ingresar-oferta")
    .setAttribute("disabled", true);

  mymap.removeLayer(markers);
  layerControl.removeLayer(markers);
  //markers.addTo(mymap);

  markers = L.markerClusterGroup();

  traerDatosJSON(ruta).then((data) => {
    ofertas = new L.GeoJSON(data, {
      onEachFeature: (feature, layer) => {
        layer.setStyle({
          color: "black",
          weight: 1.9,
        });
        layer.bindPopup(
          '<h4 class = "text-primary">Inmuebles</h4>' +
            '<div class="container"><table class="table table-striped">' +
            "<thead><tr><th>Propiedad</th><th>Valor</th></tr></thead>" +
            "<tbody><tr><td> Barrio </td><td>" +
            feature.properties.barrio +
            "</td></tr>" +
            "<tr><td>Comuna </td><td>" +
            feature.properties.comuna +
            "</td></tr>" +
            "<tr><td> Tipo de inmueble </td><td>" +
            feature.properties.inmueble +
            "</td></tr>" +
            "<tr><td> Tipo de oferta </td><td>" +
            feature.properties.tipo_ofert +
            "</td></tr>" +
            "<tr><td> Estrato </td><td>" +
            feature.properties.estrato +
            "</td></tr>" +
            "<tr><td> Acabados </td><td>" +
            feature.properties.acabados +
            "</td></tr>" +
            "<tr><td> Estado </td><td>" +
            feature.properties.estado +
            "</td></tr>" +
            "<tr><td> Valor pedido </td><td>$" +
            thousands_separators(feature.properties.valor_pedi) +
            "</td></tr>"
        );
      },
      pointToLayer: (feature, latlng) => {
        capa_ofertas = L.circleMarker(latlng, s_light_style);
        groupedOverlays["Ofertas"] = capa_ofertas;
        return capa_ofertas;
      },
    });
    markers.addLayer(ofertas);
    layerControl.addOverlay(markers, "Ofertas");
    markers.addTo(mymap);
  });

  /* Se remueven las capas de consulta */
  mymap.removeLayer(ofertasSelect);
  mymap.removeLayer(ofertaUbicada);
  layerControl.removeLayer(ofertasSelect);
  markers.addTo(mymap);
  mymap.flyTo([3.42, -76.5221987], 13);
};
/*************************** TERMINA INGRESAR OFERTAS  ***************************/
/*************************** EDITAR OFERTAS  ***************************/
const editarOfertas = () => {
  console.log("Se habilita editar ofertas");
  document
    .querySelector("button#deshabilitar-editar-oferta")
    .removeAttribute("disabled");
  document
    .querySelector("button#habilitar-editar-oferta")
    .setAttribute("disabled", true);

  mymap.removeLayer(markers);
  layerControl.removeLayer(markers);
  //markers.addTo(mymap);

  markers = L.markerClusterGroup();

  const zoomToFeature = (e) => {
    console.log(e.latlng.lat, e.latlng.lng);
    mymap.flyTo([e.latlng.lat, e.latlng.lng], 17);
  };

  traerDatosJSON(ruta).then((data) => {
    ofertas = new L.GeoJSON(data, {
      onEachFeature: (feature, layer) => {
        layer.setStyle({
          color: "black",
          weight: 1.9,
        });
        layer.bindPopup(
          `<h4 class = "text-primary">Editar oferta</h4>      
            <form action="" method="post" id="editar-ofert">
            id
            <input
                id="select-id"
                type="number"
                class="form-control"
                value="${feature.id.substr(13, feature.id.length)}"
                aria-label="Last name"
                readonly
            />
            Tipo de oferta
            <select
              id="select-tipo"
              class="form-select"
              aria-label="Default select example"
            >
              <option>${feature.properties.tipo_ofert}</option>              
              <option>Alquiler</option>              
              <option>Venta</option>              
            </select>
            Estado del inmueble
            <select
              id="select-estado"
              class="form-select"
              aria-label="Default select example"
            >
              <option>${feature.properties.estado}</option> 
              <option>Usado</option>
              <option>Nuevo</option>              
            </select>     
            Tipo de inmueble
            <select
              id="select-inmueble"
              class="form-select"
              aria-label="Default select example"
            >
              <option>${
                feature.properties.inmueble
              }</option>                        
              <option>Apartamento</option>                         
              <option>Local</option>                         
              <option>Casa</option>                         
              <option>Lote</option>                         
              <option>Bodega</option>                         
            </select>   
            Tipo de acabados    
            <select
              id="select-acabados"
              class="form-select"
              aria-label="Default select example"
            >
              <option>${
                feature.properties.acabados
              }</option>                       
              <option>Obra Gris</option>                         
              <option>Obra Negra</option>                         
              <option>Obra Blanca</option>                                              
            </select>   
            Valor de la oferta  
            <div class="input-group">
              <div class="input-group-text">$</div>
              <input
                id="select-valor-pedi"
                type="number"
                class="form-control"
                value="${feature.properties.valor_pedi.toFixed(2)}"
                aria-label="Last name"
              />
            </div>  
            <br />
            <button
              id="resultados"
              type="submit"
              class="btn btn-warning"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Editar oferta
            </button>
          </form>`
        );
      },
      pointToLayer: (feature, latlng) => {
        capa_ofertas = L.circleMarker(latlng, s_light_style);
        groupedOverlays["Ofertas"] = capa_ofertas;
        return capa_ofertas;
      },
    });
    markers.addLayer(ofertas);
    layerControl.addOverlay(markers, "Ofertas");
    markers.addTo(mymap);

    mymap.on("popupopen", (event) => {
      console.log("POPUP");
      document
        .getElementById("editar-ofert")
        .addEventListener("submit", (event) => {
          event.preventDefault();
          console.log("EDITANDO");

          const datoID = event.target["select-id"].value;
          const datoTipo = event.target["select-tipo"].value;
          const datoInmueble = event.target["select-inmueble"].value;
          const datoAcabados = event.target["select-acabados"].value;
          const datoEstado = event.target["select-estado"].value;
          const datoValorPedi = event.target["select-valor-pedi"].value;
          console.log(
            datoTipo,
            datoInmueble,
            datoAcabados,
            datoEstado,
            datoValorPedi,
            datoID
          );
          APIEditarOferta(
            `http://127.0.0.1:5000/api/edita_oferta/${datoTipo}/${datoInmueble}/${datoAcabados}/${datoEstado}/${datoValorPedi}/${datoID}`
          ).then((data) => {
            document.getElementById(
              "resultado-modal"
            ).innerHTML = `<p style="color:rgb(16, 120, 11)"><strong>Oferta actualizada correctamente</strong></p>`;
          });

          try {
            desEditarOfertas();
          } catch (error) {
            console.log("No se ha agregado aún la capa");
          }
        });
    });
  });
};

const desEditarOfertas = () => {
  console.log("Se deshabilita editar ofertas");
  document
    .querySelector("button#habilitar-editar-oferta")
    .removeAttribute("disabled");
  document
    .querySelector("button#deshabilitar-editar-oferta")
    .setAttribute("disabled", true);

  mymap.removeLayer(markers);
  layerControl.removeLayer(markers);
  //markers.addTo(mymap);

  markers = L.markerClusterGroup();

  traerDatosJSON(ruta).then((data) => {
    ofertas = new L.GeoJSON(data, {
      onEachFeature: (feature, layer) => {
        layer.setStyle({
          color: "black",
          weight: 1.9,
        });
        layer.bindPopup(
          '<h4 class = "text-primary">Inmuebles</h4>' +
            '<div class="container"><table class="table table-striped">' +
            "<thead><tr><th>Propiedad</th><th>Valor</th></tr></thead>" +
            "<tbody><tr><td> Barrio </td><td>" +
            feature.properties.barrio +
            "</td></tr>" +
            "<tr><td>Comuna </td><td>" +
            feature.properties.comuna +
            "</td></tr>" +
            "<tr><td> Tipo de inmueble </td><td>" +
            feature.properties.inmueble +
            "</td></tr>" +
            "<tr><td> Tipo de oferta </td><td>" +
            feature.properties.tipo_ofert +
            "</td></tr>" +
            "<tr><td> Estrato </td><td>" +
            feature.properties.estrato +
            "</td></tr>" +
            "<tr><td> Acabados </td><td>" +
            feature.properties.acabados +
            "</td></tr>" +
            "<tr><td> Estado </td><td>" +
            feature.properties.estado +
            "</td></tr>" +
            "<tr><td> Valor pedido </td><td>$" +
            thousands_separators(feature.properties.valor_pedi) +
            "</td></tr>"
        );
      },
      pointToLayer: (feature, latlng) => {
        capa_ofertas = L.circleMarker(latlng, s_light_style);
        groupedOverlays["Ofertas"] = capa_ofertas;
        return capa_ofertas;
      },
    });
    markers.addLayer(ofertas);
    layerControl.addOverlay(markers, "Ofertas");
    markers.addTo(mymap);
  });

  /* Se remueven las capas de consulta */
  mymap.removeLayer(ofertasSelect);
  mymap.removeLayer(ofertaUbicada);
  layerControl.removeLayer(ofertasSelect);
  markers.addTo(mymap);
  //mymap.flyTo([3.42, -76.5221987], 13);
};
/*************************** TERMINA EDITAR OFERTAS  ***************************/
