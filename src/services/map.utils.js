

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
      minZoom =  marker.minZoom ? marker.minZoom : (marker.mapResource.minZoom ? marker.mapResource.minZoom : 0);
    }
    return map.getBounds().contains(marker.getLatLng())
      && (map.getZoom() >= minZoom);
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



