
import ApiService from "@/services/api.service";
import { BASE_URL_PORTUS } from '@/common/config';

const MapService = {

  tileLayerInZoomAndExtent(map, layer) {
    return map.getBounds().intersects(layer.options.bounds) && (layer.options.minZoom < map.getZoom() && map.getZoom() < layer.options.maxZoom);
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
          // TODO: map / vec
          var urls = [];
          result.data.forEach(res => {
            // Evitamos que se repitan dominios / url. Preguntar por qué hay repetidos en la BD (corrientes)
            if (urls.indexOf(res.url) == -1) { 
              var tileLayer = L.tileLayer(BASE_URL_PORTUS + res.url + '{d}{h}/vec//{z}/{x}/{y}.png', {
                tms: true,
                minZoom: res.zoomMin,
                maxZoom: res.zoomMax,
                bounds: L.latLngBounds(L.latLng(res.limN, res.limW), L.latLng(res.limS, res.limE)),
                period: res.numStep,
                gaps: res.numGaps
              });
               var portusTimeLayer = L.timeDimension.layer.tileLayer.timeLine(
                tileLayer,
                 {}
              );
              portusTimeLayer.mapResource = mapResource; 
              mapComponent.map.preloadedTileLayers.push(portusTimeLayer);

              var rect = L.rectangle([[res.limN, res.limW], [res.limS, res.limE]], {color: 'blue', fillOpacity: 0.0, weight: 1}).on('click', function (e) {
                console.info(e);
              }).addTo(mapComponent.map);

              urls.push(res.url);
            }
          })
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
}

export default MapService



