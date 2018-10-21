<template>
<div class="row">
   <div class="col-md-9">
        <div id="map"></div>
    </div>
    <div class="col-md-3">
       <LayersPanel :mapOptions="mapOptions" @add-layer="addLayer" @remove-layer="removeLayer" /> 
    </div>
    <slot></slot>
</div>
</template>

<script>

import LayersPanel from "@/components/LayersPanel.vue";
import MapService from "@/services/map.service";

export default {
  name: "Map",
  components: {
    LayersPanel
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
    markerClick: function (evt) {
      this.$emit('marker-click', evt.sourceTarget)
    },
    addLayer: function(mapResourceId) {
      MapService.addLayer(this, mapResourceId);
    },
    removeLayer: function(mapResourceId) {
      this.map.eachLayer(function(layer) {
        if (layer.mapResource && layer.mapResource.id == mapResourceId) 
          layer.remove();
      });
      this.map.preloadedTileLayers = this.map.preloadedTileLayers.filter((plt) => { return plt.mapResource.id != mapResourceId});
      if (this.map.preloadedTileLayers.length == 0)
        this.map.removeControl(this.map.timeDimensionControl);
    },
    initMap: function() {
      var mapExtent = [-13.22547087, 31.27732673, 56.43171235, 69.50672323];
      var bounds = new L.LatLngBounds(
        new L.LatLng(mapExtent[1], mapExtent[0]),
        new L.LatLng(mapExtent[3], mapExtent[2])
      );

      var startDate = new Date();
      startDate.setUTCHours(0, 0, 0, 0);
      //startDate.setDate(startDate.getDate());

      this.map = L.map("map", {
        zoomSnap: 0.1,
        fullscreenControl: true,
        timeDimensionControl: true,
        timeDimensionControlOptions: {
          position: "bottomleft",
          playerOptions: {
            transitionTime: 1000,
            loopButton: true,
            loop: true
          },
          autoPlay: true
        },
        timeDimension: true,
        timeDimensionOptions: {
          timeInterval: startDate.toISOString() + "/PT72H",
          period: "PT24H",
          //loadingTimeout: 1000
        }
      }).fitBounds(bounds);

      this.map.preloadedTileLayers = [];

      var vm = this;
      this.map.on("zoomend", function() {
        vm.checkVisibleLayers();
        console.log('Zoom: ' + vm.map.getZoom());
      });

      this.map.on("moveend", function() {
        vm.checkVisibleLayers();
      });

      L.Control.measureControl().addTo(this.map);
    },

    checkVisibleLayers: function() {
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
     
      });
      // TODO: probar algún tipo de marcado activo / inactivo, o jugar con opacity, para evitar la lista auxiliar 
      this.map.preloadedTileLayers.forEach(function (preLayer) {
        if (MapService.tileLayerInZoomAndExtent(vm.map, preLayer._baseLayer)) {
          if (!vm.map.hasLayer(preLayer)) {
            vm.map.options.timeDimensionOptions.period = "PT" + preLayer._baseLayer.options.period + "H";
            vm.map.timeDimension.initialize(vm.map.options.timeDimensionOptions);
            vm.map.timeDimension.setCurrentTimeIndex(0);
            vm.map.removeControl(vm.map.timeDimensionControl);
            vm.map.addControl(vm.map.timeDimensionControl);
            preLayer.addTo(vm.map);
            console.log('Added: ' + preLayer._baseLayer._url)
          }
        }
        else {
          if (vm.map.hasLayer(preLayer)) {
            preLayer.remove();
            vm.map.removeControl(vm.map.timeDimensionControl);
            console.log('Removed: ' + preLayer._baseLayer._url)
          }
          
        }
      })
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