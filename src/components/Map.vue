<template>
<div class="row">
   <div class="col-md-9">
        <div id="map"></div>
        
        <!-- COMPONENTE FLOATING OPTIONS PANEL -->
        <div v-if="floatingOptions.length > 0">
          <div class="form-check" v-for="floatingOption in floatingOptions" :key="floatingOptions.indexOf(floatingOption)">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox" v-model="floatingOption.active" @change="floatingOptionChanged(floatingOption)" />
              {{ floatingOption.name }}
            </label>
          </div> 
        </div>

    </div>
    <div class="col-md-3">
       <LayersPanel :mapOptions="mapOptions" @option-click="mapOptionClick" /> 
    </div>
    <slot></slot>
</div>
</template>

<script>
import LayersPanel from "@/components/layersPanel.vue";
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
      map: null,
      floatingOptions: []
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
    getMapResource: function(mapResourceId) {
      return this.mapResources.find(mr => { return mr.id == mapResourceId; }); 
    },
    markerClick: function(evt) {
      this.$emit("marker-click", evt.sourceTarget);
    },
    mapOptionClick: function(mapOption) {
      if (mapOption.active) {
        mapOption.mapResources.forEach(resId => {
          this.addLayer(resId);
        });
        this.showFloatingOptionsPanel(mapOption);
      } else {
        mapOption.mapResources.forEach(resId => {
          this.removeLayer(resId);
        });
        this.hideFloatingOptionsPanel();
      }
    },
    showFloatingOptionsPanel: function(mapOption) {
      var vm = this;
      mapOption.mapResources.forEach(resId => {
          var mapResource = this.getMapResource(resId);
          if (mapResource.vectors) {
            vm.floatingOptions.push({ name: 'Dirección', type: 'shiftIsoVectorial', resourceId: resId });
          }
        });
    },
    hideFloatingOptionsPanel: function() {
      this.floatingOptions = [];
    },
    floatingOptionChanged: function(floatingOption) {
      // Ir a MapService
      this[floatingOption.type](floatingOption.resourceId, floatingOption.active);
    },
    shiftIsoVectorial: function(mapResourceId, vectorial) {
      MapService.removeLayer(this.map, mapResourceId);
      var mapResource = this.getMapResource(mapResourceId);
      MapService.addTimeLineLayer(this.map, mapResource, vectorial); // TileLayer (reflexión)
    },
    addLayer: function(mapResourceId) {
      var vm = this;
      var mapResource = this.getMapResource(mapResourceId);
      MapService['add' + mapResource.type](this.map, mapResource, mapResource.type == "FeatureLayer" ? this.markerClick : null)
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
        timeDimensionOptions: {}
      }).fitBounds(bounds);

      this.map.preloadedTimeLineLayers = [];

      var vm = this;
      this.map.on("zoomend", function() {
        MapService.checkVisibleFeatureLayers(vm.map);
        MapService.checkVisibleTimeLineLayers(vm.map);
        console.log("Zoom: " + vm.map.getZoom());
      });
      this.map.on("moveend", function() {
        MapService.checkVisibleFeatureLayers(vm.map);
        MapService.checkVisibleTimeLineLayers(vm.map);
      });

      L.Control.measureControl().addTo(this.map);
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