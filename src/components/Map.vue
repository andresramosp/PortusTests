<template>
<div class="row">
   <div class="col-md-9">
        <div id="map"></div>
    </div>
    <div class="col-md-3">
       <LayersPanel2 :mapOptions="mapOptions" @add-layer="addLayer" @remove-layer="removeLayer" /> 
    </div>
    <slot></slot>
</div>
</template>

<script>
import LayersPanel2 from "@/components/LayersPanel2.vue";
import ApiService from "@/api/api.service";

export default {
  name: "Map",
  components: {
    LayersPanel2
  },
  props: {
    mapResources: Array,
    mapOptions: Array,
    baseMap: Object
  },
  data() {
    return {
      map: null
    };
  },
  watch: {
    baseMap: function(oldValue, newValue) {
      this.setBaseLayer();
    }
  },
  mounted() {
    this.initMap();
    this.setBaseLayer();
  },
  methods: {
    getMap: function(found) {
      return this.map;
    },
    addLayer: function(mapResourceId) {
      var vm = this;
      var mapResource = this.mapResources.filter(mr => { return mr.id == mapResourceId })[0];
      if (mapResource.type == "FeatureLayer") {
        ApiService.get(mapResource.resourceApi).then(result => {
          var markers = [];
          result.data.forEach(m => {
            var customIcon = mapResource.icon ? L.icon({ iconUrl: require('@/assets/markers/' + mapResource.icon) }) : { };
            var marker = L.marker([m.latitud, m.longitud], { icon: customIcon }).bindPopup(m.nombre);
            Object.assign(marker, m); // copiamos todas las props que pueda traer el marker
            markers.push(marker);
          });
          var featureGroupLayer = L.featureGroup(markers);
          featureGroupLayer.mapResource = mapResource;
          featureGroupLayer.addTo(this.map);
          this.checkVisibleLayerAtZoom();
        });
      } else if (mapResource.type == "TileLayer.TimeLine") {
        var tileLayer = L.tileLayer(mapResource.resourceUrl, {
          tms: mapResource.tms
        });
        var portusTimeLayer = L.timeDimension.layer.tileLayer.timeLine(
          tileLayer,
          {}
        );
        portusTimeLayer.mapResource = mapResource;
        portusTimeLayer.addTo(this.map);
      } else if (mapResource.type == "TileLayer") {
        var tileLayer = L.tileLayer(mapResource.resourceUrl, {
          tms: mapResource.tms
        });
        tileLayer.mapResource = mapResource;
        tileLayer.addTo(this.map);
      }
    },
    removeLayer: function(mapResourceId) {
      this.map.eachLayer(function(layer) {
        if (layer.mapResource && layer.mapResource.id == mapResourceId) 
          layer.remove();
      });
    },
    initMap: function() {
      var mapExtent = [-13.22547087, 31.27732673, 56.43171235, 69.50672323];
      var bounds = new L.LatLngBounds(
        new L.LatLng(mapExtent[1], mapExtent[0]),
        new L.LatLng(mapExtent[3], mapExtent[2])
      );

      var startDate = new Date();
      startDate.setUTCHours(0, 0, 0, 0);
      //startDate.setDate(startDate.getDate()-55);

      this.map = L.map("map", {
        fullscreenControl: true,
        timeDimensionControl: true,
        timeDimensionControlOptions: {
          position: "bottomleft",
          playerOptions: {
            transitionTime: 1000
          }
        },
        timeDimension: true,
        timeDimensionOptions: {
          timeInterval: startDate.toISOString() + "/PT72H",
          period: "PT3H"
        }
      }).fitBounds(bounds);

      var vm = this;
      this.map.on("zoomend", function() {
        vm.checkVisibleLayerAtZoom();
      });

      L.Control.measureControl().addTo(this.map);
    },
    checkVisibleLayerAtZoom: function() {
      var vm = this;
      var zoom = this.map.getZoom();
      this.map.eachLayer(function(layer) {
        if (layer instanceof L.FeatureGroup) {
          var markers = layer.getLayers();
          markers.forEach(m => {
            var minZoom = m.minZoom ? m.minZoom : (layer.mapResource.minZoom ? layer.mapResource.minZoom : 0);
            m.setOpacity(zoom > minZoom ? 1 : 0.0);
          });
        }
        // Opción de zoom contra servidor

        //  LayersService.get(layer.resource, zoom)
        //   .then(markers => {
        //     markers.forEach(m => {
        //      var marker = L.marker([m.lat, m.lon]).bindPopup(m.name);
        //      marker.addTo(vm.map);
        //     // TODO: limpiar layer y añadirlos ahí
        //     })
        //   });
      });
    },
    setBaseLayer: function() {
      if (this.baseMap) {
        this.baseMap.addTo(this.map);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  z-index: 1;
  height: 600px;
}

#slider {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 5;
}
</style>