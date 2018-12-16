<template>
  <div style="width: 420px;">
    <b-card>

    <div slot="header">
        <img :src='require("@/assets/icons/shareIcon.png")' class="shareIcon" @click="openShareInfo" />
        {{$t('{headerPredicciones}')}}        
    </div>

      <img
        style="margin-left: 130px"
        :src="require('@/assets/gifs/loadingBars.gif')"
        v-show="loading"
        width="100"
      >
      <div v-if="!loading" class="fadeIn">
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
        </div>
      </div>
      <span style="float: left; font-size: 9.5px">* En aguas abiertas</span>
    </b-card>
 
   <div v-if="!loading" class="fadeIn">  
      <div class="pleaBajaSection" style="margin-left: 35px;">
      <b-row>
        <b-col cols="2" style="padding-top: 7px">
          <div style="font-weight: bold">plea
            <!-- <img
              style="width: 9px; margin-left: -2px;"
              :src="require('@/assets/locationsWidget/baja.png')"
            >-->
          </div>
        </b-col>
        <b-col>
          <b-row>
            <b-col>
               <span v-if="plea1LevelD1 != null && !isNaN(plea1LevelD1)">{{plea1DateD1}} ({{plea1LevelD1}}m)</span>
               <span v-else>{{plea1DateD1}} (nd)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span v-if="plea2LevelD1 != null && !isNaN(plea2LevelD1)">{{plea2DateD1}} ({{plea2LevelD1}}m)</span>
               <span v-else>{{plea2DateD1}} (nd)</span>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2" style="padding-top: 7px">
          <div style="font-weight: bold">baja
            <!-- <img
              style="width: 9px; margin-left: -2px;"
              :src="require('@/assets/locationsWidget/baja.png')"
            >-->
          </div>
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <span v-if="baja1LevelD1 != null && !isNaN(baja1LevelD1)">{{baja1DateD1}} ({{baja1LevelD1}}m)</span>
               <span v-else>{{baja1DateD1}} (nd)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
               <span v-if="baja2LevelD1 != null && !isNaN(baja2LevelD1)">{{baja2DateD1}} ({{baja2LevelD1}}m)</span>
               <span v-else>{{baja2DateD1}} (nd)</span>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
    

    <div class="pleaBajaSection" style="margin-left: 154px;">
      <b-row>
        <b-col cols="2" style="padding-top: 7px">
          <div style="font-weight: bold">plea
            <!-- <img
              style="width: 9px; margin-left: -2px;"
              :src="require('@/assets/locationsWidget/baja.png')"
            >-->
          </div>
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <span v-if="plea1LevelD2 != null && !isNaN(plea1LevelD2)">{{plea1DateD2}} ({{plea1LevelD2}}m)</span>
               <span v-else>{{plea1DateD2}} (nd)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span v-if="plea2LevelD2 != null && !isNaN(plea2LevelD2)">{{plea2DateD2}} ({{plea2LevelD2}}m)</span>
               <span v-else>{{plea2DateD2}} (nd)</span>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2" style="padding-top: 7px">
          <div style="font-weight: bold">baja
            <!-- <img
              style="width: 9px; margin-left: -2px;"
              :src="require('@/assets/locationsWidget/baja.png')"
            >-->
          </div>
        </b-col>
        <b-col>
          <b-row>
            <b-col>
                <span v-if="baja1LevelD2 != null && !isNaN(baja1LevelD2)">{{baja1DateD2}} ({{baja1LevelD2}}m)</span>
               <span v-else>{{baja1DateD2}} (nd)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
                <span v-if="baja2LevelD2 != null && !isNaN(baja2LevelD2)">{{baja2DateD2}} ({{baja2LevelD2}}m)</span>
               <span v-else>{{baja2DateD2}} (nd)</span>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>

    <div class="pleaBajaSection" style="margin-left: 274px;">
      <b-row>
        <b-col cols="2" style="padding-top: 7px">
          <div style="font-weight: bold">plea
            <!-- <img
              style="width: 9px; margin-left: -2px;"
              :src="require('@/assets/locationsWidget/baja.png')"
            >-->
          </div>
        </b-col>
          <b-col>
          <b-row>
            <b-col>
               <span v-if="plea1LevelD3 != null && !isNaN(plea1LevelD3)">{{plea1DateD3}} ({{plea1LevelD3}}m)</span>
               <span v-else>{{plea1DateD3}} (nd)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span v-if="plea2LevelD3 != null && !isNaN(plea2LevelD3)">{{plea2DateD3}} ({{plea2LevelD3}}m)</span>
              <span v-else>{{plea2DateD3}} (nd)</span>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2" style="padding-top: 7px">
          <div style="font-weight: bold">baja
            <!-- <img
              style="width: 9px; margin-left: -2px;"
              :src="require('@/assets/locationsWidget/baja.png')"
            >-->
          </div>
        </b-col>
          <b-col>
          <b-row>
            <b-col>
               <span v-if="baja1LevelD3 != null && !isNaN(baja1LevelD3)">{{baja1DateD3}} ({{baja1LevelD3}}m)</span>
               <span v-else>{{baja1DateD3}} (nd)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span v-if="baja2LevelD3 != null && !isNaN(baja2LevelD3)">{{baja2DateD3}} ({{baja2LevelD3}}m)</span>
               <span v-else>{{baja2DateD3}} (nd)</span>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
   </div>


  </div>
</template>

<script>
import Vue from "vue";
import MapUtils from "@/services/map.utils";

export default {
  name: "LocationsPredWidget",
  data() {
    return {
      mapUtils: MapUtils,
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
      shareUrl: '{baseUrl}/locationsPredWidget?locationType={locationType}&code={code}',
      iFrameCode: "<iframe width='430' height='239' src='{shareUrl}' frameborder='0' />"
    };
  },
  props: {
    locationType: { type: String, default: "", required: true },
    code: { type: Number, default: "", required: true }
  },
  computed: {},
  created() {
    this.getData();
    this.interval = setInterval(() => {
      this.getData();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    async getData() {
      var tipo = this.locationType == "Puerto" ? "harbor" : "city";
      var result = await Vue.axios
        .get(
          "https://movil.puertos.es/simo/seastate/" + tipo + "/" + this.code + "/daily_extended"
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
        this['oleajeImgD' + count] = require("@/assets/locationsWidget/surfP_" + data[fecha][0].alert_surf + ".png");
        this['vientoImgD' + count] = require("@/assets/locationsWidget/windP_" +  data[fecha][0].alert_wind + ".png");
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
      },

    openShareInfo() {
      var routeData = this.$router.resolve({ path: '/locationsPredWidget', 
        query: 
        { 
          locationType: this.locationType,
          code: this.code
        }
      });
      window.open(routeData.href, '_blank');
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

.noPaddingCol {
  padding-right: 0px;
  padding-left: 0px;
}

.pleaBajaSection {
  position: absolute;
  margin-top: -92px;
  font-size: 11px;
}

.variableSection {
  background-color: white;
  width: 45px;
  border-radius: 21px;
  float: left;
  margin-right: 7px;
}

.variableBGSection {
  padding: 8px;
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
  font-size: 11.5px;
  margin-left: 7.5px;
  margin-top: 45.5px;
}

.variableValueSm {
  position: absolute;
  color: white;
  font-weight: 600;
  font-size: 11.5px;
  margin-left: 5px;
  margin-top: 45.5px;
}

.variableUnit {
  /* position: absolute; */
  color: #ffc100;
  font-weight: normal;
  font-size: 11.5px;
  font-style: italic;
  margin-left: 1.5px;
}

.variableDate {
  color: #f8f9fa;
  font-weight: normal;
  font-size: 13px;
  font-family: Arial;
  position: absolute;
  margin-top: -26px;
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
  background-color: #606060;
  font-size: 15px;
  padding: 4px 5px 11px 5px;
  color: white;
  text-align: right;
  height: 30px;
}
</style>