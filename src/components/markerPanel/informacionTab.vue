<template>

 <b-container class="infoPanelClass" style="margin-top: 15px">
        <b-row>
            <b-col cols="8" >
                <b-row v-for="data in informacion" :key="data.key" v-if="data.value != null && data.value != undefined">
                    <b-col style="font-weight:600;" cols="4">{{data.key}}</b-col>
                    <b-col v-if="data.htmlContent" v-html="data.value"></b-col>
                    <b-col v-else-if="data.href"><a v-if="data.href" :href="data.href" target='_blank'>{{data.value}}</a></b-col>
                    <b-col v-else>{{data.value}}</b-col>
                </b-row>
            </b-col>
            <b-col>
                <img :src="imgUrl"  />
            </b-col>
        </b-row>
        <b-row v-if="hasPeriodosFondeo()" style="margin-top: 10px">
          <b-col>
             <dx-button :text="'Períodos de fondeo'" height="30" type="default" @click="openPeriodosFondeo()" />
          </b-col>
        </b-row>
</b-container>

</template>

<script>

import { MarkerClass } from "@/common/enums";
import MapState from "@/state/map.state";
import MapService from "@/services/map.service";
import ApiService from "@/services/api.service";
import { BANCO_DATOS_URL, BASE_URL_PORTUS } from '@/common/config';
import DxButton from "devextreme-vue/button";

export default {
  name: "InformacionTab",
  components: {
    DxButton
  },
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
        if (this.markers[0].mapResource.markerClass == MarkerClass.EstacionRT 
          || this.markers[0].mapResource.markerClass == MarkerClass.EstacionHist
          || this.markers[0].mapResource.markerClass == MarkerClass.AntenaRadar) {
          return BASE_URL_PORTUS + "/img/imgEstaciones/" + this.markers[0].id + ".png";
        }
        else {
          return require("@/assets/markers/markerImg.png");
        }
        
      }
  },
  mounted() {
    this.$emit("content-loaded");
  },
  created() {
    this.init();
  },
  watch: {
    markers: function() {
      this.init()
    }
  },
  methods: {
     init() {
        if (this.markers[0].mapResource.markerClass == MarkerClass.Ubicacion) {
              this.informacion = [
                { key: this.$t("{longitudInfo}"), value: MapService.lonToString(this.markers[0].longitud) },
                { key: this.$t("{latitudInfo}"), value: MapService.latToString(this.markers[0].latitud) },
                { key: this.$t("{codigoModeloInfo}"), value: this.markers[0].codigoModelo },
                { key: this.$t("{verificacionInfo}"), value: this.markers[0].mareografo } // Mirar
              ];
          }
        else if (this.markers[0].mapResource.markerClass == MarkerClass.PuntoMalla 
              || this.markers[0].mapResource.markerClass == MarkerClass.PuntoMallaHist) {
            this.informacion = [
              { key: this.$t("{longitudInfo}"), value: MapService.lonToString(this.markers[0].longitud) },
              { key: this.$t("{latitudInfo}"), value: MapService.latToString(this.markers[0].latitud) },
              { key: this.$t("{codigoModeloInfo}"), value: this.markers[0].id },
              { key: this.$t("{cadencyInfo}"), value: (this.markers[0].tdelta * 60) + ' min'  },
              { key: this.$t("{mallaInfo}"), value: this.markers[0].malla },
              { key: this.$t("{conjuntoDatosInfo}"), value: this.markers[0].red ? this.markers[0].red.descripcion : null, bold: true, href: this.markers[0].red ? (BANCO_DATOS_URL + 'BD/informes/INT_'	+ this.markers[0].red.id + '.pdf') : null }
            ];
        }
        else if (this.markers[0].mapResource.markerClass == MarkerClass.PuntoMallaVerif) {
           this.informacion = [
              { key: this.$t("{longitudInfo}"), value: MapService.lonToString(this.markers[0].longitud) },
                { key: this.$t("{latitudInfo}"), value: MapService.latToString(this.markers[0].latitud) },
              { key:  this.$t("{codigoModeloInfo}"), value: this.markers[0].id },
              { key: this.$t("{cadencyInfo}"), value: (this.markers[0].tdelta * 60) + ' min'  }
            ];
        }
        else if (this.markers[0].mapResource.markerClass == MarkerClass.EstacionRT 
              || this.markers[0].mapResource.markerClass == MarkerClass.EstacionHist) {
            this.informacion = [
                { key: this.$t("{ubicacionEstacionInfo}"), value: this.markers[0].ubicacion },
                { key: this.$t("{longitudInfo}"), value: MapService.lonToString(this.markers[0].longitud) },
                { key: this.$t("{latitudInfo}"), value: MapService.latToString(this.markers[0].latitud) },
                { key: this.$t("{cadencyInfo}"), value: this.markers[0].cadencia ? this.markers[0].cadencia + ' Min' : null  },
                { key: this.$t("{codigoEstacionInfo}"), value: this.markers[0].id },
                { key: this.$t("{profundidadEstacionInfo}"), value: this.markers[0].altitudProfundidad ? this.markers[0].altitudProfundidad + ' m' : null },
                { key: this.$t("{fechaInicialFondeoInfo}"), value: this.markers[0].fechaAlta ? new Date(this.markers[0].fechaAlta.replace('+', '')).toLocaleDateString().replaceAll('/', '-') : null },
                { key: this.$t("{fechaFinFondeoInfo}"), value: this.markers[0].fechaFin ? new Date(this.markers[0].fechaFin.replace('+', '')).toLocaleDateString().replaceAll('/', '-') : null },
                { key: this.$t("{tipoSensorInfo}"), value: this.markers[0].tipoSensor },
                { key: this.$t("{modeloEstacionInfo}"), value: this.markers[0].modelo },
                { key: this.$t("{comentariosEstacionInfo}"), value: this.markers[0].comentarios, htmlContent: true },
                { key: this.$t("{conjuntoDatosInfo}"), value: this.markers[0].red.descripcion, bold: true, href: BANCO_DATOS_URL + 'BD/informes/INT_'	+ this.markers[0].red.id + '.pdf' }
              ];
        }
        else if (this.markers[0].mapResource.markerClass == MarkerClass.AntenaRadar) {
            this.informacion = [
                { key: this.$t("{ubicacionEstacionInfo}"), value: this.markers[0].ubicacion },
                { key: this.$t("{longitudInfo}"), value: MapService.lonToString(this.markers[0].longitud) },
                { key: this.$t("{latitudInfo}"), value: MapService.latToString(this.markers[0].latitud) },
                { key: this.$t("{codigoEstacionInfo}"), value: this.markers[0].id },
                { key: this.$t("{fechaInicialFondeoInfo}"), value: this.markers[0].fechaAlta ? new Date(this.markers[0].fechaAlta).toLocaleDateString().replaceAll('/', '-') : null },
                { key: this.$t("{fechaFinFondeoInfo}"), value: this.markers[0].fechaFin ? new Date(this.markers[0].fechaFin).toLocaleDateString().replaceAll('/', '-') : null },
                { key: this.$t("{tipoSensorInfo}"), value: this.markers[0].tipoSensor },
                { key: this.$t("{modeloEstacionInfo}"), value: this.markers[0].modelo },
                { key: this.$t("{comentariosEstacionInfo}"), value: this.markers[0].comentarios, htmlContent: true },
                { key: this.$t("{conjuntoDatosInfo}"), value: this.markers[0].radar.red.nombre, bold: true, href: BANCO_DATOS_URL + 'BD/informes/INT_'	+ this.markers[0].radar.red.id + '.pdf' }
              ];
              
          // TODO
          var mi = this;
          ApiService.get('radares/' + this.markers[0].radarId + '?locale=' + this.$getLocale())
          .then((radar) => {
              this.informacion.push({ key: this.$t("{conjuntoDatosInfo}"), value: radar.data.descripcion, bold: true, href: BANCO_DATOS_URL + 'BD/informes/INT_'	+ radar.data.id + '.pdf' })
          })
        }
     },
     openLink(url) {
        window.open(url,'targetWindow',
                                     'toolbar=no,'
                                   + 'location=no,'
                                   + 'status=no'
                                   + 'menubar=no'
                                   + 'scrollbars=yes'
                                   + 'resizable=yes'
                                   + 'width=650'
                                   + 'height=' + (screen.availHeight - 50));
    },
    hasPeriodosFondeo() {
      return (this.markers[0].mapResource.markerClass == MarkerClass.EstacionHist
          && this.markers[0].red.tipoRed == "REDEXT") 
          || (this.markers[0].mapResource.markerClass == MarkerClass.AntenaRadar);
    },
    openPeriodosFondeo() {
      this.openLink(BASE_URL_PORTUS + 'pdf/pfondeo/' + this.markers[0].id + '.pdf');
    }
  }
};


</script>

<style scoped>

.infoPanelClass {
  font-size: 12px;
}
</style>


