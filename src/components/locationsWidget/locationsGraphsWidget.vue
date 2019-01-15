<template>
  <div style="width: 569px;">
    <b-card :header="$t('{headerGraficos}')">
      <!-- <img v-if="!loading" :src="require('@/assets/locationsWidget/graficasFake.png')" style="width: 550px; margin-top: -15px" class="fadeIn" /> -->
      <div v-for="graphUrl in graphUrlList" :key="graphUrl">
        <iframe
          :width="iFrameWidth"
          :height="iFrameHeight"
          :src="graphUrl"
        />
      </div>
    </b-card>
  </div>
</template>

<script>
import Vue from "vue";
import MapUtils from "@/services/map.utils";
import { BASE_URL_PORTUS_DATA } from '@/common/config';

export default {
  name: "LocationsGraphsWidget",
  data() {
    return {
      mapUtils: MapUtils,
      interval: null,
      loading: true,
      graphUrlList: []
    };
  },
  props: {
    locationType: { type: String, default: "", required: true },
    code: { type: Number, default: "", required: true }
  },
  computed: {},
  created() {
    var urlOleaje = BASE_URL_PORTUS_DATA 
                + "predChart?code=" + this.code
                + "&var=Tp,Hm0"
                + "&dirVar=MeanDir180"
                + "&int=min" 
                + "&locale=" + this.$getLocale();
    var urlViento = BASE_URL_PORTUS_DATA 
                + "predChart?code=" + this.code
                + "&var=WindSpeed"
                + "&dirVar=WindDir180"
                + "&int=min" 
                + "&locale=" + this.$getLocale();
    var urlNivmar = BASE_URL_PORTUS_DATA 
                + "nivmarChart?code=" + this.code
                + "&var=SeaLevel,SeaSea,Residual"
               // + "&station=" + mareografo
                + "&verVar=sl"
                + "&int=min" 
                + "&locale=" + this.$getLocale();
   
    this.graphUrlList = [urlOleaje, urlViento, urlNivmar];

    this.loading = false;
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {}
};
</script>

<style scoped>
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

.card-header {
  background-color: #606060;
  font-size: 15px;
  padding: 4px 5px 11px 5px;
  color: white;
  text-align: right;
  height: 30px;
}
</style>