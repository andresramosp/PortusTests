<template>
  <div v-show="playingTimeLineLayer">
    <img v-show="!isWidget" 
         @click="toggleMinimized()" 
         width="20" :class="[!mapState.playerMinimized ? 'minimizerButton' : 'minimizerButtonMin']" 
         :src="!mapState.playerMinimized ? require('@/assets/icons/replegar.png') : require('@/assets/icons/desplegar.png')" />
    <div v-show="!mapState.playerMinimized" >
       <div class="shadedSquare fadeIn">
           <span class="unidadEscala" >{{unidadEscala}}</span>
           <img :src="mapState.predictionScaleImg" class="predictionScale playerOptions" />
       </div>
     
         <dx-date-box
            :ref="'datePickerFrom'"
            class="datePicker datePicker-left fadeIn"
            :value="mapState.playerDateRangeFromValue"
            @valueChanged="changeDateFromValue"
            @mouseover="dateRangeMouseOver"
            @mouseout="dateRangeMouseOut"
            type="date"
            display-format="dd/MMM"
            width="20px"
          />

           <dx-date-box
            class="datePicker datePicker-right fadeIn"
            :value="mapState.playerDateRangeToValue"
            @valueChanged="changeDateToValue"
            @mouseover="dateRangeMouseOver"
            @mouseout="dateRangeMouseOut"
            :max="mapState.maxPredictionDate"
            type="date"
            display-format="dd/MMM"
            :use-mask-behavior="true"
            width="20px"
          />
     
      <div class="fadeIn" style="position: absolute; bottom: 20px; left: 427px; z-index: 5; width: 90px">
        <img v-if='!isWidget' 
                  :title="$t('{shareIconPred}')" 
                  class="playerIcon"  
                  @click="toggleShareInfo"
                  @mouseover="openShareInfo"
                  @mouseout="closeShareInfo"
                  :src="require('@/assets/icons/shareIcon.png')" />
        <img v-if='!isWidget && hasStaticMaps' :title="$t('{staticMapsIconPred}')" class="playerIcon" @click="openStaticMapsWidget()" :src="require('@/assets/icons/staticMapsWidget.png')" />
        <img v-if='hasVectors' class="playerIcon" :title="$t('{vectorsIconPred}')" @click="toggleVectors()" :src="mapState.showingVectors ?  require('@/assets/icons/vectorsActivated.png') : require('@/assets/icons/vectors.png')" />
        <img v-if='hasRadars' class="playerIcon" :title="$t('{radarsIconPred}')" @click="toggleRadars()" :src="mapState.showingRadars ?  require('@/assets/icons/puntosRadarActivated.png') : require('@/assets/icons/puntosRadar.png')" />   
      </div>
       <img class="infoPredIcon fadeIn" @click="openPredictionInfo()" :src="require('@/assets/icons/info.png')" />   
       <img class="fpsIcon fadeIn" :src="require('@/assets/icons/fps.png')" />   

        <ShareInfoPanel 
            v-if="predictionRouteData"
            class="fadeIn"
            style="position: absolute; width: 480px; bottom: 50px; left: 260px"
            @shareinfo-mouseover="openShareInfo" 
            @shareinfo-mouseout="closeShareInfo" 
            :routeData="predictionRouteData" 
            v-show="displayShareInfo"
        />

    </div>

  </div>
</template>

<script>

import MapState from "@/state/map.state";
import { DxDateBox } from 'devextreme-vue';
import ShareInfoPanel from "@/components/shareInfoPanel.vue";

export default {
  name: "PlayerOptions",
   components: {
    DxDateBox,
    ShareInfoPanel
  },
  data() {
    return {
      align: PC.options_panel_align,
      mapState: MapState,
      displayShareInfo: false,
      predictionRouteData: null
    };
  },
  props: {
    isWidget: { default: false, required: false }
  },
  computed: {
      // predictionRouteData() {
     
      // },
      unidadEscala() {
        if (!this.isWidget && this.mapState.currentTimeLineLayer)
          return this.$t('{' + 'unit' + this.mapState.currentTimeLineLayer.mapOption.variableType + '}');
        else 
          return null;
      },
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
        return this.mapState.currentRadar && !this.mapState.isLoading('puntosRadar');
      }
  },
  mounted() {
  
  },
  methods: {
    
    openStaticMapsWidget: function() {
      var map = MapState.getMap();
      var currentPredLayer = this.mapState.currentTimeLineLayer;
      if (currentPredLayer) {
        MapState.setStaticMapResourceSelected(currentPredLayer.mapResource);
      }
    },

    toggleVectors: function() {
      var currentPredLayer = this.mapState.currentTimeLineLayer
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

    openPredictionInfo() {
      var sourceId = this.mapState.currentTimeLineLayer.mapOption.id;
      this.mapState.setPortusInfoPanel(sourceId);
    },

    // openDateFrom() {
    //   this.datePickerFromShow = true;
    //   this.$refs['datePickerFrom'].instance.open();
    // },

    toggleMinimized() {
      var currentValue = this.mapState.getMap().timeDimensionControl.options.minimized;
      this.mapState.setPlayerMinimized(!currentValue);
    },

    dateRangeMouseOver: function(){
        // if (this.mapState.dateRangeTimeOut)
        //     clearTimeout(this.mapState.dateRangeTimeOut);
        //this.mapState.playerDateRangeVisibility = true;
    },

    dateRangeMouseOut: function(){
        // this.mapState.dateRangeTimeOut = setTimeout(() => {
        //     this.mapState.playerDateRangeVisibility = false;    
        // }, 750);
        //this.mapState.playerDateRangeVisibility = false;    
    },

      toggleShareInfo() {
        this.displayShareInfo = !this.displayShareInfo;
      },

      openShareInfo() {   
        if (this.mapState.currentTimeLineLayer) {
            this.predictionRouteData = this.$router.resolve({ path: '/predictionWidget', 
              query: 
              { 
                resourceId : this.mapState.currentTimeLineLayer.mapResource.id.replace('pred-tiles-', ''), 
                zoom: this.mapState.getMap().getZoom(), 
                lat: this.mapState.getMap().getCenter().lat, 
                lon: this.mapState.getMap().getCenter().lng,
                vec: this.mapState.currentTimeLineLayer._baseLayer._url.indexOf('vec') != -1
              }
            });
            if (this.timeOutShareInfoClose)
                clearInterval(this.timeOutShareInfoClose)
            this.timeOutShareInfoOpen = setTimeout(() => {
                this.displayShareInfo = true; 
            }, 500)
        }
      
      },

      closeShareInfo() {
        if (this.timeOutShareInfoOpen)
            clearInterval(this.timeOutShareInfoOpen)
        this.timeOutShareInfoClose = setTimeout(() => {
            this.displayShareInfo = false; 
        }, 500)
      },
  }
};
</script>

<style>

.minimizerButton {
 position: absolute;
    z-index: 5;
    left: 1px;
    bottom: 63px;
    cursor: pointer;
}

.minimizerButtonMin {
  position: absolute;
    z-index: 5;
    left: 1px;
    bottom: 63px;
    cursor: pointer;
}

.shadedSquare {
    position: absolute;
    z-index: 2;
    padding: 7px;
    border-radius: 6px;
    left: 100px;
    bottom: 83px;
    background: rgba(255, 255, 255, 0.35);
    text-align: center;
}

.predictionScale {
    width: 320px;
    height: 25px;
}

.unidadEscala {
    position: relative;
    color: black;
    display: inherit;
    font-size: 11px;
}

.datePicker {
    position: absolute;
    z-index: 2;
    left: 125px;
    bottom: 15px;
    width: 70px;
    font-size: 10px;
    border: none !important;
    border-radius: 0px !important;
}



.datePicker-left {
  /* left: 128px; */
  left: 246px;
}

.datePicker-right {
  /* left: 380px; */
  left: 364px;
}

.dx-texteditor-input {
  padding-right: 0px !important;
  /* background-color: rgba(0, 0, 0, 0.7); */
  border-radius: 0px !important;
}

.playerIcon {
  /* position: absolute; */
  z-index: 2;
  /* bottom: 102px; */
  width: 20px;
  /* height: 30px; */
  cursor: pointer;
  float: right;
  margin-left: 4px;
  margin-right: 4px;
}

.predictionWidgetIcon {
    margin-left: 510px;
}

.vectorsIcon {
    /* left: 95px; */
}

.radarsIcon {
    /* left: 55px; */
}

.staticMapsWidgetIcon {
    /* left: 470px; */
  
}

.infoPredIcon {
    position: absolute;
    z-index: 2;
    /* left: 530px;
    bottom: 15px; */
    width: 17px;
    left: 502px;
    bottom: 77px;
    cursor: pointer;
}

.fpsIcon {
    position: absolute;
    z-index: 2;
    left: 112px;
    bottom: 19px;
    width: 15px;
}




</style>