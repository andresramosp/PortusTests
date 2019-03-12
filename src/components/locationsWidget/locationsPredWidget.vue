<template>
  <div style="width: 420px;" class="simoPanel">
    <b-card>

    <div slot="header">

       <ShareInfoPanel
          v-if="routeData"
          :routeData="routeData"
          style="float: left"
          position="bottomRight"
          :imgWidth="16"
          panelWidth="390px"
          iconColor="white"
          @opening="showingShareInfo = true"
          @closing="showingShareInfo = false"
        />

        {{$t('{headerPredicciones}')}}        

    </div>

      <img
        style="margin-left: 130px"
        :src="require('@/assets/gifs/loadingBars.gif')"
        v-show="loading"
        width="100"
      >

      <div v-if="!displayShareInfo && !loading" class="fadeIn" :class="[showingShareInfo ? 'blur' : '']">
        <img :src="require('@/assets/locationsWidget/header_pred.png')" width="360">

        <div class="variableBGSection" style="background-color: #bdc9dc;">
          <div class="variableDate">{{fechaD1}}</div>
          <div class="variableSection">
            <span class="variableValue">
              <div v-if="oleajeD1 != null && !isNaN(oleajeD1)">
                {{oleajeD1}}<span class="variableUnit">m*</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="oleajeImgD1">
          </div>
          <div class="variableSection">
            <span class="variableValueSm">
              <div v-if="vientoD1 != null && !isNaN(vientoD1)">
                {{vientoD1}}<span class="variableUnit">m/s</span>
              </div>
              <span v-else class>N/D</span>
            </span>
             <img  v-if="vientoRotationD1 != null && !isNaN(vientoRotationD1)" class="winDirName" :src='vientoDirImgD1' />
             <img class="winDirRotation" :style="'transform: rotate(' + vientoRotationD1 + 'deg)'" :src='require("@/assets/locationsWidget/windDir.png")' />
             <img :src="vientoImgD1">
          
          </div>
          <div class="pleaBajaSection">
            <b-row>
               <span style="float: left; margin-right: 17px; margin-top: 5px; font-weight: bold">plea
                   <img
                    style="width: 9px; margin-left: -2px; margin-top: -1px"
                    :src="require('@/assets/locationsWidget/plea.png')"
                  >
               </span>
             
               <div style="float: left">
                <b-row> 
                  <span v-if="plea1LevelD1 != null && !isNaN(plea1LevelD1)">{{plea1DateD1}} ({{plea1LevelD1}}m)</span>
                  <span v-else>{{plea1DateD1}} (nd)</span>
                </b-row>
                <b-row>
                  <span v-if="plea2LevelD1 != null && !isNaN(plea2LevelD1)">{{plea2DateD1}} ({{plea2LevelD1}}m)</span>
                  <span v-else>{{plea2DateD1}} (nd)</span>
                </b-row>
               </div>
            </b-row>
            <b-row>
                 <span style="float: left; margin-right: 17px; margin-top: 5px; font-weight: bold">baja
                   <img
                    style="width: 9px; margin-left: -2px; margin-top: -1px"
                    :src="require('@/assets/locationsWidget/baja.png')"
                  >
               </span>
               <div style="float: left">
                <b-row>
                   <span v-if="baja1LevelD1 != null && !isNaN(baja1LevelD1)">{{baja1DateD1}} ({{baja1LevelD1}}m)</span>
                   <span v-else>{{baja1DateD1}} (nd)</span>
                </b-row>
                <b-row>
                   <span v-if="baja2LevelD1 != null && !isNaN(baja2LevelD1)">{{baja2DateD1}} ({{baja2LevelD1}}m)</span>
                   <span v-else>{{baja2DateD1}} (nd)</span>
                </b-row>
               </div>
            </b-row>
          </div>
        </div>

        <div class="variableBGSection" style="background-color: #dae0ea;">
          <div class="variableDate">{{fechaD2}}</div>
          <div class="variableSection">
            <span class="variableValue">
              <div v-if="oleajeD2 != null && !isNaN(oleajeD2)">
                {{oleajeD2}}<span class="variableUnit">m*</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="oleajeImgD2">
          </div>
          <div class="variableSection">
            <span class="variableValueSm">
              <div v-if="vientoD2 != null && !isNaN(vientoD2)">
                {{vientoD2}}<span class="variableUnit">m/s</span>
              </div>
              <span v-else class>N/D</span>
            </span>
             <img  v-if="vientoRotationD2 != null && !isNaN(vientoRotationD2)" class="winDirName" :src='vientoDirImgD2' />
             <img class="winDirRotation" :style="'transform: rotate(' + vientoRotationD2 + 'deg)'" :src='require("@/assets/locationsWidget/windDir.png")' />
            <img :src="vientoImgD2">
          </div>
           <div class="pleaBajaSection">
            <b-row>
                <span style="float: left; margin-right: 17px; margin-top: 5px; font-weight: bold">plea
                   <img
                    style="width: 9px; margin-left: -2px; margin-top: -1px"
                    :src="require('@/assets/locationsWidget/plea.png')"
                  >
               </span>
               <div style="float: left">
                <b-row> 
                  <span v-if="plea1LevelD2 != null && !isNaN(plea1LevelD2)">{{plea1DateD2}} ({{plea1LevelD2}}m)</span>
                  <span v-else>{{plea1DateD2}} (nd)</span>
                </b-row>
                <b-row>
                  <span v-if="plea2LevelD2 != null && !isNaN(plea2LevelD2)">{{plea2DateD2}} ({{plea2LevelD2}}m)</span>
                  <span v-else>{{plea2DateD2}} (nd)</span>
                </b-row>
               </div>
            </b-row>
            <b-row>
                <span style="float: left; margin-right: 17px; margin-top: 5px; font-weight: bold">baja
                   <img
                    style="width: 9px; margin-left: -2px; margin-top: -1px"
                    :src="require('@/assets/locationsWidget/baja.png')"
                  >
               </span>
               <div style="float: left">
                <b-row>
                   <span v-if="baja1LevelD2 != null && !isNaN(baja1LevelD2)">{{baja1DateD2}} ({{baja1LevelD2}}m)</span>
                   <span v-else>{{baja1DateD2}} (nd)</span>
                </b-row>
                <b-row>
                   <span v-if="baja2LevelD2 != null && !isNaN(baja2LevelD2)">{{baja2DateD2}} ({{baja2LevelD2}}m)</span>
                   <span v-else>{{baja2DateD2}} (nd)</span>
                </b-row>
               </div>
            </b-row>
          </div>
        </div>
        <div class="variableBGSection" style="background-color: #e8ebf1;">
          <div class="variableDate">{{fechaD3}}</div>
          <div class="variableSection">
            <span class="variableValue">
              <div v-if="oleajeD3 != null && !isNaN(oleajeD3)">
                {{oleajeD3}}<span class="variableUnit">m*</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="oleajeImgD3">
          </div>
          <div class="variableSection">
            <span class="variableValueSm">
              <div v-if="vientoD3 != null && !isNaN(vientoD3)">
                {{vientoD3}}<span class="variableUnit">m/s</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img  v-if="vientoRotationD3 != null && !isNaN(vientoRotationD3)" class="winDirName" :src='vientoDirImgD3' />
            <img class="winDirRotation" :style="'transform: rotate(' + vientoRotationD3 + 'deg)'" :src='require("@/assets/locationsWidget/windDir.png")' />
            <img :src="vientoImgD3">
          </div>
           <div class="pleaBajaSection">
            <b-row>
                 <span style="float: left; margin-right: 17px; margin-top: 5px; font-weight: bold">plea
                   <img
                    style="width: 9px; margin-left: -2px; margin-top: -1px"
                    :src="require('@/assets/locationsWidget/plea.png')"
                  >
               </span>
               <div style="float: left">
                <b-row> 
                  <span v-if="plea1LevelD3 != null && !isNaN(plea1LevelD3)">{{plea1DateD3}} ({{plea1LevelD3}}m)</span>
                  <span v-else>{{plea1DateD3}} (nd)</span>
                </b-row>
                <b-row>
                  <span v-if="plea2LevelD3 != null && !isNaN(plea2LevelD3)">{{plea2DateD3}} ({{plea2LevelD3}}m)</span>
                  <span v-else>{{plea2DateD3}} (nd)</span>
                </b-row>
               </div>
            </b-row>
            <b-row>
                 <span style="float: left; margin-right: 17px; margin-top: 5px; font-weight: bold">baja
                   <img
                    style="width: 9px; margin-left: -2px; margin-top: -1px"
                    :src="require('@/assets/locationsWidget/baja.png')"
                  >
               </span>
               <div style="float: left">
                <b-row>
                   <span v-if="baja1LevelD3 != null && !isNaN(baja1LevelD3)">{{baja1DateD3}} ({{baja1LevelD3}}m)</span>
                   <span v-else>{{baja1DateD3}} (nd)</span>
                </b-row>
                <b-row>
                   <span v-if="baja2LevelD3 != null && !isNaN(baja2LevelD3)">{{baja2DateD3}} ({{baja2LevelD3}}m)</span>
                   <span v-else>{{baja2DateD3}} (nd)</span>
                </b-row>
               </div>
            </b-row>
          </div>
        </div>
      </div>
      <span style="float: left; font-size: 9.5px">* En aguas abiertas</span>
    </b-card>
 

  

  </div>
</template>

<script>
import Vue from "vue";
import MapService from "@/services/map.service";
import ShareInfoPanel from "@/components/shareInfoPanel.vue";
import { SIMO_URL } from '@/common/config';

export default {
  name: "LocationsPredWidget",
  components: {
    ShareInfoPanel
  },
  data() {
    return {
      mapUtils: MapService,
      fechaD1: null,
      fechaD2: null,
      fechaD3: null,
      oleajeD1: null,
      oleajeD2: null,
      oleajeD3: null,
      vientoD1: null,
      vientoD2: null,
      vientoD3: null,
      plea1DateD1: null,
      plea1LevelD1: null,
      plea2DateD1: null,
      plea2LevelD1: null,
      baja1DateD1: null,
      baja1LevelD1: null,
      baja2DateD1: null,
      baja2LevelD1: null,
      plea1DateD2: null,
      plea1LevelD2: null,
      plea2DateD2: null,
      plea2LevelD2: null,
      baja1DateD2: null,
      baja1LevelD2: null,
      baja2DateD2: null,
      baja2LevelD2: null,
      plea1DateD3: null,
      plea1LevelD3: null,
      plea2DateD3: null,
      plea2LevelD3: null,
      baja1DateD3: null,
      baja1LevelD3: null,
      baja2DateD3: null,
      baja2LevelD3: null,
      oleajeImgD1: null,
      vientoImgD1: null,
      oleajeImgD2: null,
      vientoImgD2: null,
      oleajeImgD3: null,
      vientoImgD3: null,
      vientoRotationD1: null,
      vientoRotationD2: null,
      vientoRotationD3: null,
      vientoDirImgD1: null,
      vientoDirImgD1: null,
      vientoDirImgD1: null,
      loading: true,
      interval: null,
      displayShareInfo: false,
      showingShareInfo: false
    };
  },
  props: {
    locationType: { type: String, default: "", required: true },
    code: { type: Number, default: "", required: true }
  },
  computed: {},
  watch: {
    code() {
      this.init();
    }
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    init() {
      this.routeData = this.$router.resolve({ path: '/locationsPredWidget', 
        query: 
        { 
          locationType: this.locationType,
          code: this.code
        }
      });

      this.getData();

      if (this.interval)
        clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.getData();
      }, 5000);
    },
    async getData() {
      var tipo = this.locationType == "Puerto" ? "harbor" : "city";
      var result = await Vue.axios
        .get(
          SIMO_URL + "seastate/" + tipo + "/" + this.code + "/daily_extended"
        )
        .catch(error => {
          throw new Error(`[RWV] ApiService ${error}`);
        });
      var data = result.data;
      var count = 1;
      for (var fecha in data) {
        this['fechaD' + count] = this.printDate(fecha);
        this['oleajeD' + count] = parseFloat(data[fecha][0].mt_hm0).toFixed(1);
        this['vientoD' + count] = parseFloat(data[fecha][0].vv_imd *  0.27777).toFixed(1);
        this['vientoRotationD' + count] = parseFloat(data[fecha][0].vv_dmd);
        this['plea1DateD' + count] = this.printHour(data[fecha][0].high_tide1_date)
        this['plea1LevelD' + count] = parseFloat(data[fecha][0].high_tide1_level).toFixed(2);
        this['plea2DateD' + count] = this.printHour(data[fecha][0].high_tide2_date)
        this['plea2LevelD' + count] = parseFloat(data[fecha][0].high_tide2_level).toFixed(2);
        this['baja1DateD' + count] = this.printHour(data[fecha][0].low_tide1_date)
        this['baja1LevelD' + count] = parseFloat(data[fecha][0].low_tide1_level).toFixed(2);
        this['baja2DateD' + count] = this.printHour(data[fecha][0].low_tide2_date)
        this['baja2LevelD' + count] = parseFloat(data[fecha][0].low_tide2_level).toFixed(2);
        this['oleajeImgD' + count] = require("@/assets/locationsWidget/surfP_" + (data[fecha][0].alert_surf  >= 0 ? data[fecha][0].alert_surf : 0) + ".png");
        this['vientoImgD' + count] = require("@/assets/locationsWidget/windP_" +  (data[fecha][0].alert_wind  >= 0 ? data[fecha][0].alert_wind : 0) + ".png");
        this['vientoDirImgD' + count] = require("@/assets/locationsWidget/" + this.mapUtils.getDirNameFromDeg(this['vientoRotationD' + count]).toLowerCase() + "_w.png");
        count++;
      }
      
      this.loading = false;
    },

    printDate(dateInSecs) {
      var date = new Date(dateInSecs * 1000);
      return (
        date.toLocaleDateString() 
      );
    },

    printHour(dateInSecs) {
        var date = new Date(dateInSecs * 1000);
        return date.toISOString().split('T')[1].substr(0, 5) + 'h';
      }

  }
};
</script>

<style scoped>

.shareIcon {
    margin-top: 1.5px;
    float: left;
    cursor: pointer;
    width: 16px;
    margin-right: 6px;
}

.noPaddingCol {
  padding-right: 0px;
  padding-left: 0px;
}

.pleaBajaSection {
  position: absolute;
  margin-top: 72px;
  font-size: 10.5px;
  color: black;
  padding-left: 23px;
}

.variableSection {
  background-color: white;
  width: 45px;
  border-radius: 21px;
  float: left;
  /* margin-right: 7px; */
  margin-left: 9.5px;
}

.variableBGSection {
  padding: 8px 0px;
  height: 150px;
  float: left;
  width: 120px;
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
  font-size: 11.0px;
  margin-left: 7.5px;
  margin-top: 45.5px;
}

.variableValueSm {
  position: absolute;
  color: white;
  font-weight: 600;
  font-size: 11.0px;
  margin-left: 5px;
  margin-top: 45.5px;
}

.variableUnit {
  /* position: absolute; */
  color: #ffc100;
  font-weight: normal;
  font-size: 11.0px;
  font-style: italic;
  margin-left: 0.5px;
  font-family: Arial, Helvetica, sans-serif;
}

.variableDate {
  color: #f8f9fa;
  font-weight: normal;
  font-size: 13px;
  font-family: Arial;
  position: absolute;
  margin-top: -26px;
  margin-left: 6px;
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
  margin-left: -4px;
  margin-top: -7px;
}

.winDirName {
  /* margin-top: -80px; 
    margin-left: -2px;  */
  position: absolute;
  margin-left: -3px;
  margin-top: -2px;
}

.card-body {
  padding: 9px;
  margin-left: 16px;
}


.card-header {
  /* background-color: #606060; */
  font-size: 14px;
  padding-top: 3px;
  padding-right: 5px;
  padding-left: 5px;
  height: 25px;
  text-align: right;
}

</style>