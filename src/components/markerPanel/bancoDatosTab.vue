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
                <!-- {{ '(' + param.variable + ') ' + param.nombre }} -->
                {{ param.nombre }}
            </b-col>
            <b-col>
                <input class="form-check-input" type="checkbox" v-model="param.active" @change="changeParam(param)" />
            </b-col>
            <b-col>
                <input class="form-check-input" type="checkbox" />
            </b-col>
        </b-row>
    </b-container>

</template>

<script>

import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import { BASE_URL_PORTUS } from '@/common/config';
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
             // En las estaciones podemos seleccionar parámetros individualmente.
             if (this.markers[0].mapResource.markerClass == MarkerClass.ESTACION) {
                 if (this.allVarsRT) {
                     this.bancoDatos.forEach(p => {
                        if (p.variable == param.variable)
                            Vue.set(p, 'active', param.active);
                    })
                 }
                 this.mapState.setRTDataTable(this.markers[0], this.bancoDatos.filter(param => param.active));
             }
             // En los puntos-malla, si elegimos un parámetro se marcan todos y la tabla depende de la variable
             if (this.markers[0].mapResource.markerClass == MarkerClass.PUNTO_MALLA 
              || this.markers[0].mapResource.markerClass == MarkerClass.UBICACION) {
                 this.bancoDatos.forEach(p => {
                     Vue.set(p, 'active', param.active);
                 })
                 this.mapState.setPredDataTable(param.active ? this.markers[0] : null, param.active ? this.markers[0].mapOption.variableType: null);
             }
         }, 750);
         
     }
  }
};

</script>