<template>
  <div>

    <ShareInfoPanel
      @shareinfo-mouseover="openShareInfo"
      @shareinfo-mouseout="closeShareInfo"
      :routeData="routeData"
      v-show="displayShareInfo"
    />

    <div v-show="!displayShareInfo" style="width: 569px;">
      <b-card >
         <div slot="header">
          <img
            :src='require("@/assets/icons/shareIcon.png")'
            class="shareIcon"
            @click="toggleShareInfo"
            @mouseover="openShareInfo"
            @mouseout="closeShareInfo"
          >
          {{$t('{headerGraficos}')}}
        </div>
        <div v-for="graphUrl in graphUrlList" :key="graphUrl">
          <iframe width="567" frameborder="0" :src="graphUrl"/>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import MapUtils from "@/services/map.utils";
import { BASE_URL_PORTUS_DATA } from "@/common/config";
import ApiService from "@/services/api.service";
import ShareInfoPanel from "@/components/shareInfoPanel.vue";

export default {
  name: "LocationsGraphsWidget",
  components: {
    ShareInfoPanel
  },
  data() {
    return {
      mapUtils: MapUtils,
      displayShareInfo: false,
      loading: true,
      graphUrlList: [],
      routeData: null
    };
  },
  props: {
    locationType: { type: String, default: "", required: true },
    code: { type: Number, default: "", required: true }
  },
  watch: {
    code: function() {
      this.init();
    }
  },
  computed: {},
  created() {
    this.init();
  },
  // beforeDestroy() {
  //   clearInterval(this.interval);
  // },
  methods: {
      init() {
        this.createUrlGraphs();
        this.routeData = this.$router.resolve({ path: '/locationsGraphsWidget', 
            query: 
            { 
              locationType: this.locationType,
              code: this.code
            }
        });
      },
      async createUrlGraphs() {
        var requestModelPoint = await ApiService.get('puntosMalla/nearest/' + this.code);
        var modelPointId = requestModelPoint.data;
        var urlOleaje = BASE_URL_PORTUS_DATA 
                  + "predChart?code=" + modelPointId
                  + "&var=Tp,Hm0"
                  + "&dirVar=MeanDir180"
                  + "&int=min" 
                  + "&locale=" + this.$getLocale();
      var urlViento = BASE_URL_PORTUS_DATA 
                  + "predChart?code=" + modelPointId
                  + "&var=WindSpeed"
                  + "&dirVar=WindDir180"
                  + "&int=min" 
                  + "&locale=" + this.$getLocale();
      var requestStation = await ApiService.get('estaciones/nearest/' + this.code);
      var stationId = requestStation.data;
      var urlNivmar = BASE_URL_PORTUS_DATA 
                  + "nivmarChart?code=" + this.code
                  + "&var=SeaLevel,SeaSea,Residual"
                  + (stationId ? "&station=" + stationId : "") 
                  + "&verVar=sl"
                  + "&int=min" 
                  + "&locale=" + this.$getLocale();
    
      this.graphUrlList = [urlOleaje, urlViento, urlNivmar];
      this.loading = false;
    },
    toggleShareInfo() {
      this.displayShareInfo = !this.displayShareInfo;
    },

    openShareInfo() {
      if (this.timeOutShareInfoClose) clearInterval(this.timeOutShareInfoClose);
      this.timeOutShareInfoOpen = setTimeout(() => {
        this.displayShareInfo = true;
      }, 500);
    },

    closeShareInfo() {
      if (this.timeOutShareInfoOpen) clearInterval(this.timeOutShareInfoOpen);
      this.timeOutShareInfoClose = setTimeout(() => {
        this.displayShareInfo = false;
      }, 500);
    }
  }
};
</script>

<style scoped>

.shareIcon {
  margin-top: 2px;
  float: left;
  cursor: pointer;
  width: 19px;
  margin-right: 6px;
}

.variableTitle {
  position: absolute;
  color: white;
  font-size: 12px;
  margin-left: 5px;
}

.variableTitleSm {
  font-size: 12px;
  color: #111;
  position: absolute;
  font-weight: bold;
  margin-top: -3px;
}

.variableValue {
  position: absolute;
  color: white;
  font-weight: 600;
  font-size: 15px;
  margin-left: 50px;
  margin-top: 35px;
  /* letter-spacing: 0.1px; */
}

.variableValueSm {
  color: white;
  font-weight: 600;
  border-radius: 5px;
  font-size: 15px;
  background: #6683b3;
  padding: 4px 6px;
  margin-left: 118px;
}

.variableUnit {
  /* position: absolute;  */
  color: #ffc100;
  font-weight: normal;
  font-size: 14px;
  font-style: italic;
}

.variableDate {
  color: #767676;
  font-weight: normal;
  font-size: 9px;
  font-family: Arial;
  position: absolute;
  margin-top: 72px;
  margin-left: 2px;
}

.variableDateSm {
  color: #767676;
  font-weight: normal;
  font-size: 9px;
  font-family: Arial;
  position: absolute;
  margin-top: 14px;
}

.winDirRotation {
  /* margin-top: -80px; 
    margin-left: -2px;  */
  position: absolute;
  margin-left: -109px;
  margin-top: 17px;
}

.winDirName {
  /* margin-top: -80px; 
    margin-left: -2px;  */
  position: absolute;
  margin-left: -106px;
  margin-top: 20px;
}

.card-body {
  padding: 0px 0px 0px 0px !important;
}


.card-header {
  font-size: 14px;
  padding: 0px 5px 11px 5px;
  text-align: right;
  height: 22px;
}
</style>
