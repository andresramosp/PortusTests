import { MarkerClass } from "@/common/enums";

const MapUtils = {

  tileLayerVisible(map, layer) {
    return map.getBounds().intersects(layer.options.bounds)
      && (layer.options.minZoom <= map.getZoom() && (map.getZoom() <= layer.options.maxZoom));
  },

  markerVisible(map, marker) {
    var minZoom;
    if (marker.mapResource.minZoom && typeof marker.mapResource.minZoom === "function") {
      minZoom = layer.mapResource.minZoom(marker);
    }
    else {
      minZoom = marker.minZoom ? marker.minZoom : (marker.mapResource.minZoom ? marker.mapResource.minZoom : 0);
    }
    return map.getBounds().contains(marker.getLatLng()) // + buffer
      && (map.getZoom() >= minZoom);
  },

  openMarkerPopup(marker) {
    var tooltip;
    // comprobar zoom, si alejado añadir nota para acercarse...
    // maquetar
    switch (marker.mapResource.markerClass) {
      case MarkerClass.UBICACION:
        tooltip = marker.tipoUbicacion + ": " + marker.nombre;
        break;
      case MarkerClass.PUNTO_MALLA:
        tooltip = "Pred. " + marker.mapOption.name + ": " + (marker.nombre ? marker.nombre : " Lat " + marker.latitud.toFixed(2) + " N" + ": Lon " + marker.longitud.toFixed(2) + " O");
        break;
      case MarkerClass.PUNTO_MALLA_VERIF:
        tooltip = "Verificación: " + marker.nombre;
        break;
      case MarkerClass.ESTACION:
        tooltip = marker.nombre + "\n" + JSON.stringify(marker.lastData);
        break;
    }
    marker.bindPopup(tooltip);
    marker.openPopup();
  },

  convertYMDHToDate(str) {
    var year = str.substring(0, 4);
    var month = str.substring(4, 6);
    var day = str.substring(6, 8);
    var hour = str.substring(8, 10);
    var date = new Date(year, month - 1, day, hour);
    date.setUTCHours(hour, 0, 0, 0);
    return date;
  }

}

export default MapUtils



