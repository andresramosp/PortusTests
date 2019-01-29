<template>

    <b-container style="margin-top: 15px" >
        <b-row v-if="hrefPropietario" style="margin-bottom: 10px">
            <b-col col-md="12" offset-md="8">
                 <a :href="hrefPropietario" target='_blank'>
                    <img :src="imgPropietario"  />
                 </a>
            </b-col>
        </b-row>
        <b-row style="margin-bottom: 10px">
            <b-col style="text-align: left; " offset="4">
                {{$t('{bancoDatosTablas}')}}
            </b-col>
            <b-col style="text-align: left;">
                {{$t('{bancoDatosGraficos}')}}
            </b-col>
        </b-row>
        <b-row v-for="param in bancoDatos" :key="param.id" >
            <b-col style="padding-top: 2px">
                <img style="float: left; margin-right: 7px; margin-top: -4px;" width="25" 
                    :title="$t('{' + param.variable + '}')"
                    :src='require("@/assets/icons/bancoDatos/" + param.variable.toLowerCase() + ".png")'>
                <span>{{ param.nombre }}</span>
            </b-col>
            <b-col >
                <label style="margin-bottom: 0px !important;">
                    <img style="" width="18" :src="param.tableActive ? require('@/assets/icons/check_activo.png') : require('@/assets/icons/check_inactivo.png')" >
                    <input class="form-check-input" style="display: none" type="checkbox" v-model="param.tableActive" @change="changeParam(param)" />
                </label>
            </b-col>
            <b-col>
                <label style="margin-bottom: 0px !important;">
                    <img style="" width="18" :src="param.graphicActive ? require('@/assets/icons/check_activo.png') : require('@/assets/icons/check_inactivo.png')" >
                    <input class="form-check-input" style="display: none" type="checkbox" v-model="param.graphicActive" @change="changeGraphParam(param)" />
                </label>
            </b-col>
        </b-row>
        <b-row v-if="hasMareaAstronomica()" style="margin-top: 20px">
          <b-col cols="8" style="font-weight:600;">
               {{ $t('{tablaMareasLabel}') }}
          </b-col>
          <b-col >
            <b-button size="sm" variant="outline-primary" @click="openMareaAstronomica()">
              {{ $t('{tablaMareasButton}') }}
             </b-button>
          </b-col >
      
        </b-row>
    </b-container>

</template>

<script>

import MapState from "@/state/map.state";
import DataPanelsUtils from "@/services/dataPanels.utils";
import ApiService from "@/services/api.service";
import { BASE_URL_PORTUS, INFORMES_URL } from '@/common/config';
import { MarkerClass } from "@/common/enums";
import Vue from "vue";

export default {
  name: "BancoDatosTab",
  data() {
      return {
          bancoDatos: [],
          mapState: MapState,
          imgPropietario: null,
          hrefPropietario: null,
          // Determina si se marcan de una vez todos los checkboxes de 
          // la misma variable en Tiempo Real
          allVarsRT: true 
      }
  },
  props: {
    markers: { type: Array, default: null, required: false }
  },
//   watch: {
//       'mapState.bancosDatos': function() {
//           this.bancoDatos = this.mapState.getBancoDatos(this.markers[0].id).filter(p => this.markers.map(m => m.mapOption.variableType).indexOf(p.variable) != -1);
//       }
//   },
//   computed: {
//       bancoDatos() {
//           return this.mapState.getBancoDatos(this.markers[0].id).filter(p => this.markers.map(m => m.mapOption.variableType).indexOf(p.variable) != -1);
//       }
//   },
  mounted() {
  },
  created() {
       var mi = this;
        if (this.markers[0].mapResource.markerClass == MarkerClass.EstacionRT) {
            ApiService.post('parametros/' + this.markers[0].id + '?locale=' + this.$getLocale(), this.markers.map(m => m.mapOption.variableType))
                .then((params) => {
                    this.setBancoDatos(params);
                });
        }
        else {
            ApiService.post('parametros/?locale=' + this.$getLocale(), [this.markers[0].mapOption.variableType])
                .then((params) => {
                    this.setBancoDatos(params);
                });
           }
       
       if (this.markers[0].propietario != null) {
          this.imgPropietario = BASE_URL_PORTUS + "/img/logosOrganismos/" + this.markers[0].propietario + ".png";
          this.hrefPropietario = this.markers[0].urlPropietario;
       }

  },
  methods: {
     changeParam(param) {
         if (this.timeOut)
            clearTimeout(this.timeOut);
         this.timeOut = setTimeout(() => {
             // En las estaciones (Tiempo Real), si elegimos un parámetro se marcan todos los de la misma variable
             if (this.markers[0].mapResource.markerClass == MarkerClass.EstacionRT) {
                 this.bancoDatos.forEach(p => {
                    if (p.variable == param.variable)
                        Vue.set(p, 'tableActive', param.tableActive);
                })
                 DataPanelsUtils.addRTDataTable(this.markers[0], this.bancoDatos.filter(param => param.tableActive));
             }
             // En los puntos-malla (Predicción), si elegimos un parámetro se marcan todos y la tabla depende de la variable
             if (this.markers[0].mapResource.markerClass == MarkerClass.PuntoMalla 
              || this.markers[0].mapResource.markerClass == MarkerClass.PuntoMallaVerif
              || this.markers[0].mapResource.markerClass == MarkerClass.Ubicacion) {
                 this.bancoDatos.forEach(p => {
                     Vue.set(p, 'tableActive', param.tableActive);
                 })
                 DataPanelsUtils.setPredDataTable(this.markers[0], this.markers[0].mapOption.variableType, param.tableActive);
             }
             DataPanelsUtils.saveDataUserPrefs(this.markers[0]);
         }, 750);
         
     },
     changeGraphParam(param) {
        // En las gráficas, podemos marcar parámetros individualmente
        if (this.markers[0].mapResource.markerClass == MarkerClass.EstacionRT) {
            DataPanelsUtils.setRTGraphParam(this.markers[0], param);
        }
        if (this.markers[0].mapResource.markerClass == MarkerClass.PuntoMalla
         || this.markers[0].mapResource.markerClass == MarkerClass.PuntoMallaVerif) {
            this.checkDir180Param(param);
            DataPanelsUtils.setPredGraphParam(this.markers[0], [param]);
        }
        if (this.markers[0].mapResource.markerClass == MarkerClass.Ubicacion) {
            this.checkDir180Param(param);
            var extraParam = { paramEseoo: 'SeaSea', graphicActive: param.graphicActive, unidad: 'm' };
            var parameters = [param, extraParam];
            DataPanelsUtils.setPredGraphParam(this.markers[0], parameters, null, true);
        }
        DataPanelsUtils.saveDataUserPrefs(this.markers[0]);
        
     },
     checkDir180Param(param) {
         if ((param.paramEseoo == 'WindDir' || param.paramEseoo == 'MeanDir')  && param.paramEseoo.indexOf('180') == -1)
            param.paramEseoo += '180';
     },
     hasMareaAstronomica() {
         return this.markers[0].mareaAstronomica;
     },
     openMareaAstronomica() {
         window.open(INFORMES_URL + "Mareas/Principal1.php?Estacion=" + this.markers[0].mareaAstronomica.id + "&Lenguaje=es", '_blank');
     },

     // La lista de parámetros-checkboxes de cada marker la guardamos en un objeto
     // del global state (BancosDatos), para poder gestionar de forma coherente
     // la relación entre el estado del banco de datos  y cada tabla/gráfica abierta desde él,
     // así como mantener el estado de los checks en caso de una actualización (al añadir variables)

     setBancoDatos(params) {
         this.mapState.addBancoDatos(this.markers[0].id, params.data);
         this.bancoDatos = this.mapState.getBancoDatos(this.markers[0].id).filter(p => this.markers.map(m => m.mapOption.variableType).indexOf(p.variable) != -1);
     }
  }
};

</script>

<style scoped>

</style>