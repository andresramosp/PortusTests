
import ApiService from "@/services/api.service";
import { BASE_URL_PORTUS } from '@/common/config';

// TODO: init con map ?

const MapService = {

 async addMarkerLayer(map, mapResource, markerClickFunction) {
    var vs = this;
    var result = await ApiService.get(mapResource.resourceApi + (mapResource.locale ? ('?locale=' + 'es') : ''));
    var markers = [];
      result.data.forEach(m => {
        var iconUrl = typeof mapResource.icon === "function" ? mapResource.icon(m) : mapResource.icon;
        var customIcon = L.icon({ iconUrl: require('@/assets/markers/' + iconUrl), iconSize: [17, 17] });
        var marker = L.marker([m.latitud, m.longitud], { icon: customIcon }).bindPopup(m.nombre).on('click', markerClickFunction);;
        marker.mapResource = mapResource;
        Object.assign(marker, m);
        if (mapResource.showAll) {
          marker.addTo(map);
        }
        else {
          map.preloadedMarkers.push(marker);
        }
      });
      vs.checkVisibleMarkerLayers(map);
  },

  async addTimeLineLayer(map, mapResource, vectorial) {
    var vs = this;
    var result = await ApiService.get(mapResource.resourceApi);
    result.data.forEach(res => {
      var tileLayer = L.tileLayer(BASE_URL_PORTUS + res.url + '{d}{h}/' + (vectorial ? 'vec' : 'map') + '//{z}/{x}/{y}.png', {
        tms: true,
        minZoom: res.zoomMin,
        maxZoom: res.zoomMax,
        bounds: L.latLngBounds(L.latLng(res.limN, res.limW), L.latLng(res.limS, res.limE)),
        period: res.numStep,
        strLastate: res.strLastate,
        gaps: res.numGaps
      });
      var portusTimeLayer = L.timeDimension.layer.tileLayer.timeLine(
        tileLayer,
        {}
      );
      portusTimeLayer.mapResource = mapResource;
      map.preloadedTimeLineLayers.push(portusTimeLayer);

      // var rect = L.rectangle([[res.limN, res.limW], [res.limS, res.limE]], { color: 'blue', fillOpacity: 0.0, weight: 1 }).on('click', function (e) {
      //   console.info(e);
      // }).addTo(map);
    })
    vs.checkVisibleTimeLineLayers(map);
  },

  addTileLayer(map, mapResource) {
    var tileLayer = L.tileLayer(mapResource.resourceUrl, {
      tms: mapResource.tms,
    });
    tileLayer.mapResource = mapResource;
    tileLayer.addTo(map);
  },

  removeLayer(map, mapResourceId) {
    map.eachLayer(function (layer) {
      if (layer.mapResource && layer.mapResource.id == mapResourceId)
        layer.remove();
    });
    map.preloadedTimeLineLayers = map.preloadedTimeLineLayers.filter((plt) => { return plt.mapResource.id != mapResourceId });
    map.preloadedMarkers = map.preloadedMarkers.filter((plm) => { return plm.mapResource.id != mapResourceId });
  },

  checkVisibleMarkerLayers(map) {
    var sv = this;
    var zoom = map.getZoom();
    map.preloadedMarkers.forEach(function (marker) {
      if (sv.markerVisible(map, marker)) {
        marker.addTo(map);
      }
      else {
        marker.remove();
      }
    });
  },

  checkVisibleTimeLineLayers(map) {
    var sv = this;
    map.preloadedTimeLineLayers.forEach(function (preLayer) {
      if (sv.tileLayerVisible(map, preLayer._baseLayer)) {
        if (!map.hasLayer(preLayer)) {
          map.options.timeDimensionOptions.period ="PT" + preLayer._baseLayer.options.period + "H";
          // Simulamos siempre cuatro días para adelante, hasta apuntar a Prod
          var date = new Date();
          date.setDate(date.getDate() + 4)
          date.setUTCHours(0, 0, 0, 0);
          map.options.timeDimensionOptions.timeInterval = 'PT192H/' + date.toISOString(); //sv.convertYMDHToDate(preLayer._baseLayer.options.strLastate).toISOString();
          map.timeDimension.initialize(map.options.timeDimensionOptions);
          map.timeDimension.setCurrentTimeIndex(0);
          if (map.timeDimensionControl) {
            map.timeDimensionControl._player.stop();
            map.removeControl(map.timeDimensionControl);
          }
          map.timeDimensionControl = L.control.timeDimension({
            position: "bottomleft",
            playerOptions: {
              transitionTime: 500,
              loopButton: true,
              loop: true
            },
            autoPlay: true
          })
          map.addControl(map.timeDimensionControl);
          preLayer.addTo(map);
          console.log('Added: ' + preLayer._baseLayer._url)
        }
      }
      else {
        if (map.hasLayer(preLayer)) {
          preLayer.remove();
          if (map.timeDimensionControl) {
            map.timeDimensionControl._player.stop();
            map.removeControl(map.timeDimensionControl);
          }
          console.log('Removed: ' + preLayer._baseLayer._url)
        }

      }
    })
  },

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

export default MapService



