<template>

<div style="height: 100%">
    <div id="map"></div>
    <LayersPanel :mapOptions="mapOptions" @option-click="mapOptionClick" /> 
    <FloatingLayerOptions v-for="mapOption in activeMapOptions" :key="mapOption.id" :mapOption="mapOption" />
    <MarkerInfoPanel :marker='markerSelected' />
    <img class="predictionScale" :src="predictionScaleImg" />
</div>

</template>

<script>

import LayersPanel from "@/components/layersPanel.vue";
import FloatingLayerOptions from "@/components/floatingLayerOptions.vue";
import MarkerInfoPanel from "@/components/markerInfoPanel.vue";
import MapState from "@/state/map.state";

export default {
  name: "Map",
  components: {
    LayersPanel,
    FloatingLayerOptions,
    MarkerInfoPanel
  },
  props: {
    mapResources: Array,
    mapOptions: Array,
    baseMap: Object
  },
  data() {
    return {
      map: null,
      activeMapOptions: [],
      predictionScaleImg: null,
      markerSelected: null
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
    markerClick: function(evt) {
      var marker = evt.sourceTarget;
      this.markerSelected = marker;
    },

    mapOptionClick: function(mapOption) {
      if (mapOption.active)
        this.activeMapOptions.push(mapOption);
      else
        this.activeMapOptions = this.activeMapOptions.filter(opt => { return opt.id != mapOption.id});
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

      var vm = this;
      this.map.on("zoomend", function() {
        MapState.setVisibleMarkerLayers();
        MapState.setVisibleTimeLineLayers();
        console.log("Zoom: " + vm.map.getZoom());
      });
      this.map.on("moveend", function() {
        MapState.setVisibleMarkerLayers();
        MapState.setVisibleTimeLineLayers();
      });
      this.map.on("layeradd", function(e) {
        if (e.layer.options.predictionScaleImg) {
          vm.predictionScaleImg = e.layer.options.predictionScaleImg;
        }
        if (e.layer.mapResource && e.layer.mapResource.type == "MarkerLayer") {
          e.layer.on("click", vm.markerClick);
        }
      });
      this.map.on("layerremove", function(e) {
        if (e.layer.options.predictionScaleImg) {
          vm.predictionScaleImg = "";
        }
      });

      MapState.init(this.map);
    },
    setBaseLayer: function() {
      if (this.baseMap) {
        MapState.setBaseLayer(this.baseMap);
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

.predictionScale {
  position: absolute;
  z-index: 2;
  left: 55%;
  bottom: -3px;
  padding: 10px;
  border-radius: 6px;
  width: 27%;
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

.leaflet-marker-icon,
.leaflet-marker-shadow {
  -webkit-animation: fadein 1s; /* Safari, Chrome and Opera > 12.1 */
  -moz-animation: fadein 1s; /* Firefox < 16 */
  -ms-animation: fadein 1s; /* Internet Explorer */
  -o-animation: fadein 1s; /* Opera < 12.1 */
  animation: fadein 1s;
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
</style>