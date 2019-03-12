<template>

    <b-container style="margin-top: 15px" >
        <b-row style="margin-bottom: 10px">
            <b-col style="text-align: left; " offset="4">
                {{$t('{bancoDatosGraficos}')}}
            </b-col>
            <b-col style="text-align: left;">
                {{$t('{bancoDatosTablas}')}}
            </b-col>
        </b-row>
        <b-row v-for="param in bancoDatos" :key="param.id" >
            <b-col style="padding-top: 2px">
                <span  :title="$t('{' + param.variable + '}')" 
                      style="float: left; margin-right: 7px; margin-top: -4px; height: 25px" 
                      :class="param.variable.toLowerCase()">
                </span>
                <span >{{ param.nombre }}</span>
            </b-col>
             <b-col>
                <label style="margin-bottom: 0px !important;">
                    <span :class="param.graphicActive ? 'checkActive' : 'checkInactive'" > </span>
                    <input class="form-check-input" style="display: none" type="checkbox" v-model="param.graphicActive" @change="changeGraphParam(param)" />
                </label>
            </b-col>
            <b-col >
                <label style="margin-bottom: 0px !important;">
                    <span :class="param.tableActive ? 'checkActive' : 'checkInactive'" > </span>
                    <input class="form-check-input" style="display: none" type="checkbox" v-model="param.tableActive" @change="changeParam(param)" />
                </label>
            </b-col>
        </b-row>
        <b-row v-if="bancoDatos.length > 1">
            <b-col cols="4" style="padding-left: 47px">
                {{ $t('{allParams}') }}
            </b-col>
            <b-col>
                <label style="margin-bottom: 0px !important;">
                     <span :class="allGraphsActive ? 'checkActive' : 'checkInactive'" > </span>
                     <input class="form-check-input" style="display: none" type="checkbox" v-model="allGraphsActive" @change="changeAllGraphsParam(allGraphsActive)" />
                </label>
            </b-col>
        </b-row>
        <b-row v-if="hasMareaAstronomica()" style="margin-top: 20px">
          <b-col cols="8" style="font-weight:600;">
               {{ $t('{tablaMareasLabel}') }}
          </b-col>
          <b-col >
             <dx-button :text="$t('{tablaMareasButton}')" height="30" type="default" @click="openMareaAstronomica()" />
          </b-col >
      
        </b-row>
    </b-container>

</template>

<script>

import MapState from "@/state/map.state";
import DataPanelsService from "@/services/dataPanels.service";
import ApiService from "@/services/api.service";
import { BASE_URL_PORTUS, BANCO_DATOS_URL, BANCO_DATOS_URL_OLD } from '@/common/config';
import { MarkerClass } from "@/common/enums";
import DxButton from "devextreme-vue/button";
import Vue from "vue";

export default {
  name: "BancoDatosTab",
  components: {
      DxButton
  },
  data() {
      return {
          bancoDatos: [],
          mapState: MapState,
          // Determina si se marcan de una vez todos los checkboxes de 
          // la misma variable en Tiempo Real
          allVarsRT: true,
          allGraphsActive: false
      }
  },
  props: {
    markers: { type: Array, default: null, required: false }
  },
  computed: {
      contentLoaded() {
          return this.bancoDatos.length > 0;
      }
  },
  mounted() {
  },
  created() {
    this.init();
  },
  watch: {
      markers: function() {
          this.init();
      },
      contentLoaded: function() {
          if (this.contentLoaded)
            this.$emit('content-loaded');
      }
  },
  methods: {
      init() {
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
      },
      changeAllGraphsParam(value) {
          this.bancoDatos.forEach(param => {
              if (param.graphicActive != value) {
                  Vue.set(param, 'graphicActive', value);
                  this.changeGraphParam(param);
              }
          })
      },
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
                // Ojo: manejamos el global, no el local, pues podríamos tener parametros marcados anteriormente
                var markerId = this.getUniqueMarkerId(this.markers[0]);
                var bancoDatosState = this.mapState.getBancoDatos(markerId);
                DataPanelsService.addRTDataTable(this.markers[0], bancoDatosState.filter(param => param.tableActive));
             }
             // En los puntos-malla (Predicción), si elegimos un parámetro se marcan todos y la tabla depende de la variable
             if (this.markers[0].mapResource.markerClass == MarkerClass.PuntoMalla 
              || this.markers[0].mapResource.markerClass == MarkerClass.PuntoMallaVerif
              || this.markers[0].mapResource.markerClass == MarkerClass.Ubicacion) {
                 this.bancoDatos.forEach(p => {
                     Vue.set(p, 'tableActive', param.tableActive);
                 })
                 DataPanelsService.setPredDataTable(this.markers[0], this.markers[0].mapOption.variableType, param.tableActive);
             }
            DataPanelsService.saveDataUserPrefs(this.markers[0]);
         }, 750);
         
     },
     changeGraphParam(param) {
        // En las gráficas, podemos marcar parámetros individualmente
        if (this.markers[0].mapResource.markerClass == MarkerClass.EstacionRT) {
            DataPanelsService.setRTGraphParam(this.markers[0], param);
        }
        if (this.markers[0].mapResource.markerClass == MarkerClass.PuntoMalla
         || this.markers[0].mapResource.markerClass == MarkerClass.PuntoMallaVerif) {
            this.checkDir180Param(param);
            DataPanelsService.setPredGraphParam(this.markers[0], [param]);
        }
        if (this.markers[0].mapResource.markerClass == MarkerClass.Ubicacion) {
            this.checkDir180Param(param);
            var extraParam = { paramEseoo: 'SeaSea', graphicActive: param.graphicActive, unidad: 'm' };
            var parameters = [param, extraParam];
            DataPanelsService.setPredGraphParam(this.markers[0], parameters, null, true);
        }
        DataPanelsService.saveDataUserPrefs(this.markers[0]);

        if (this.bancoDatos.filter(param => param.graphicActive == true).length == 0)
            this.allGraphsActive = false;
        
     },
     checkDir180Param(param) {
         if ((param.paramEseoo == 'WindDir' || param.paramEseoo == 'MeanDir')  && param.paramEseoo.indexOf('180') == -1)
            param.paramEseoo += '180';
     },
     hasMareaAstronomica() {
         return this.markers[0].mareaAstronomica;
     },
     openMareaAstronomica() {
        window.open(BANCO_DATOS_URL_OLD + "Mareas/Principal1.php?Estacion=" 
                                + this.markers[0].mareaAstronomica.id 
                                + "&Lenguaje=es",'targetWindow',
                                          'toolbar=no,'
                                        + 'location=no,'
                                        + 'status=no,'
                                        + 'menubar=no,'
                                        + 'scrollbars=yes,'
                                        + 'resizable=yes,'
                                        + 'width=650,'
                                        + 'height=' + screen.availHeight);
     },

     // La lista de parámetros-checkboxes de cada marker la guardamos en un objeto
     // del global state (BancosDatos), para poder gestionar de forma coherente
     // la relación entre el estado del banco de datos  y cada tabla/gráfica abierta desde él,
     // así como mantener el estado de los checks en caso de una actualización (al añadir variables)

     setBancoDatos(params) {
         var markerId = this.getUniqueMarkerId(this.markers[0]);
         this.mapState.addBancoDatos(markerId, params.data);
         this.bancoDatos = this.mapState.getBancoDatos(markerId).filter(p => this.markers.map(m => m.mapOption.variableType).indexOf(p.variable) != -1);
         if (this.bancoDatos.filter(param => !param.graphicActive || param.graphicActive == false).length == 0)
            this.allGraphsActive = true;
     },

    // Devuelve un id para referenciar al marker en el banco de datos
    // Por lo general será su id normal pero si es punto de radar llevará adosado su lat/lon
    getUniqueMarkerId(marker) {
         return marker.id + (marker.radar ? ('/' + marker.latId + '-' + marker.lonId) : '');
     }
  }
};

</script>

<style scoped>

</style>