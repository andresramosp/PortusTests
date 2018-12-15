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
          <div class="variableDate">15/12/2018</div>
          <div class="variableSection">
            <span class="variableValue">
              <div v-if="nivMar != null && !isNaN(nivMar)">
                {{nivMar}}
                <span class="variableUnit">m</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="oleajeImg">
          </div>
          <div class="variableSection">
            <span class="variableValue">
              <div v-if="viento != null && !isNaN(viento)">
                {{viento}}
                <span class="variableUnit">m/s</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="vientoImg">
          </div>
        </div>

        <div class="variableBGSection" style="background-color: #dae0ea;">
          <div class="variableDate">15/12/2018</div>
          <div class="variableSection">
            <span class="variableValue">
              <div v-if="nivMar != null && !isNaN(nivMar)">
                {{nivMar}}
                <span class="variableUnit">m</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="oleajeImg">
          </div>
          <div class="variableSection">
            <span class="variableValue">
              <div v-if="viento != null && !isNaN(viento)">
                {{viento}}
                <span class="variableUnit">m/s</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="vientoImg">
          </div>
        </div>
        <div class="variableBGSection" style="background-color: #e8ebf1;">
          <div class="variableDate">15/12/2018</div>
          <div class="variableSection">
            <span class="variableValue">
              <div v-if="nivMar != null && !isNaN(nivMar)">
                {{nivMar}}
                <span class="variableUnit">m</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="oleajeImg">
          </div>
          <div class="variableSection">
            <span class="variableValue">
              <div v-if="viento != null && !isNaN(viento)">
                {{viento}}
                <span class="variableUnit">m/s</span>
              </div>
              <span v-else class>N/D</span>
            </span>
            <img :src="vientoImg">
          </div>
        </div>
      </div>
    </b-card>

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
              <span>07:29 (0.57m)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span>20:15 (0.40m)</span>
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
              <span>07:29 (0.57m)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span>20:15 (0.40m)</span>
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
              <span>07:29 (0.57m)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span>20:15 (0.40m)</span>
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
              <span>07:29 (0.57m)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span>20:15 (0.40m)</span>
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
              <span>07:29 (0.57m)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span>20:15 (0.40m)</span>
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
              <span>07:29 (0.57m)</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span>20:15 (0.40m)</span>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
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
      nivMar: null,
      viento: null,
      oleajeImg: null,
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
          "https://movil.puertos.es/simo/seastate/" +
            tipo +
            "/" +
            this.code +
            "/daily_extended"
        )
        .catch(error => {
          throw new Error(`[RWV] ApiService ${error}`);
        });
      var data = result.data;
      this.nivMar = 1.2;
      this.viento = 6.1;
      this.oleajeImg = require("@/assets/locationsWidget/prueba.png"); //require("@/assets/locationsWidget/surfP_" + 1 + ".png");
      this.vientoImg = require("@/assets/locationsWidget/prueba2.png");
      this.loading = false;
    },

    printDate(dateInSecs) {
      var date = new Date(dateInSecs * 1000);
      return (
        date.toLocaleDateString() +
        " - " +
        date
          .toISOString()
          .split("T")[1]
          .substr(0, 5) +
        "h"
      );
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
  font-size: 11.5px;
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