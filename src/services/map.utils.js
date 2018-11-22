import { MarkerClass } from "@/common/enums";
import ApiService from "@/services/api.service";
import MapState from "@/state/map.state";

import LastDataPopup from "@/components/lastDataPopup.vue";
import HeapedMarkersPopup from "@/components/heapedMarkersPopup.vue";
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

  getHeapedMarkers(map, marker) {
    var mu = this;
    var heapedMarkers = new Array();
    map.eachLayer(function (layer) {
      if (layer instanceof L.Marker && layer.mapResource.preventHeaping) {
        if(layer.id != marker.id && mu.distanceInPixels(map, marker.getLatLng(), layer.getLatLng()) < 12) {
           layer.heaped = true;
           if (heapedMarkers.find(m => { return m.id == layer.id}) == null) // Prevenimos que se repitan estaciones
              heapedMarkers.push(layer)
        }
        else {
          layer.heaped = false;
        }
      }
    });
    return heapedMarkers;
  },

  markerMouseClick(map, marker) {
    var markersAtPoint = this.getMarkersById(map, marker.id);
    MapState.markersSelected = markersAtPoint;
  },

  markerMouseOver(map, marker) {
    if (!MapState.popupFixed) {
      var heapedMarkers = new Array();
      if (marker.mapResource.preventHeaping) {
        heapedMarkers = this.getHeapedMarkers(map, marker);
      }
      if (heapedMarkers.length > 0) {
        heapedMarkers.push(marker);
        marker.heaped = true;
        var mu = this;
        new Vue({ ...HeapedMarkersPopup, 
          propsData: { markers: heapedMarkers, markerHovered: marker } 
        }).$mount()
        .$on('marker-item-clicked', function (marker) {
          MapState.markersSelected = mu.getMarkersById(map, marker.id);
        });
      }
      else {
        this.openMarkerPopup(map, marker);
      }
      var icon = marker.options.icon;
      icon.options.iconSize = [icon.options.iconSize[0] + 5, icon.options.iconSize[1] + 5];
      marker.setIcon(icon);
    }
  },

  markerMouseOut(map, marker) {
    if (marker.timeOut) {
      clearTimeout(marker.timeOut);
    }
    var icon = marker.options.icon;
    icon.options.iconSize = [icon.options.iconSize[0] - 5, icon.options.iconSize[1] - 5];
    marker.setIcon(icon);
    this.closeMarkerPopup(map, marker);
  },

  async openMarkerPopup(map, marker) {
    var tooltip;

    // comprobar zoom, si alejado añadir nota para acercarse...
    // maquetar
    
    switch (marker.mapResource.markerClass) {
      case MarkerClass.UBICACION:
        marker.bindPopup(Vue.$t("{tipoUbicacion" + marker.tipoUbicacion+"}") + ": " + marker.nombre);
        marker.openPopup();
        break;
      case MarkerClass.PUNTO_MALLA:
        tooltip = "Pred. " + Vue.$t(marker.mapOption.name) + ": " + (marker.nombre ? marker.nombre : " Lat " + marker.latitud.toFixed(2) + " N" + ": Lon " + marker.longitud.toFixed(2) + " O");
        marker.bindPopup(tooltip);
        marker.openPopup();
        break;
      case MarkerClass.PUNTO_MALLA_VERIF:
        tooltip = Vue.$t("{verificacionInfo}") + ": " + marker.nombre;
        marker.bindPopup(tooltip);
        marker.openPopup();
        break;
      case MarkerClass.ESTACION_HISTORICO:
        tooltip = Vue.$t("{estacionHistTooltip}") + ": " + marker.nombre;
        marker.bindPopup(tooltip);
        marker.openPopup();
        break;
      case MarkerClass.ESTACION:
        marker.timeOut = setTimeout(async () => {
          var markersAtPoint = this.getMarkersById(map, marker.id);
          var lastData = await ApiService.post('lastDataEstacion/' + marker.id + '?locale=' + Vue.$getLocale(),
          markersAtPoint.map(m => { return m.mapOption.variableType }), true);
          var comp = new Vue({ ...LastDataPopup, propsData: { marker: marker, data: lastData.data } }).$mount()
          marker.bindPopup(comp.$el, {
            maxWidth: 560
          });
          marker.openPopup();
        }, 200);

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
    marker.closePopup();
    marker.unbindPopup();
    if (!MapState.popupFixed) { 
      MapState.closeHeapedPopup();
    }
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

  distanceInPixels(map, coord1, coord2) {
    return map.latLngToLayerPoint(coord1)
    .distanceTo(map.latLngToLayerPoint(coord2))
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

  convertDateToYMDH(date) {
    return date.getFullYear().toString() 
        + (date.getMonth() + 1).toString() 
        + date.getDate().toString() 
        + ("0" + date.getHours()).slice(-2);
  },

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  },

}

export default MapUtils



