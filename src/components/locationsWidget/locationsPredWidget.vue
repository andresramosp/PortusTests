<template>
  <div style="width: 420px;">
    <b-card :header="$t('{headerPredicciones}')">
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
                {{oleajeD1}}
                <span class="variableUnit">m</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="oleajeImg">
          </div>
          <div class="variableSection">
            <span class="variableValue">
              <div v-if="vientoD1 != null && !isNaN(vientoD1)">
                {{vientoD1}}
                <span class="variableUnit">m/s</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="vientoImg">
          </div>
        </div>

        <div class="variableBGSection" style="background-color: #dae0ea;">
          <div class="variableDate">{{fechaD2}}</div>
          <div class="variableSection">
            <span class="variableValue">
              <div v-if="oleajeD2 != null && !isNaN(oleajeD2)">
                {{oleajeD2}}
                <span class="variableUnit">m</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="oleajeImg">
          </div>
          <div class="variableSection">
            <span class="variableValue">
              <div v-if="vientoD2 != null && !isNaN(vientoD2)">
                {{vientoD2}}
                <span class="variableUnit">m/s</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="vientoImg">
          </div>
        </div>
        <div class="variableBGSection" style="background-color: #e8ebf1;">
          <div class="variableDate">{{fechaD3}}</div>
          <div class="variableSection">
            <span class="variableValue">
              <div v-if="oleajeD3 != null && !isNaN(oleajeD3)">
                {{oleajeD3}}
                <span class="variableUnit">m</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="oleajeImg">
          </div>
          <div class="variableSection">
            <span class="variableValue">
              <div v-if="vientoD3 != null && !isNaN(vientoD3)">
                {{vientoD3}}
                <span class="variableUnit">m/s</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="vientoImg">
          </div>
        </div>
      </div>
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
              <span>{{plea1DateD1}} ({{plea1LevelD1}}m)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span>{{plea2DateD1}} ({{plea2LevelD1}}m)</span>
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
              <span>{{baja1DateD1}} ({{baja1LevelD1}}m)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
               <span>{{baja2DateD1}} ({{baja2LevelD1}}m)</span>
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
              <span>{{plea1DateD2}} ({{plea1LevelD2}}m)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span>{{plea2DateD2}} ({{plea2LevelD2}}m)</span>
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
               <span>{{baja1DateD2}} ({{baja1LevelD2}}m)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span>{{baja2DateD2}} ({{baja2LevelD2}}m)</span>
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
              <span>{{plea1DateD3}} ({{plea1LevelD3}}m)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span>{{plea2DateD3}} ({{plea2LevelD3}}m)</span>
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
              <span>{{baja1DateD3}} ({{baja1LevelD3}}m)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span>{{baja2DateD3}} ({{baja2LevelD3}}m)</span>
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
      oleajeImg: null,
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
      vientoImg: null,
      loading: true,
      interval: null
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
        this['vientoD' + count] = parseFloat(data[fecha][0].vv_imd *  0.27777).toFixed(2);
        this['plea1DateD' + count] = this.printHour(data[fecha][0].high_tide1_date)
        this['plea1LevelD' + count] = parseFloat(data[fecha][0].high_tide1_level).toFixed(2);
        this['plea2DateD' + count] = this.printHour(data[fecha][0].high_tide2_date)
        this['plea2LevelD' + count] = parseFloat(data[fecha][0].high_tide2_level).toFixed(2);
        this['baja1DateD' + count] = this.printHour(data[fecha][0].low_tide1_date)
        this['baja1LevelD' + count] = parseFloat(data[fecha][0].low_tide1_level).toFixed(2);
        this['baja2DateD' + count] = this.printHour(data[fecha][0].low_tide2_date)
        this['baja2LevelD' + count] = parseFloat(data[fecha][0].low_tide2_level).toFixed(2);
        count++;
      }
      this.oleajeImg = require("@/assets/locationsWidget/prueba.png"); //require("@/assets/locationsWidget/surfP_" + 1 + ".png");
      this.vientoImg = require("@/assets/locationsWidget/prueba2.png");
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
.noPaddingCol {
  padding-right: 0px;
  padding-left: 0px;
}

.pleaBajaSection {
  position: absolute;
  margin-top: -83px;
  font-size: 11px;
}

.pleaBajaSection {
  position: absolute;
  margin-top: -83px;
}

.variableSection {
  background-color: white;
  width: 45px;
  border-radius: 15px;
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
  margin-left: 6.5px;
  margin-top: 45px;
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
  /* position: absolute; */
  color: #ffc100;
  font-weight: normal;
  font-size: 12px;
  font-style: italic;
  /* margin-top: -3px;
  margin-left: 4px; */
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