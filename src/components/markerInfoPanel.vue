<template>
<b-modal v-model="modalShow" v-if="markers.length > 0" @hidden="onHidden" size="lg" :title="modalTitle">
    <b-tabs class='infoPanelClass' >
        <b-tab :title="$t('{accesoADatosTab}')" active>
            <b-container style="margin-top: 15px">
                <b-row v-for="param in bancoDatos" :key="param.id">
                    <b-col>{{param.nombre}}</b-col>
                    <b-col>x</b-col>
                    <b-col>x</b-col>
                </b-row>
            </b-container>
        </b-tab>
        <b-tab :title="$t('{informacionTab}')" v-if="informacion">
           <b-container style="margin-top: 15px">
               <b-row>
                   <b-col cols="8">
                       <b-row v-for="data in informacion" :key="data.key" v-if="data.value">
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
        </b-tab>
      </b-tabs>
</b-modal>
</template>

<script>

import { MarkerClass } from "@/common/enums";
import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import { INFORMES_URL } from '@/common/config';

export default {
  name: "MarkerInfoPanel",
  props: {
    markers: { type: Array, default: null, required: false }
  },
  data() {
    return {
      modalShow: false,
      modalTitle: null,
      informacion: null,
      bancoDatos: null
    };
  },
  watch: {
    markers: function() {
      if (this.markers.length > 0) {
        this.createPanel();
        this.modalShow = true;
      }
    }
  },
  computed: {
    imgUrl() {
        //"https://maps.googleapis.com/maps/api/staticmap?zoom=5&size=160x140&maptype=satellite&markers=color:red%7Clabel:%7C" + this.markers[0].latitud + "," + this.markers[0].latitud + "&sensor=false&key=" + GOOGLE_API_KEY;
        return require("@/assets/markers/markerImg.png");
      }
    },
  mounted() {
  },
  created() {
  },
  methods: {
    createPanel() {
        if (this.markers[0].mapResource.markerClass == MarkerClass.UBICACION) {
              this.modalTitle = this.$t("{tipoUbicacion"+this.markers[0].tipoUbicacion+"}") + ": " + this.markers[0].nombre;
              this.informacion = [
                { key: this.$t("{longitudInfo}"), value: this.markers[0].longitud.toFixed(2) + " O" },
                { key: this.$t("{latitudInfo}"), value: this.markers[0].latitud.toFixed(2) + " N" },
                { key: this.$t("{codigoModeloInfo}"), value: this.markers[0].codigoModelo },
                { key: this.$t("{verificacionInfo}"), value: this.markers[0].mareografo } // Mirar
              ];
          }
        else if (this.markers[0].mapResource.markerClass == MarkerClass.PUNTO_MALLA) {
            this.modalTitle = "Pred. " +  this.$t(this.markers[0].mapOption.name) + ": " + (this.markers[0].nombre ? this.markers[0].nombre : " Lat " + this.markers[0].latitud.toFixed(2) + " N" + ": Lon " + this.markers[0].longitud.toFixed(2) + " O");
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
           this.modalTitle = this.$t("{verificacionInfo}") + ": " + this.markers[0].nombre;
           this.informacion = [
              { key: this.$t("{longitudInfo}"), value: this.markers[0].longitud.toFixed(2) + " O" },
              { key: this.$t("{latitudInfo}"), value: this.markers[0].latitud.toFixed(2) + " N" },
              { key:  this.$t("{codigoModeloInfo}"), value: this.markers[0].id },
              { key: this.$t("{cadencyInfo}"), value: (this.markers[0].tdelta * 60) + ' min'  }
            ];
        }
        else if (this.markers[0].mapResource.markerClass == MarkerClass.ESTACION || this.markers[0].mapResource.markerClass == MarkerClass.ESTACION_HISTORICO) {
          var mi = this;
          ApiService.get('redes/' + this.markers[0].redId + '?locale=' + this.$getLocale())
          .then((red) => {
              mi.modalTitle = mi.markers[0].nombre;
              mi.informacion = [
                { key: this.$t("{longitudInfo}"), value: mi.markers[0].longitud.toFixed(2) + " O" },
                { key: this.$t("{latitudInfo}"), value: mi.markers[0].latitud.toFixed(2) + " N" },
                { key: this.$t("{cadencyInfo}"), value: mi.markers[0].cadencia + ' Min'  },
                { key: this.$t("{codigoEstacionInfo}"), value: mi.markers[0].id },
                { key: this.$t("{profundidadEstacionInfo}"), value: mi.markers[0].altitudProfundidad + ' m' },
                { key: this.$t("{fechaInicialFondeoInfo}"), value: mi.markers[0].fechaAlta ? new Date(mi.markers[0].fechaAlta).toISOString().split('T')[0] : null },
                { key: this.$t("{fechaFinFondeoInfo}"), value: mi.markers[0].fechaFin ? new Date(mi.markers[0].fechaFin).toISOString().split('T')[0] : null },
                { key: this.$t("{tipoSensorInfo}"), value: mi.markers[0].tipoSensor },
                { key: this.$t("{modeloEstacionInfo}"), value: mi.markers[0].modelo },
                { key: this.$t("{comentariosEstacionInfo}"), value: mi.markers[0].comentarios },
                { key: this.$t("{conjuntoDatosInfo}"), value: red.data.descripcion, bold: true, href: INFORMES_URL + 'BD/informes/INT_'	+ red.data.id + '.pdf' }
              ];
          })
        }
        var mi = this;
        ApiService.get('parametros/' + this.markers[0].mapOption.variableType + '?locale=' + this.$getLocale())
        .then((params) => {
          mi.bancoDatos = params.data;
        })

    },

    onHidden (evt) {
       MapState.markersSelected = [];
    }
  }
};
</script>

<style scoped>
.infoPanelClass {
  font-size: 12px;
}
</style>
