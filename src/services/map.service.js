
import ApiService from "@/services/api.service";
import { BASE_URL_PORTUS } from '@/common/config';

// TODO: init con map ?

const MapService = {

  tileLayerInZoomAndExtent(map, layer) {
    return map.getBounds().intersects(layer.options.bounds)
      && (layer.options.minZoom < map.getZoom() && (map.getZoom() < layer.options.maxZoom));
  },
  addLayer(mapComponent, mapResourceId) {
    var mapResource = mapComponent.mapResources.filter(mr => { return mr.id == mapResourceId })[0];
    if (mapResource.type == "FeatureLayer") {
      ApiService.get(mapResource.resourceApi).then(result => {
        var markers = [];
        result.data.forEach(m => {
          var customIcon = mapResource.icon ? L.icon({ iconUrl: require('@/assets/markers/' + mapResource.icon), iconSize: [17, 17] }) : {};
          var marker = L.marker([m.latitud, m.longitud], { icon: customIcon }).bindPopup(m.nombre).on('click', mapComponent.markerClick);;
          // copiamos todas las props que pueda traer el marker
          Object.assign(marker, m);
          markers.push(marker);
        });
        var featureGroupLayer = L.featureGroup(markers);
        featureGroupLayer.mapResource = mapResource;
        featureGroupLayer.addTo(mapComponent.map);
        mapComponent.checkVisibleLayers();
      });
    } else if (mapResource.type == "TileLayer.TimeLine") {
      // Tenemos la URL de los tiles (solo una)
      if (mapResource.resourceUrl) {
        var tileLayer = L.tileLayer(mapResource.resourceUrl, {
          tms: mapResource.tms
        });
        var portusTimeLayer = L.timeDimension.layer.tileLayer.timeLine(
          tileLayer,
          {}
        );
        portusTimeLayer.mapResource = mapResource;
        portusTimeLayer.addTo(mapComponent.map);
      }
      // No tenemos la URL de los tiles y tenemos que traerla de la API (podrán ser varias)
      else {
        ApiService.get(mapResource.resourceApi).then(result => {
          result.data.forEach(res => {
            var tileLayer = L.tileLayer(BASE_URL_PORTUS + res.url + '{d}{h}/map//{z}/{x}/{y}.png', {
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
            mapComponent.map.preloadedTimeLineLayers.push(portusTimeLayer);

            var rect = L.rectangle([[res.limN, res.limW], [res.limS, res.limE]], { color: 'blue', fillOpacity: 0.0, weight: 1 }).on('click', function (e) {
              console.info(e);
            }).addTo(mapComponent.map);
          })
          mapComponent.checkVisibleLayers();
        });
      }
    } else if (mapResource.type == "TileLayer") {
      var tileLayer = L.tileLayer(mapResource.resourceUrl, {
        tms: mapResource.tms,
        // TODO: zoom y extent explícitos
      });
      tileLayer.mapResource = mapResource;
      tileLayer.addTo(mapComponent.map);
    }
  },
  removeLayer(map, mapResourceId) {
    map.eachLayer(function(layer) {
      if (layer.mapResource && layer.mapResource.id == mapResourceId) 
        layer.remove();
    });
    map.preloadedTimeLineLayers = map.preloadedTimeLineLayers.filter((plt) => { return plt.mapResource.id != mapResourceId});
  },
  checkVisibleFeatureLayers(map) {
    var zoom = map.getZoom();
    map.eachLayer(function(layer) {
      if (layer instanceof L.FeatureGroup) {
        var markers = layer.getLayers();
        markers.forEach(m => {
          var minZoom = m.minZoom ? m.minZoom : (layer.mapResource.minZoom ? layer.mapResource.minZoom : 0);
          m.setOpacity(zoom > minZoom ? 1 : 0.0);
        });
      }
    });
  },
  checkVisibleTimeLineLayers(map) {
    var sv = this;
    map.preloadedTimeLineLayers.forEach(function (preLayer) {
      if (sv.tileLayerInZoomAndExtent(map, preLayer._baseLayer)) {
        if (!map.hasLayer(preLayer)) {
          map.options.timeDimensionOptions.period = "PT" + preLayer._baseLayer.options.period + "H";
          map.options.timeDimensionOptions.timeInterval = 'PT72H/' + sv.convertYMDHToDate(preLayer._baseLayer.options.strLastate).toISOString();
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



