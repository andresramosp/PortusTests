import { MarkerClass } from "@/common/enums";
import ApiService from "@/services/api.service";
import MapState from "@/state/map.state";

import RTDataPopup from "@/components/markerPopups/RTDataPopup.vue";
import HeapedMarkersPopup from "@/components/markerPopups/heapedMarkersPopup.vue";
import SimpleMarkerPopup from "@/components/markerPopups/simpleMarkerPopup.vue";
import Vue from 'vue';

const MapUtils = {

  tileLayerVisible(map, layer) {
    return map.getBounds().intersects(layer.options.bounds)
      && (layer.options.minZoom <= map.getZoom() && (map.getZoom() <= layer.options.maxZoom));
  },

  markerVisible(map, marker) {
    if (marker instanceof L.Marker) {
      var minZoom;
      if (marker.mapResource.minZoom && typeof marker.mapResource.minZoom === "function") {
        minZoom = marker.mapResource.minZoom(marker);
      }
      else {
        minZoom = marker.minZoom ? marker.minZoom : (marker.mapResource.minZoom ? marker.mapResource.minZoom : 0);
      }
      return map.getBounds().contains(marker.getLatLng()) // + buffer
          && (map.getZoom() >= minZoom);
    }
    else {
      return (!marker.minZoom || map.getZoom() >= marker.minZoom) 
          && (!marker.maxZoom || map.getZoom() < marker.maxZoom);
    }
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
    //this.closeMarkerPopup(map, marker);
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
        this.hoverEffect(map, marker, true);
      }
      
    }
  },

  markerMouseOut(map, marker) {
    if (marker.timeOut) {
      clearTimeout(marker.timeOut);
    }
    this.hoverEffect(map, marker, false);
    this.closeMarkerPopup(map, marker);
  },


  hoverEffect(map, marker, activate) {
    if (activate) {
      if (!this.hovered) {
        var markersAtPoint = this.getMarkersById(map, marker.id);
        markersAtPoint.forEach(m => {
          var icon = m.options.icon;
          icon.options.iconSize = [icon.options.iconSize[0] + 5, icon.options.iconSize[1] + 5];
          m.setIcon(icon);
          m.hovered = true;
        });
      }
    }
    else {
      if (marker.hovered) {
        var markersAtPoint = this.getMarkersById(map, marker.id);
        markersAtPoint.forEach(m => {
          var icon = m.options.icon;
          icon.options.iconSize = [icon.options.iconSize[0] - 5, icon.options.iconSize[1] - 5];
          m.setIcon(icon);
          m.hovered = false;
        });
      }
     
    }
     
  },

  async openMarkerPopup(map, marker) {
    if (marker.mapResource.markerClass == MarkerClass.EstacionRT) {
        marker.timeOut = setTimeout(async () => {
          var markersAtPoint = this.getMarkersById(map, marker.id);
          var lastData = await ApiService.post('lastData/station/' + marker.id + '?locale=' + Vue.$getLocale(),
          markersAtPoint.map(m => { return m.mapOption.variableType }), true);
          marker.lastDataComponent  = new Vue({ ...RTDataPopup, propsData: { marker: marker, data: lastData.data } }).$mount()
          marker.bindPopup(marker.lastDataComponent.$el, {
            maxWidth: 560,
            offset: [0, 0]
          });
          marker.openPopup();
        }, 250);
    }
    else {
      new Vue({ ...SimpleMarkerPopup, 
        propsData: {  marker: marker } 
      }).$mount()
    }

  },

  closeMarkerPopup(map, marker) {
    marker.closePopup();
    marker.unbindPopup();
    if (!MapState.popupFixed) { 
      MapState.closeHeapedPopup();
    }
    if (marker.lastDataComponent) {
      marker.lastDataComponent.$destroy();
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
    var distance = map.latLngToLayerPoint(coord1)
    .distanceTo(map.latLngToLayerPoint(coord2));
    return distance;
  },

  distanceInMeters(originLatLng, destLatLng) {
    var lon1 = originLatLng.lng * Math.PI / 180,
        lat1 = originLatLng.lat * Math.PI / 180,
        lon2 = destLatLng.lng * Math.PI / 180,
        lat2 = destLatLng.lat * Math.PI / 180;

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
  },

  convertYMDHToDate(str) {
    var year = str.substring(0, 4);
    var month = str.substring(4, 6);
    var day = str.substring(6, 8);
    var hour = str.substring(8, 10);
    var date = new Date(year, month - 1, day, hour);
    date.setHours(hour, 0, 0, 0);
    return date;
  },

  convertYMDHToDateStr(str) {
    var year = str.substring(0, 4);
    var month = str.substring(4, 6);
    var day = str.substring(6, 8);
    var hour = str.substring(8, 10);
    return year + '-' + ("0" + month).slice(-2) + '-' + ("0" + day).slice(-2) + 'T' + ("0" + hour).slice(-2) + ':00:00.000Z';
  },

  convertDateToYMDH(date) {
    return date.getFullYear().toString() 
        + (date.getMonth() + 1).toString() 
        + date.getDate().toString() 
        + ("0" + date.getHours()).slice(-2);
  },

  getDirNameFromDeg(degrees) {
    degrees = (degrees + 180) % 360;
        	
    if (degrees >= 338 || degrees <= 21) {
      return 'N';
      
    } else if (degrees >= 22 && degrees <= 67) {
      return 'NE';
      
    } else if (degrees >= 68 && degrees <= 112) {
      return 'E';
      
    } else if (degrees >= 113 && degrees <= 157) {
      return 'SE';
      
    } else if (degrees >= 158 && degrees <= 202) {
      return 'S';
      
    } else if (degrees >= 203 && degrees <= 247) {
      return 'SW';
      
    } else if (degrees >= 248 && degrees <= 292) {
      return 'W';
      
    } else if (degrees >= 293 && degrees <= 337) {
      return 'NW';
    }
    
    return 'N';
  },

  getMarkerName(marker) {
    return marker.nombre ? marker.nombre
     : this.latLonToString(marker.latitud, marker.longitud);
  },

  latLonToString(lat, lon) {
    var N = Vue.$getLocale() == 'es' ? 'N' : 'N';
    var S = Vue.$getLocale() == 'es' ? 'S' : 'S';
    var E = Vue.$getLocale() == 'es' ? 'E' : 'E';
    var O = Vue.$getLocale() == 'es' ? 'O' : 'W';
    return 'Lat ' + Math.abs(lat).toFixed(2) + '° ' + (lat >= 0 ? N : S) + ", " 
         + 'Lon ' + Math.abs(lon).toFixed(2) + '° ' + (lon >= 0 ? E : O);
  },

  latToString(lat) {
    return Math.abs(lat).toFixed(2) + '° ' + (lat >= 0 ? 'N' : 'S'); 
  },

  lonToString(lon) {
    var E = Vue.$getLocale() == 'es' ? 'E' : 'E';
    var O = Vue.$getLocale() == 'es' ? 'O' : 'W';
    return Math.abs(lon).toFixed(2) + '° ' + (lon >= 0 ? E : O); 
  },

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  },

}

export default MapUtils






