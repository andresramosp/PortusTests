<template>

<div style="height: 100%">
    <div id="map"></div>
    <img class="loaderGif" :src="require('@/assets/gifs/loading.gif')" v-show="loading" width="70" height="70" />
    <div v-show="mapState.predictionScaleImg">
       <img class="predictionScale" :src="mapState.predictionScaleImg" />
       <img v-show='predictionWidget' class="predictionWidgetIcon" @click="openPredictionWidget()" :src="require('@/assets/icons/predictionWidget.png')" />
    </div>
   </div>

</template>

<script>

import MapState from "@/state/map.state";

export default {
  name: "Map",
  props: {
    baseMap: Object,
    zoomControl: { default: true, required: false },
    predictionWidget: { default: true, required: false }
  },
  data() {
    return {
      mapState: MapState
    };
  },
  watch: {
    baseMap: function(oldValue, newValue) {
      this.setBaseLayer();
    }
  },
  computed: {
    loading() {
      return this.mapState.loadingThings.length > 0;
    }
  },
  mounted() {
    this.initMap();
    this.setBaseLayer();
  },
  methods: {
   
    initMap: function() {
      var mapExtent = PC.map_initial_bounds;
      var bounds = new L.LatLngBounds(
        new L.LatLng(mapExtent[1], mapExtent[0]),
        new L.LatLng(mapExtent[3], mapExtent[2])
      );

      var map = L.map("map", {
        zoomSnap: 0.1,
        zoomControl: false,
        closePopupOnClick: false,
        fullscreenControl: true,
        timeDimensionControl: false,
        timeDimension: true,
        timeDimensionOptions: { mapState: this.mapState }
      }).fitBounds(bounds);

      if (this.zoomControl) {
        L.control.zoom({
          position: PC.options_panel_align == 'right' ? 'topleft' : 'topright'
        }).addTo(map);
      }
     
      var vm = this;
      map.on("zoomend", function() {
        MapState.setVisibleMarkerLayers();
        MapState.setVisibleTimeLineLayers();
        console.log("Zoom: " + vm.mapState.map.getZoom());
      });
      map.on("moveend", function() {
        MapState.setVisibleMarkerLayers();
        MapState.setVisibleTimeLineLayers();
      });
      map.on('popupclose', function(e) {
        MapState.popupFixed = false;
      });
      MapState.init(map);
    },

    setBaseLayer: function() {
      if (this.baseMap) {
        MapState.setBaseLayer(this.baseMap);
      }
    },

    openPredictionWidget: function() {

      var map = MapState.getMap();
      var currentPredLayer = null;

      map.eachLayer(function (layer) {
        if (layer.mapResource && layer.mapResource.type == 'TimeLineLayer') {
          currentPredLayer = layer;
        }
      });

      if (currentPredLayer) {
        var routeData = this.$router.resolve({ path: '/predictionWidget', 
          query: 
          { 
            resourceId : currentPredLayer.mapResource.id.replace('pred-tiles-', ''), 
            zoom: map.getZoom(), 
            lat: map.getCenter().lat, 
            lon: map.getCenter().lng,
            vec: currentPredLayer._baseLayer._url.indexOf('vec') != -1
          }
        });
        window.open(routeData.href, '_blank');
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

.predictionWidgetIcon {
    position: absolute;
    z-index: 2;
    left: 41%;
    bottom: 8px;
    width: 35px;
    height: 35px;
    border-radius: 6px;
    cursor: pointer;
}

.loaderGif {
    position: absolute;
    z-index: 5;
    right: 55px;
    bottom: 20px;
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

.blueTheme {
  background-color: rgba(0, 123, 255, 0.6);
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