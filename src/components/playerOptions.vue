<template>
  <div v-show="playingTimeLineLayer">
    <img v-show="!isWidget" 
         @click="toggleMinimized()" 
         width="20" class="minimizerButton" 
         :src="!mapState.playerMinimized ? require('@/assets/icons/replegar.png') : require('@/assets/icons/desplegar.png')" />
    <div v-show="!mapState.playerMinimized">
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
       <img v-show='hasRadars' class="playerIcon radarsIcon fadeIn" @click="toggleRadars()" :src="require('@/assets/icons/vectors.png')" />   
       <img v-show='hasVectors' class="playerIcon vectorsIcon fadeIn" @click="toggleVectors()" :src="require('@/assets/icons/vectors.png')" />
       <img v-show='!isWidget' class="playerIcon predictionWidgetIcon fadeIn" @click="openPredictionWidget()" :src="require('@/assets/icons/predictionWidget.png')" />
       <img v-show='!isWidget && hasStaticMaps' class="playerIcon staticMapsWidgetIcon fadeIn" @click="openStaticMapsWidget()" :src="require('@/assets/icons/staticMapsWidget.png')" />
    </div>
  </div>
</template>

<script>

import MapState from "@/state/map.state";
import { DxDateBox } from 'devextreme-vue';

export default {
  name: "PlayerOptions",
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
    isWidget: { default: false, required: false }
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
      },
      hasRadars() {
        return this.mapState.currentRadar;
      }
  },
  mounted() {
  
  },
  // mounted() {},
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
      // MapState.removeMapResource(currentPredLayer.mapResource.id);
      // MapState.addTimeLineLayer(currentPredLayer.mapResource, !this.mapState.showingVectors);
      MapState.setVectorial(currentPredLayer.mapResource, !this.mapState.showingVectors);
    },

    toggleRadars: function() {
      this.mapState.setRadarPointsLayerVisibility(!this.mapState.showingRadars);
    },

    changeDateFromValue: function(ev) {
      // Nos aseguramos de que el evento procede del control, pues
      // podría haber sido disparado por el initialize del Player
      if (ev.event)
        this.mapState.setPlayerDateRangeValue(ev.value, null);
    },

    changeDateToValue: function(ev) {
      if (ev.event)
        this.mapState.setPlayerDateRangeValue(null, ev.value);
    },

    toggleMinimized() {
      var currentValue = this.mapState.getMap().timeDimensionControl.options.minimized;
      this.mapState.setPlayerMinimized(!currentValue);
    }
  }
};
</script>

<style>

.minimizerButton {
  position: absolute;
    z-index: 5;
    left: 3px;
    bottom: 75px;
    cursor: pointer;
}

.predictionScale {
    position: absolute;
    z-index: 2;
    /* left: 55%; */
    /* right: 10px; */
    /* bottom: -3px; */
    padding: 10px;
    border-radius: 6px;
    width: 380px;
    height: 50px;
    left: 100px;
    bottom: 95px;
}

.datePicker {
    position: absolute;
    z-index: 2;
    left: 125px;
    bottom: 22px;
    width: 70px;
    font-size: 10px;
    border: none !important;
    border-radius: 0px !important;
}

.datePicker-left {
  /* left: 128px; */
  left: 150px;
}

.datePicker-right {
  /* left: 380px; */
  left: 355px;
}

.dx-texteditor-input {
  padding-right: 0px !important;
  /* background-color: rgba(0, 0, 0, 0.7); */
  border-radius: 0px !important;
}

.playerIcon {
  position: absolute;
  z-index: 2;
  bottom: 107px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.predictionWidgetIcon {
    left: 530px;
}

.vectorsIcon {
    left: 65px;
}

.radarsIcon {
    left: 25px;
}

.staticMapsWidgetIcon {
    left: 490px;
  
}





</style>