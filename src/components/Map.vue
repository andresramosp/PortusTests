<template>
<div class="row" style="height: 100%">
   <div class="col-md-12">
        <div  id="map"></div>
    </div>
    <div >
       <LayersPanel :mapOptions="mapOptions" @option-click="mapOptionClick" /> 
    </div>
          <!-- COMPONENTE FLOATING OPTIONS PANEL -->

          <div class="floatingPanel" v-if="floatingOptions.length > 0">
            <div class="form-check" v-for="floatingOption in floatingOptions" :key="floatingOptions.indexOf(floatingOption)">
               <label class="form-check-label">
                <input class="form-check-input" type="checkbox" v-model="floatingOption.active" @change="floatingOptionChanged(floatingOption)" />
                 {{ floatingOption.name }}
               </label>
            </div> 
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
      return this.mapResources.find(mr => {
        return mr.id == mapResourceId;
      });
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
          vm.floatingOptions.push({
            name: "Dirección",
            type: "shiftIsoVectorial",
            resourceId: resId
          });
        }
      });
    },
    hideFloatingOptionsPanel: function() {
      this.floatingOptions = [];
    },
    floatingOptionChanged: function(floatingOption) {
      // Ir a MapService
      this[floatingOption.type](
        floatingOption.resourceId,
        floatingOption.active
      );
    },
    shiftIsoVectorial: function(mapResourceId, vectorial) {
      MapService.removeLayer(this.map, mapResourceId);
      var mapResource = this.getMapResource(mapResourceId);
      MapService.addTimeLineLayer(this.map, mapResource, vectorial); // TileLayer (reflexión)
    },
    addLayer: function(mapResourceId) {
      var vm = this;
      var mapResource = this.getMapResource(mapResourceId);
      MapService["add" + mapResource.type](
        this.map,
        mapResource,
        mapResource.type == "FeatureLayer" ? this.markerClick : null
      );
    },
    removeLayer: function(mapResourceId) {
      MapService.removeLayer(this.map, mapResourceId);
      if (this.map.preloadedTimeLineLayers.length == 0)
        this.map.removeControl(this.map.timeDimensionControl);
    },
    initMap: function() {
      var mapExtent = PC.map_initial_bounds;
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
<style >
#map {
  z-index: 1;
  height: 100%;
}

#slider {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 5;
}

.floatingPanel {
  position: absolute;
  z-index: 2;
  background-color: rgba(0, 123, 255, 0.5);
  right: 9px;
  top: 500px;
  padding: 10px;
  border-radius: 6px;
  color: white;
  font-size: 17px;
}

input[type="checkbox"] {
  width: 1.1em;
  height: 1.1em;
  padding-right: 3px;
  
}

.form-check {
  padding-top: 1px;
}

.form-check-input {
  margin-right: 5px;
}

.leaflet-marker-icon-fadein,
.leaflet-marker-shadow-fadein {
  -webkit-animation: fadein 1s; /* Safari, Chrome and Opera > 12.1 */
  -moz-animation: fadein 1s; /* Firefox < 16 */
  -ms-animation: fadein 1s; /* Internet Explorer */
  -o-animation: fadein 1s; /* Opera < 12.1 */
  animation: fadein 1s;
  animation-delay: 10s;
}

.leaflet-marker-icon-fadeout,
.leaflet-marker-shadow-fadeout {
  animation: fadeout 1s;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeout {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Firefox < 16 */
@-moz-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Safari, Chrome and Opera > 12.1 */
@-webkit-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Internet Explorer */
@-ms-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Opera < 12.1 */
@-o-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* .leaflet-tile{ 
  filter: blur(10px);
}
.leaflet-tile.leaflet-tile-loaded{
  filter: blur(0);
  transition: .6s all ease-in;
} */
</style>