// declarar variables de mapa base street

var mymap = L.map("mapid").setView([3.42, -76.5221987], 13);

const ruta =
  "http://localhost:8080/geoserver/ofertas_cali/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ofertas_cali%3Aofertas_cali&outputFormat=application%2Fjson";

const traerDatosJSON = async (url) => {
  const response = await (await fetch(url)).json();
  return response;
};

var s_light_style = {
  radius: 4,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};

var s_light_style_consulta = {
  radius: 4,
  fillColor: "#38761d",
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

const servidorGeoserver = "http://localhost:8080/geoserver/";

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
          "<thead><tr><th>Properties</th><th>Value</th></tr></thead>" +
          "<tbody><tr><td> Barrio </td><td>" +
          feature.properties.barrio +
          "</td></tr>" +
          "<tr><td>Comuna </td><td>" +
          feature.properties.comuna +
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
          "<tr><td> Tipo de inmueble </td><td>" +
          feature.properties.inmueble +
          "</td></tr>" +
          "<tr><td> Estado </td><td>" +
          feature.properties.estado +
          "</td></tr>"
      );
    },
    pointToLayer: (feature, latlng) => {
      capa_ofertas = L.circleMarker(latlng, s_light_style);
      groupedOverlays["Ofertas"] = capa_ofertas;
      return capa_ofertas;
    },
  });
  layerControl.addOverlay(ofertas, "Ofertas");
  ofertas.addTo(mymap);
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

const form = document.getElementById("comunas");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  document
    .querySelector("button#reiniciar-consulta")
    .removeAttribute("disabled");

  const datoComuna = event.target["select-comunas"].value;
  const datoEstado = event.target["select-estado"].value;
  const datoTipo = event.target["select-tipo"].value;

  const comunasCompletas = document
    .querySelector("#mapa-despliegue")
    .getAttribute("comunas_completas");

  const comunasFiltra = JSON.parse(comunasCompletas.replace(/'/g, '"')).filter(
    (element) => element.comuna == datoComuna
  );

  console.log(comunasFiltra[0].lat, comunasFiltra[0].lng);

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
            "<thead><tr><th>Properties</th><th>Value</th></tr></thead>" +
            "<tbody><tr><td> Barrio </td><td>" +
            feature.properties.barrio +
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
        capa_ofertas = L.circleMarker(latlng, s_light_style_consulta);
        groupedOverlays["Ofertas select"] = capa_ofertas;
        return capa_ofertas;
      },
    });
    layerControl.addOverlay(ofertasSelect, "Ofertas select");
    ofertas.remove(mymap);
    ofertasSelect.addTo(mymap);
  });

  mymap.flyTo([comunasFiltra[0].lat, comunasFiltra[0].lng], 14);
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
