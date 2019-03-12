<template>

  <div style="height: 100%">
      <div id="map"></div>
      <span v-if="!isWidget" @click="openFullscreen" class="fullscreenIcon" :class="[align == 'left' ? 'fullScreenIconLeftAlign' : 'fullScreenIconRightAlign', 'fullScreenIcon']"></span>
      <span v-if="!isWidget" class="clockPanel" :class="[align == 'left' ? 'clockLeftAlign' : 'clockRightAlign']" >{{currentTime}} GMT</span>
      <img class="loaderGif" :src="require('@/assets/gifs/loadingBars.gif')" v-show="loading" width="100"  /> 
      <PlayerOptions :isWidget="isWidget"  />
      <NotifyPopup v-if="!isWidget" :messages="mapState.notifyMessages" />
  </div>

</template>

<script>

import MapState from "@/state/map.state";
import PlayerOptions from "@/components/playerOptions.vue"
import NotifyPopup from "@/components/notifyPopup.vue"

export default {
  name: "Map",
  components: {
    PlayerOptions,
    NotifyPopup
  },
  props: {
    zoomControl: { default: true, required: false },
    isWidget: { default: false, required: false },
    mapFixed: false,
    scrollWheelZoom: true,
  },
  data() {
    return {
      mapState: MapState,
      currentTime: null,
      align: PC.options_panel_align
    };
  },
  computed: {
    loading() {
      return this.mapState.loadingThings.length > 0;
    }
  },
  mounted() {
    this.initMap();
    this.startClock();
  },
  methods: {
   
    initMap: function() {

      var mapExtent = PC.map_initial_bounds;
      var bounds = new L.LatLngBounds(
        new L.LatLng(mapExtent[1], mapExtent[0]),
        new L.LatLng(mapExtent[3], mapExtent[2])
      );

      var map = L.map("map", {
        preferCanvas: true,
        // Con restrict_view forzamos decimales en zoom para ajustar
        // zoomSnap: PC.restrict_view_to_initial_bounds ? 0 : 1,
        // zoomDelta: 0.1,
        zoomControl: false,
        closePopupOnClick: false,
        fullscreenControl: true,
        timeDimensionControl: false,
        timeDimension: true,
        timeDimensionOptions: { mapState: this.mapState },
        attributionControl: false
      }).fitBounds(bounds);

      if (PC.restrict_view_to_initial_bounds) 
        map.setMaxBounds(bounds.pad(0.75));

      var baseLayer = L.tileLayer(
        PC.base_layer,
        {
          minZoom: PC.restrict_view_to_initial_bounds ? Math.round(map.getZoom()) : PC.base_layer_min_zoom,
          maxZoom: PC.base_layer_max_zoom,
          tms: false
        }
      );
      baseLayer.addTo(map);

      // var rect = L.rectangle([[mapExtent[1], mapExtent[0]], [mapExtent[3], mapExtent[2]]], { color: 'red', fillOpacity: 0.1, weight: 1 });
      // rect.addTo(map);

      if (!this.mapFixed) {
        L.control.zoom({
          position: PC.options_panel_align == 'right' ? 'topleft' : 'topright'
        }).addTo(map);
        if (!this.scrollWheelZoom) {
           map.scrollWheelZoom.disable();
        }
      } else {
        map.scrollWheelZoom.disable();
        map.dragging.disable();
      }

      map.touchZoom.disable();
     
      var vm = this;
      map.on("moveend", function() {
        if (!MapState.preventMoveend) {
           vm.moveEndTimeOut = setTimeout(() => {
            MapState.setVisibleTimeLineLayers();
            MapState.setVisibleMarkerLayers();
            console.log(map.getZoom());
          }, 750);
        }
       
      });
      map.on("movestart", function() {
        if (vm.moveEndTimeOut)
          clearTimeout(vm.moveEndTimeOut);
      });
      map.on('popupclose', function(e) {
        MapState.popupFixed = false;
      });

      MapState.init(map);
    },

    startClock() {
      var today = new Date();
      var h = today.getUTCHours();
      var m = today.getMinutes();
      var s = today.getSeconds();
      m = this.checkTime(m);
      s = this.checkTime(s);
      this.currentTime = h + ":" + m + ":" + s;
      var t = setTimeout(this.startClock, 500);
    },

    checkTime(i) {
      if (i < 10) {i = "0" + i}; 
      return i;
    },

    openFullscreen() {
      var route = this.$router.resolve({ path: "/"});
      var w = window.open(route.href,'customWindow',
                                     'toolbar=no,'
                                   + 'location=no,'
                                   + 'status=no,'
                                   + 'menubar=no,'
                                   + 'scrollbars=yes,'
                                   + 'resizable=yes,'
                                   + 'width=' + screen.availWidth
                                   + ',height=' + screen.availHeight);
     
    }
  }
};
</script>

<style scoped>

.clockPanel {
  position: absolute;
  top: 10px;
  z-index: 7;
  padding-top: 6px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 6px;
  font-size: 13px;
}

.clockRightAlign {
  left: 50px;
}

.clockLeftAlign {
  right: 50px;
}


.fullscreenIcon {
  position: absolute;
  top: 10px;
  width: 31px;
  height: 31px;
  z-index: 7;
  padding: 3.5px;
  cursor: pointer;
}

.fullScreenIconRightAlign {
  left: 10px;
}

.fullScreenIconLeftAlign {
  right: 10px;
}

</style>

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

.loaderGif {
    position: absolute;
    z-index: 5;
    right: 55px;
    /* bottom: 50px; */
    bottom: 70px;
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