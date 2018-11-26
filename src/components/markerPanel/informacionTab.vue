<template>

 <b-container style="margin-top: 15px">
        <b-row>
            <b-col cols="8" >
                <b-row v-for="data in informacion" :key="data.key" v-if="data.value != null && data.value != undefined">
                    <b-col style="font-weight:600;" cols="4">{{data.key}}</b-col>
                    <b-col v-if="!data.href">{{data.value}}</b-col>
                    <b-col v-else><a v-if="data.href" :href="data.href" target='_blank'>{{data.value}}</a></b-col>
                </b-row>
            </b-col>
            <b-col>
                <img :src="imgUrl"  />
            </b-col>
        </b-row>
</b-container>

</template>

<script>

import { MarkerClass } from "@/common/enums";
import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import { INFORMES_URL, BASE_URL_PORTUS } from '@/common/config';

export default {
  name: "InformacionTab",
  props: {
    markers: { type: Array, default: [], required: false }
  },
  data() {
    return {
      mapState: MapState,
      informacion: []
    };
  },
  computed: {
    imgUrl() {
        //"https://maps.googleapis.com/maps/api/staticmap?zoom=5&size=160x140&maptype=satellite&markers=color:red%7Clabel:%7C" + this.markers[0].latitud + "," + this.markers[0].latitud + "&sensor=false&key=" + GOOGLE_API_KEY;
        if (this.markers[0].mapResource.markerClass == MarkerClass.ESTACION 
          || this.markers[0].mapResource.markerClass == MarkerClass.ESTACION_HISTORICO
          || this.markers[0].mapResource.markerClass == MarkerClass.ANTENA_RADAR) {
          return BASE_URL_PORTUS + "/img/imgEstaciones/" + this.markers[0].id + ".png";
        }
        else {
          return require("@/assets/markers/markerImg.png");
        }
        
      }
  },
  mounted() {
  },
  created() {

      if (this.markers[0].mapResource.markerClass == MarkerClass.UBICACION) {
              this.informacion = [
                { key: this.$t("{longitudInfo}"), value: this.markers[0].longitud.toFixed(2) + " O" },
                { key: this.$t("{latitudInfo}"), value: this.markers[0].latitud.toFixed(2) + " N" },
                { key: this.$t("{codigoModeloInfo}"), value: this.markers[0].codigoModelo },
                { key: this.$t("{verificacionInfo}"), value: this.markers[0].mareografo } // Mirar
              ];
          }
        else if (this.markers[0].mapResource.markerClass == MarkerClass.PUNTO_MALLA) {
            this.informacion = [
              { key: this.$t("{longitudInfo}"), value: this.markers[0].longitud.toFixed(2) + " O" },
              { key: this.$t("{latitudInfo}"), value: this.markers[0].latitud.toFixed(2) + " N" },
              { key: this.$t("{codigoModeloInfo}"), value: this.markers[0].id },
              { key: this.$t("{cadencyInfo}"), value: (this.markers[0].tdelta * 60) + ' min'  },
              { key: this.$t("{mallaInfo}"), value: this.markers[0].malla },
              // { key: "Verificación", value: this.markers[0].mareografo } // ?
            ];
        }
        else if (this.markers[0].mapResource.markerClass == MarkerClass.PUNTO_MALLA_VERIF) {
           this.informacion = [
              { key: this.$t("{longitudInfo}"), value: this.markers[0].longitud.toFixed(2) + " O" },
              { key: this.$t("{latitudInfo}"), value: this.markers[0].latitud.toFixed(2) + " N" },
              { key:  this.$t("{codigoModeloInfo}"), value: this.markers[0].id },
              { key: this.$t("{cadencyInfo}"), value: (this.markers[0].tdelta * 60) + ' min'  }
            ];
        }
        else if (this.markers[0].mapResource.markerClass == MarkerClass.ESTACION 
              || this.markers[0].mapResource.markerClass == MarkerClass.ESTACION_HISTORICO
              || this.markers[0].mapResource.markerClass == MarkerClass.PUNTO_MALLA_HISTORICO) {
            this.informacion = [
                { key: this.$t("{ubicacionEstacionInfo}"), value: this.markers[0].ubicacion },
                { key: this.$t("{longitudInfo}"), value: this.markers[0].longitud.toFixed(2) + " O" },
                { key: this.$t("{latitudInfo}"), value: this.markers[0].latitud.toFixed(2) + " N" },
                { key: this.$t("{cadencyInfo}"), value: this.markers[0].cadencia ? this.markers[0].cadencia + ' Min' : null  },
                { key: this.$t("{codigoEstacionInfo}"), value: this.markers[0].id },
                { key: this.$t("{profundidadEstacionInfo}"), value: this.markers[0].altitudProfundidad ? this.markers[0].altitudProfundidad + ' m' : null },
                { key: this.$t("{fechaInicialFondeoInfo}"), value: this.markers[0].fechaAlta ? new Date(this.markers[0].fechaAlta).toISOString().split('T')[0] : null },
                { key: this.$t("{fechaFinFondeoInfo}"), value: this.markers[0].fechaFin ? new Date(this.markers[0].fechaFin).toISOString().split('T')[0] : null },
                { key: this.$t("{tipoSensorInfo}"), value: this.markers[0].tipoSensor },
                { key: this.$t("{modeloEstacionInfo}"), value: this.markers[0].modelo },
                { key: this.$t("{comentariosEstacionInfo}"), value: this.markers[0].comentarios }
              ];

          var mi = this;
          ApiService.get('redes/' + this.markers[0].redId + '?locale=' + this.$getLocale())
          .then((red) => {
              this.informacion.push({ key: this.$t("{conjuntoDatosInfo}"), value: red.data.descripcion, bold: true, href: INFORMES_URL + 'BD/informes/INT_'	+ red.data.id + '.pdf' })
          })
        }
        else if (this.markers[0].mapResource.markerClass == MarkerClass.ANTENA_RADAR) {
            this.informacion = [
                { key: this.$t("{ubicacionEstacionInfo}"), value: this.markers[0].ubicacion },
                { key: this.$t("{longitudInfo}"), value: this.markers[0].longitud.toFixed(2) + " O" },
                { key: this.$t("{latitudInfo}"), value: this.markers[0].latitud.toFixed(2) + " N" },
                { key: this.$t("{codigoEstacionInfo}"), value: this.markers[0].id },
                { key: this.$t("{fechaInicialFondeoInfo}"), value: this.markers[0].fechaAlta ? new Date(this.markers[0].fechaAlta).toISOString().split('T')[0] : null },
                { key: this.$t("{fechaFinFondeoInfo}"), value: this.markers[0].fechaFin ? new Date(this.markers[0].fechaFin).toISOString().split('T')[0] : null },
                { key: this.$t("{tipoSensorInfo}"), value: this.markers[0].tipoSensor },
                { key: this.$t("{modeloEstacionInfo}"), value: this.markers[0].modelo },
                { key: this.$t("{comentariosEstacionInfo}"), value: this.markers[0].comentarios }
              ];
              
          // TODO
          var mi = this;
          ApiService.get('radares/' + this.markers[0].radarId + '?locale=' + this.$getLocale())
          .then((radar) => {
              this.informacion.push({ key: this.$t("{conjuntoDatosInfo}"), value: radar.data.descripcion, bold: true, href: INFORMES_URL + 'BD/informes/INT_'	+ radar.data.id + '.pdf' })
          })
        }

  },
  methods: {
  }
};


// asyncComputed: {
  //   async informacion() {
  //       if (this.markers[0].mapResource.markerClass == MarkerClass.UBICACION) {
  //             return [
  //               { key: this.$t("{longitudInfo}"), value: this.markers[0].longitud.toFixed(2) + " O" },
  //               { key: this.$t("{latitudInfo}"), value: this.markers[0].latitud.toFixed(2) + " N" },
  //               { key: this.$t("{codigoModeloInfo}"), value: this.markers[0].codigoModelo },
  //               { key: this.$t("{verificacionInfo}"), value: this.markers[0].mareografo } // Mirar
  //             ];
  //         }
  //       else if (this.markers[0].mapResource.markerClass == MarkerClass.PUNTO_MALLA) {
  //           return [
  //             { key: this.$t("{longitudInfo}"), value: this.markers[0].longitud.toFixed(2) + " O" },
  //             { key: this.$t("{latitudInfo}"), value: this.markers[0].latitud.toFixed(2) + " N" },
  //             { key: this.$t("{codigoModeloInfo}"), value: this.markers[0].id },
  //             { key: this.$t("{cadencyInfo}"), value: (this.markers[0].tdelta * 60) + ' min'  },
  //             { key: this.$t("{mallaInfo}"), value: this.markers[0].malla },
  //             // { key: "Verificación", value: this.markers[0].mareografo } // ?
  //           ];
  //       }
  //       else if (this.markers[0].mapResource.markerClass == MarkerClass.PUNTO_MALLA_VERIF) {
  //          return [
  //             { key: this.$t("{longitudInfo}"), value: this.markers[0].longitud.toFixed(2) + " O" },
  //             { key: this.$t("{latitudInfo}"), value: this.markers[0].latitud.toFixed(2) + " N" },
  //             { key:  this.$t("{codigoModeloInfo}"), value: this.markers[0].id },
  //             { key: this.$t("{cadencyInfo}"), value: (this.markers[0].tdelta * 60) + ' min'  }
  //           ];
  //       }
  //       // TODO: caso especial PUNTO_MALLA_HISTORICO
  //       else if (this.markers[0].mapResource.markerClass == MarkerClass.ESTACION 
  //             || this.markers[0].mapResource.markerClass == MarkerClass.ESTACION_HISTORICO
  //             || this.markers[0].mapResource.markerClass == MarkerClass.PUNTO_MALLA_HISTORICO) {
  //           var red = await ApiService.get('redes/' + this.markers[0].redId + '?locale=' + this.$getLocale());
  //           return[
  //               { key: this.$t("{ubicacionEstacionInfo}"), value: this.markers[0].ubicacion },
  //               { key: this.$t("{longitudInfo}"), value: this.markers[0].longitud.toFixed(2) + " O" },
  //               { key: this.$t("{latitudInfo}"), value: this.markers[0].latitud.toFixed(2) + " N" },
  //               { key: this.$t("{cadencyInfo}"), value: this.markers[0].cadencia + ' Min'  },
  //               { key: this.$t("{codigoEstacionInfo}"), value: this.markers[0].id },
  //               { key: this.$t("{profundidadEstacionInfo}"), value: this.markers[0].altitudProfundidad + ' m' },
  //               { key: this.$t("{fechaInicialFondeoInfo}"), value: this.markers[0].fechaAlta ? new Date(this.markers[0].fechaAlta).toISOString().split('T')[0] : null },
  //               { key: this.$t("{fechaFinFondeoInfo}"), value: this.markers[0].fechaFin ? new Date(this.markers[0].fechaFin).toISOString().split('T')[0] : null },
  //               { key: this.$t("{tipoSensorInfo}"), value: this.markers[0].tipoSensor },
  //               { key: this.$t("{modeloEstacionInfo}"), value: this.markers[0].modelo },
  //               { key: this.$t("{comentariosEstacionInfo}"), value: this.markers[0].comentarios },
  //               { key: this.$t("{conjuntoDatosInfo}"), value: red.data.descripcion, bold: true, href: INFORMES_URL + 'BD/informes/INT_'	+ red.data.id + '.pdf' }
  //             ];

  //         // var mi = this;
  //         // ApiService.get('redes/' + this.markers[0].redId + '?locale=' + this.$getLocale())
  //         // .then((red) => {
  //         //     this.informacion.push({ key: this.$t("{conjuntoDatosInfo}"), value: red.data.descripcion, bold: true, href: INFORMES_URL + 'BD/informes/INT_'	+ red.data.id + '.pdf' })
  //         // })
  //       }
  //   }

  // },

</script>

<style scoped>

.infoPanelClass {
  font-size: 12px;
}
</style>


