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
      MapService.removeLayer(this.map, mapResourceId);
      if (this.map.preloadedTimeLineLayers.length == 0)
        this.map.removeControl(this.map.timeDimensionControl);
    },
    initMap: function() {
      var mapExtent = [-13.22547087, 31.27732673, 56.43171235, 69.50672323];
      var bounds = new L.LatLngBounds(
        new L.LatLng(mapExtent[1], mapExtent[0]),
        new L.LatLng(mapExtent[3], mapExtent[2])
      );

      this.map = L.map("map", {
        zoomSnap: 0.1,
        fullscreenControl: true,
        timeDimensionControl: false,
        timeDimension: true,
        timeDimensionOptions: { }
      }).fitBounds(bounds);

      this.map.preloadedTimeLineLayers = [];

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
      MapService.checkVisibleFeatureLayers(this.map);
      MapService.checkVisibleTimeLineLayers(this.map);
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