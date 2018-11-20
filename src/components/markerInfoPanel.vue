<template>
<b-modal v-model="modalShow" v-if="markerModel" @hidden="onHidden" size="lg" :title="markerModel.ModalTitle">
    <b-tabs class='infoPanelClass' >
        <b-tab :title="$t('{accesoADatosTab}')" active v-if="markerModel.BancoDatos">
            <b-container style="margin-top: 15px">
                <b-row v-for="data in markerModel.BancoDatos" :key="data.key">
                    <b-col>{{data.key}}</b-col>
                    <b-col>{{data.value}}</b-col>
                </b-row>
            </b-container>
        </b-tab>
        <b-tab :title="$t('{informacionTab}')" v-if="markerModel.Informacion">
           <b-container style="margin-top: 15px">
               <b-row>
                   <b-col cols="8">
                       <b-row v-for="data in markerModel.Informacion" :key="data.key" v-if="data.value">
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
    marker: { type: Object, default: null, required: false }
  },
  data() {
    return {
      modalShow: false,
      markerModel: null
    };
  },
  watch: {
    marker: function() {
      if (this.marker) {
          if (this.marker.mapResource.markerClass == MarkerClass.UBICACION) {
            this.markerModel = {
              ModalTitle: this.$t("{tipoUbicacion"+this.marker.tipoUbicacion+"}") + ": " + this.marker.nombre,
              Informacion: [
                { key: this.$t("{longitudInfo}"), value: this.marker.longitud.toFixed(2) + " O" },
                { key: this.$t("{latitudInfo}"), value: this.marker.latitud.toFixed(2) + " N" },
                { key: this.$t("{codigoModeloInfo}"), value: this.marker.codigoModelo },
                { key: this.$t("{verificacionInfo}"), value: this.marker.mareografo } // Mirar
              ],
              BancoDatos: []
            };
          }
        else if (this.marker.mapResource.markerClass == MarkerClass.PUNTO_MALLA) {
          this.markerModel = {
            ModalTitle: "Pred. " +  this.$t(this.marker.mapOption.name) + ": " + (this.marker.nombre ? this.marker.nombre : " Lat " + this.marker.latitud.toFixed(2) + " N" + ": Lon " + this.marker.longitud.toFixed(2) + " O"),
            Informacion: [
              { key: this.$t("{longitudInfo}"), value: this.marker.longitud.toFixed(2) + " O" },
              { key: this.$t("{latitudInfo}"), value: this.marker.latitud.toFixed(2) + " N" },
              { key: this.$t("{codigoModeloInfo}"), value: this.marker.id },
              { key: this.$t("{cadencyInfo}"), value: (this.marker.tdelta * 60) + ' min'  },
              { key: this.$t("{mallaInfo}"), value: this.marker.malla },
              // { key: "Verificación", value: this.marker.mareografo } // ?
            ],
            BancoDatos: []
          };
        }
        else if (this.marker.mapResource.markerClass == MarkerClass.PUNTO_MALLA_VERIF) {
          this.markerModel = {
            ModalTitle: this.$t("{verificacionInfo}") + ": " + this.marker.nombre,
            Informacion: [
              { key: this.$t("{longitudInfo}"), value: this.marker.longitud.toFixed(2) + " O" },
              { key: this.$t("{latitudInfo}"), value: this.marker.latitud.toFixed(2) + " N" },
              { key:  this.$t("{codigoModeloInfo}"), value: this.marker.id },
              { key: this.$t("{cadencyInfo}"), value: (this.marker.tdelta * 60) + ' min'  }
            ],
            BancoDatos: []
          };
        }
        else if (this.marker.mapResource.markerClass == MarkerClass.ESTACION || this.marker.mapResource.markerClass == MarkerClass.ESTACION_HISTORICO) {
          var mi = this;
          ApiService.get('redes/' + this.marker.redId + '?locale=' + this.$getLocale())
          .then((red) => {
            mi.markerModel = {
              ModalTitle: mi.marker.nombre,
              Informacion: [
                { key: this.$t("{longitudInfo}"), value: mi.marker.longitud.toFixed(2) + " O" },
                { key: this.$t("{latitudInfo}"), value: mi.marker.latitud.toFixed(2) + " N" },
                { key: this.$t("{cadencyInfo}"), value: mi.marker.cadencia + ' Min'  },
                { key: this.$t("{codigoEstacionInfo}"), value: mi.marker.id },
                { key: this.$t("{profundidadEstacionInfo}"), value: mi.marker.altitudProfundidad + ' m' },
                { key: this.$t("{fechaInicialFondeoInfo}"), value: mi.marker.fechaAlta ? new Date(mi.marker.fechaAlta).toISOString().split('T')[0] : null },
                { key: this.$t("{fechaFinFondeoInfo}"), value: mi.marker.fechaFin ? new Date(mi.marker.fechaFin).toISOString().split('T')[0] : null },
                { key: this.$t("{tipoSensorInfo}"), value: mi.marker.tipoSensor },
                { key: this.$t("{modeloEstacionInfo}"), value: mi.marker.modelo },
                { key: this.$t("{comentariosEstacionInfo}"), value: mi.marker.comentarios },
                { key: this.$t("{conjuntoDatosInfo}"), value: red.data.descripcion, bold: true, href: INFORMES_URL + 'BD/informes/INT_'	+ red.data.id + '.pdf' }
              ],
              BancoDatos: []
          };
          })
           //   this.markerModel = {
          //     ModalTitle: this.marker.nombre,
          //     Informacion: [
          //       { key: "Longitud", value: this.marker.longitud.toFixed(2) + " O" },
          //       { key: "Latitud", value: this.marker.latitud.toFixed(2) + " N" },
          //       { key: "Código", value: this.marker.id },
          //       { key: "Cadencia", value: this.marker.cadencia + ' Minutos'  },
          //       { key: "Profundidad", value: this.marker.altitudProfundidad + ' m' },
          //       { key: "Fecha inicial de fondeo", value: this.marker.fechaAlta },
          //       { key: "Tipo de sensor", value: this.marker.tipoSensor },
          //       { key: "Modelo", value: this.marker.modelo },
          //       { key: "Conjunto de datos", value: this.marker.red.descripcion, bold: true, href: 'www.elpais.es' }
          //     ],
          //     BancoDatos: []
          // };
        }
        this.modalShow = true;
      }
    }
  },
  computed: {
    imgUrl() {
        //"https://maps.googleapis.com/maps/api/staticmap?zoom=5&size=160x140&maptype=satellite&markers=color:red%7Clabel:%7C" + this.marker.latitud + "," + this.marker.latitud + "&sensor=false&key=" + GOOGLE_API_KEY;
        return require("@/assets/markers/markerImg.png");
      }
    },
  mounted() {
  },
  created() {
  },
  methods: {
    onHidden (evt) {
       MapState.markerSelected = null;
    }
  }
};
</script>

<style scoped>
.infoPanelClass {
  font-size: 12px;
}
</style>
