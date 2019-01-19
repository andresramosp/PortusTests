<template>
  <div v-show="playingTimeLineLayer">
       <img :src="mapState.predictionScaleImg" class="predictionScale fadeIn" />
         <dx-date-box
            class="datePicker datePicker-left fadeIn"
            :value="mapState.playerDateRangeFromValue"
            @valueChanged="changeDateFromValue"
            type="date"
            display-format="dd/MMM/yy"
          />
           <dx-date-box
            class="datePicker datePicker-right fadeIn"
            :value="mapState.playerDateRangeToValue"
            @valueChanged="changeDateToValue"
            :max="null"
            type="date"
            display-format="dd/MMM/yy"
            :use-mask-behavior="true"
          />
       <img v-show='hasVectors' class="vectorsIcon fadeIn" @click="toggleVectors()" :src="require('@/assets/icons/vectors.png')" />
       <img v-show='predictionWidget' class="predictionWidgetIcon fadeIn" @click="openPredictionWidget()" :src="require('@/assets/icons/predictionWidget.png')" />
       <img v-show='staticMapsWidget && hasStaticMaps' class="staticMapsWidgetIcon fadeIn" @click="openStaticMapsWidget()" :src="require('@/assets/icons/staticMapsWidget.png')" />
    </div>
</template>

<script>

import MapState from "@/state/map.state";
import { DxDateBox } from 'devextreme-vue';

export default {
  name: "AnimationPlayer",
   components: {
    DxDateBox
  },
  data() {
    return {
      align: PC.options_panel_align,
      mapState: MapState
    };
  },
  props: {
    predictionWidget: { default: true, required: false },
    staticMapsWidget: { default: true, required: false },
  },
  computed: {
      playingTimeLineLayer() {
        return this.mapState.currentTimeLineLayer != null;
      },
      hasStaticMaps() {
        return this.mapState.currentTimeLineLayer && this.mapState.currentTimeLineLayer.mapResource.mapsResourceApi != null;
      },
      hasVectors() {
        return this.mapState.currentTimeLineLayer && this.mapState.currentTimeLineLayer.mapResource.vectors;
      }
  },
  mounted() {},
  methods: {
     openPredictionWidget: function() {
      var map = MapState.getMap();
      var currentPredLayer = this.mapState.currentTimeLineLayer; 
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
    },

    openStaticMapsWidget: function() {
      var map = MapState.getMap();
      var currentPredLayer = this.mapState.currentTimeLineLayer;
      if (currentPredLayer) {
        MapState.setStaticMapResourceSelected(currentPredLayer.mapResource);
      }
    },

    toggleVectors: function() {
      var currentPredLayer = this.mapState.currentTimeLineLayer
      MapState.removeMapResource(currentPredLayer.mapResource.id);
      MapState.addTimeLineLayer(currentPredLayer.mapResource, !this.mapState.showingVectors);
    },

    changeDateFromValue: function(ev) {
      this.mapState.setPlayerDateRangeValue(ev.value, null);
    },

    changeDateToValue: function(ev) {
      this.mapState.setPlayerDateRangeValue(null, ev.value);
    }
  }
};
</script>

<style>

.predictionScale {
    position: absolute;
    z-index: 2;
    /* left: 55%; */
    /* right: 10px; */
    /* bottom: -3px; */
    padding: 10px;
    border-radius: 6px;
    width: 25%;
    height: 50px;
    left: 105px;
    bottom: 95px;
}

.datePicker {
    position: absolute;
    z-index: 2;
    left: 125px;
    bottom: 15px;
    width: 85px;
    font-size: 10px;
    border: none !important;
    border-radius: 0px !important;
}

.datePicker-left {
  left: 115px;
}

.datePicker-right {
  left: 360px;
}

.dx-texteditor-input {
  padding-right: 0px !important;
  /* background-color: rgba(0, 0, 0, 0.7); */
  border-radius: 0px !important;
}

.predictionWidgetIcon {
  position: absolute;
    z-index: 2;
    left: 530px;
    bottom: 98px;
    width: 35px;
    height: 35px;
    border-radius: 6px;
    color: white;
    cursor: pointer;
}

.vectorsIcon {
    position: absolute;
    z-index: 2;
    left: 50px;
    bottom: 100px;
    width: 35px;
    height: 35px;
    border-radius: 6px;
    cursor: pointer;
}

.staticMapsWidgetIcon {
    position: absolute;
    z-index: 2;
    left: 490px;
    bottom: 100px;
    width: 35px;
    height: 35px;
    border-radius: 6px;
    cursor: pointer;
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