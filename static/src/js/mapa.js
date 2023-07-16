// declarar variables de mapa base street

var mymap = L.map("mapid").setView([3.42, -76.5221987], 12);

var gray = L.tileLayer(
  "http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
  {
    maxZoom: 18,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
);

var street = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

var basemaps = {
  Grayscale: gray,
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

var wms_ofertas_cali = L.tileLayer.wms(`${servidorGeoserver}ofertas_cali/wms`, {
  layers: "ofertas_cali:ofertas_cali",
  format: "image/png",
  transparent: true,
});

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

// crear el grupo de capas

var groupedOverlays = {
  "Capas Base": {
    /* "Capa terrenos": wms_terrenos, */
    /*  "Capa vias": wms_vias, */
    "Capa comuna": wms_comunas,
    /* "Capa perimetro urbano": wms_perimetro_urbano, */
  },

  "Capas Tematicas": {
    /* "Capa educacion": wms_educacion,
    "Capa cultura": wms_cultura,
    "Capa recreacion": wms_recreacion,
    "Capa salud": wms_salud,
    "Capa culto": wms_culto,
    "Capa deporte": wms_deporte,
    "Capa seguridad": wms_seguridad,
    "Capa estaciones mio": wms_estaciones_mio, */
    "Capa ofertas inmobiliarias": wms_ofertas_cali,
  },
};

//boton de prender capas
L.control.groupedLayers(basemaps, groupedOverlays).addTo(mymap);

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
wms_ofertas_cali.addTo(mymap);
/* wms_perimetro_urbano.addTo(mymap);
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
