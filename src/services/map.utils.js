import { MarkerClass } from "@/common/enums";
import ApiService from "@/services/api.service";

import LastDataPopup from "@/components/lastDataPopup.vue";
import Vue from 'vue';

const MapUtils = {

  tileLayerVisible(map, layer) {
    return map.getBounds().intersects(layer.options.bounds)
      && (layer.options.minZoom <= map.getZoom() && (map.getZoom() <= layer.options.maxZoom));
  },

  markerVisible(map, marker) {
    var minZoom;
    if (marker.mapResource.minZoom && typeof marker.mapResource.minZoom === "function") {
      minZoom = marker.mapResource.minZoom(marker);
    }
    else {
      minZoom = marker.minZoom ? marker.minZoom : (marker.mapResource.minZoom ? marker.mapResource.minZoom : 0);
    }
    return map.getBounds().contains(marker.getLatLng()) // + buffer
      && (map.getZoom() >= minZoom);
  },

  async openMarkerPopup(map, marker) {
    var tooltip;
    // comprobar zoom, si alejado añadir nota para acercarse...
    // maquetar
    switch (marker.mapResource.markerClass) {
      case MarkerClass.UBICACION:
        marker.bindPopup(marker.tipoUbicacion + ": " + marker.nombre);
        marker.openPopup();
        break;
      case MarkerClass.PUNTO_MALLA:
        tooltip = "Pred. " + marker.mapOption.name + ": " + (marker.nombre ? marker.nombre : " Lat " + marker.latitud.toFixed(2) + " N" + ": Lon " + marker.longitud.toFixed(2) + " O");
        marker.bindPopup(tooltip);
        marker.openPopup();
        break;
      case MarkerClass.PUNTO_MALLA_VERIF:
        tooltip = "Verificación: " + marker.nombre;
        marker.bindPopup(tooltip);
        marker.openPopup();
        break;
      case MarkerClass.ESTACION:
        var data = {};
        var markersAtPoint = this.getMarkersById(map, marker.id);
        marker.popUp = true;
        var lastData = await ApiService.post('lastDataEstacion/' + marker.id + '?locale=es',
          markersAtPoint.map(m => { return m.variable }));
        if (marker.popUp) {
          var comp = new Vue({ ...LastDataPopup, propsData: { marker: marker, data: lastData.data } }).$mount()
          var html = comp.$el.innerHTML;
          marker.bindPopup(html, {
            maxWidth: 560
          });
          marker.openPopup();
        }

        // this.asyncForEach(markersAtPoint, async m => {
        //   var lastData = await ApiService.get('lastDataEstacion/' + m.id + '/' + m.variable + '?locale=es')
        //   this.mergeLastDataStations(data, lastData.data);
        //   if (m.popUp)  {
        //     var comp = new Vue({...LastDataPopup, propsData: { marker: marker, data: data }}).$mount()
        //     var html = comp.$el.innerHTML; 
        //     marker.bindPopup(html, {
        //       maxWidth : 560
        //     });
        //     marker.openPopup();
        //   }
        // });

        break;
    }

  },

  mergeLastDataStations(orig, source) {
    var fechaAct = orig['Fecha'];
    var fechaNew = source['Fecha'];
    if (!fechaAct || !fechaNew) {
      Object.assign(orig, source);
    }
    else {
      var fechaMayor = new Date(fechaAct) >= new Date(fechaNew) ? fechaAct : fechaNew;
      source['Fecha'] = fechaMayor;
      Object.assign(orig, source);
    }
  },

  closeMarkerPopup(map, marker) {
    marker.popUp = false;
    marker.closePopup();
  },

  getMarkersById(map, id) {
    var result = [];
    map.eachLayer(function (layer) {
      if (layer.mapResource && layer.mapResource.type == "MarkerLayer") {
        if (layer.id == id)
          result.push(layer);
      }
    });
    return result;
  },

  convertYMDHToDate(str) {
    var year = str.substring(0, 4);
    var month = str.substring(4, 6);
    var day = str.substring(6, 8);
    var hour = str.substring(8, 10);
    var date = new Date(year, month - 1, day, hour);
    date.setUTCHours(hour, 0, 0, 0);
    return date;
  },

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  },

}

export default MapUtils



