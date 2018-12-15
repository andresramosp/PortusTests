<template>
    
    <div style="width: 420px;" >
       
        <b-card :header="$t('{headerTiempoReal}')" >
            <img style="margin-left: 130px" :src="require('@/assets/gifs/loadingBars.gif')" v-show="loading" width="100"  />
           <b-row v-if="!loading" class="fadeIn">
               <b-col>
                   <span class="variableTitle">{{ $t('{variableOleaje}') }}</span>
                   <span class="variableValue">
                       <div v-if="oleaje != null && !isNaN(oleaje)">
                            {{oleaje}}<span class="variableUnit">m</span>
                        </div>
                        <span v-else class="">N/D</span>
                    </span>
                   <span class="variableDate">{{oleajeDate}}</span>
                   <img :src='oleajeImg' />
                   
               </b-col>
                <b-col>
                    <span class="variableTitle">{{ $t('{variableNivMar}') }}</span>
                    <span class="variableValue">
                        <div v-if="nivMar != null && !isNaN(nivMar)">
                            {{nivMar}}<span class="variableUnit">m</span>
                        </div>
                        <span v-else class="">N/D</span>
                    </span>
                    <span class="variableDate">{{nivMarDate}}</span>
                    <img :src='nivMarImg' />
               </b-col>
                <b-col>
                    <span class="variableTitle">{{ $t('{variableViento}') }}</span>
                    <span class="variableValue">
                        <div v-if="viento != null && !isNaN(viento)">
                            {{viento}}<span class="variableUnit">m/s</span>
                        </div>
                        <span v-else class="">N/D</span>
                    </span>
                    <span class="variableDate">{{vientoDate}}</span>
                    <img :src='vientoImg' />
                    <img  v-if="vientoRotation != null && !isNaN(vientoRotation)" class="winDirName" :src='vientoDirImg' />
                    <img class="winDirRotation" :style="'transform: rotate(' + vientoRotation + 'deg)'" :src='require("@/assets/locationsWidget/windDir.png")' />
               </b-col>
           </b-row>
           <div v-if="showExtraData && !loading" class="fadeIn">
            <b-row style="margin-top: 25px">
               <b-col cols="6">
                   <span class="variableTitleSm" >{{ $t('{variableTempAgua}') }}:</span>
                   <span class="variableDateSm">{{tempAguaDate}}</span>
                   <span v-if="tempAgua != null && !isNaN(tempAgua)" class="variableValueSm" >
                      {{tempAgua}}<span >ºC</span>
                    </span>
                    <span v-else class="variableValueSm">N/D</span>
               </b-col>
               <b-col>
                   <span class="variableTitleSm" >{{ $t('{variablePeriodoMedOleaje}') }}:</span>
                   <span class="variableDateSm">{{oleajeDate}}</span>
                    <span v-if="periodoMedioOleaje != null && !isNaN(periodoMedioOleaje)" class="variableValueSm" >
                      {{periodoMedioOleaje}}<span >s</span>
                    </span>
                    <span v-else class="variableValueSm">N/D</span>
               </b-col>
           </b-row>
             <b-row style="margin-top: 15px">
               <b-col cols="12">
                   <span class="variableTitleSm" >{{ $t('{variablePresionAtm}') }}:</span>
                   <span class="variableDateSm">{{presionAtmDate}}</span>
                     <span v-if="presionAtm != null && !isNaN(presionAtm)" class="variableValueSm" >
                      {{presionAtm}}<span >mb</span>
                    </span>
                    <span v-else class="variableValueSm">N/D</span>
               </b-col>
           </b-row>
           </div>
            <img v-if="showLogo && !loading" :src="defaultLogo" class="fadeIn" style="margin-top: 25px; float: right" />
        </b-card>
    </div>
</template>

<script>

import Vue from 'vue'
import MapUtils from "@/services/map.utils";

export default {
  name: "LocationsRTWidget",
  data() {
    return {
      defaultLogo: PC.default_map_logo,
      oleaje: null,
      nivMar: null,
      viento: null,
      tempAgua: null,
      periodoMedioOleaje: null,
      presionAtm: null,
      oleajeDate: null,
      nivMarDate: null,
      vientoDate: null,
      tempAguaDate: null,
      presionAtmDate: null,
      oleajeImg: null,
      nivMarImg: null,
      vientoImg: null,
      vientoDirImg: null,
      loading: true,
      vientoRotation: '',
      mapUtils: MapUtils,
      interval: null
    };
  },
  props: {
    locationType: { type: String, default:'', required: true },
    code: { type: Number, default: '', required: true },
    showExtraData: { type: Boolean, default: true },
    showLogo: { type: Boolean, default: false }
  },
  computed: {
   
  },
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
        var tipo = this.locationType == 'Puerto' ? 'harbor' : 'city';
        var result = await Vue.axios
            .get('https://movil.puertos.es/simo/seastate/' + tipo + '/' + this.code + '/extended')
            .catch((error) => {
                throw new Error(`[RWV] ApiService ${error}`)
            });
        var data = result.data;
        this.oleaje = data.swell ? parseFloat(data.swell[0].hm0).toFixed(2) : null;
        this.nivMar = data.level ? parseFloat(data.level[0].nivel).toFixed(2) : null;
        this.viento = data.wind ? (parseFloat(data.wind[0].vv_md) *  0.27777).toFixed(1) : null;
        this.vientoRotation = data.wind ? parseFloat(data.wind[0].dv_md) : null;
        this.tempAgua = data.temperature ? parseFloat(data.temperature[0].ts).toFixed(1) : null;
        this.periodoMedioOleaje = data.swell ? parseFloat(data.swell[0].tm).toFixed(2) : null;
        this.presionAtm = data.pressure ? parseFloat(data.pressure[0].ps).toFixed(2) : null;
        this.oleajeDate = data.swell ? this.printDate(data.swell[0].date) : null;
        this.nivMarDate = data.level ? this.printDate(data.level[0].date) : null;
        this.vientoDate = data.wind ? this.printDate(data.wind[0].date) : null;
        this.tempAguaDate = data.temperature ? this.printDate(data.temperature[0].date) : null;
        this.presionAtmDate = data.pressure ? this.printDate(data.pressure[0].date) : null;
        this.oleajeImg = require("@/assets/locationsWidget/surf_" + data.alert[0].surf + ".png");
        this.nivMarImg = require("@/assets/locationsWidget/seaLevel_" + data.alert[0].seaLevel + ".png");
        this.vientoImg = require("@/assets/locationsWidget/wind_" + data.alert[0].wind + ".png");
        this.vientoDirImg = require("@/assets/locationsWidget/" + this.mapUtils.getDirNameFromDeg(this.vientoRotation).toLowerCase() + "_w.png");
        this.loading = false;
      },

      printDate(dateInSecs) {
        var date = new Date(dateInSecs * 1000);
        return date.toLocaleDateString() + ' - ' + date.toISOString().split('T')[1].substr(0, 5) + 'h';
      }
  }
};
</script>

<style scoped>

.variableTitle {
    position: absolute; 
    color:white; 
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
    color:white; 
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
    position: absolute; 
    color:#ffc100; 
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