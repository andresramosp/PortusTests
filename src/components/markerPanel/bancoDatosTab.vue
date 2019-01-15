<template>

    <b-container style="margin-top: 15px">
        <b-row v-if="hrefPropietario" style="margin-bottom: 10px">
            <b-col col-md="12" offset-md="8">
                 <a :href="hrefPropietario" target='_blank'>
                    <img :src="imgPropietario"  />
                 </a>
            </b-col>
        </b-row>
        <b-row>
            <b-col style="text-align: left; font-weight:600;" offset="4">
                {{$t('{bancoDatosTablas}')}}
            </b-col>
            <b-col style="text-align: left; font-weight:600;">
                {{$t('{bancoDatosGraficos}')}}
            </b-col>
        </b-row>
        <b-row v-for="param in bancoDatos" :key="param.id">
            <b-col style="font-weight:600;">
                {{ param.nombre }}
            </b-col>
            <b-col>
                <input class="form-check-input" type="checkbox" v-model="param.tableActive" @change="changeParam(param)" />
            </b-col>
            <b-col>
                <input class="form-check-input" type="checkbox" v-model="param.graphicActive" @change="changeGraphParam(param)" />
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

  mounted() {
  },
  created() {
       var mi = this;
       if (this.markers[0].mapResource.markerClass == MarkerClass.ESTACION) {
           ApiService.post('parametros/' + this.markers[0].id + '?locale=' + this.$getLocale(), this.markers.map(m => m.mapOption.variableType))
            .then((params) => {
                this.bancoDatos = params.data;
            });
       }
       else {
           ApiService.post('parametros/?locale=' + this.$getLocale(), this.markers.map(m => m.mapOption.variableType))
            .then((params) => {
                this.bancoDatos = params.data;
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
             if (this.markers[0].mapResource.markerClass == MarkerClass.ESTACION) {
                 this.bancoDatos.forEach(p => {
                    if (p.variable == param.variable)
                        Vue.set(p, 'tableActive', param.tableActive);
                })
                 this.mapState.addRTDataTable(this.markers[0], this.bancoDatos.filter(param => param.tableActive));
             }
             // En los puntos-malla (Predicción), si elegimos un parámetro se marcan todos y la tabla depende de la variable
             if (this.markers[0].mapResource.markerClass == MarkerClass.PUNTO_MALLA 
              || this.markers[0].mapResource.markerClass == MarkerClass.UBICACION) {
                 this.bancoDatos.forEach(p => {
                     Vue.set(p, 'tableActive', param.tableActive);
                 })
                 this.mapState.setPredDataTable(this.markers[0], this.markers[0].mapOption.variableType, param.tableActive);
             }
         }, 750);
         
     },
     changeGraphParam(param) {
        // En las gráficas, podemos marcar parámetros individualmente
        if (this.markers[0].mapResource.markerClass == MarkerClass.ESTACION) {
            this.mapState.setRTGraphParam(this.markers[0], param);
        }
        if (this.markers[0].mapResource.markerClass == MarkerClass.PUNTO_MALLA) {
            this.checkDir180Param(param);
            this.mapState.setPredGraphParam(this.markers[0], [param]);
        }
        if (this.markers[0].mapResource.markerClass == MarkerClass.UBICACION) {
            this.checkDir180Param(param);
            var extraParam = { paramEseoo: 'SeaSea', graphicActive: param.graphicActive, unidad: 'm' };
            var parameters = [param, extraParam];
            this.mapState.setPredGraphParam(this.markers[0], parameters, null, true);
        }
        
     },
     checkDir180Param(param) {
         if ((param.paramEseoo == 'WinDir' || param.paramEseoo == 'MeanDir')  && param.paramEseoo.indexOf('180') == -1)
            param.paramEseoo += '180';
     },
     hasMareaAstronomica() {
         return this.markers[0].mareaAstronomica;
     },
     openMareaAstronomica() {
         window.open(INFORMES_URL + "Mareas/Principal1.php?Estacion=" + this.markers[0].mareaAstronomica.id + "&Lenguaje=es", '_blank');
     }
  }
};

</script>