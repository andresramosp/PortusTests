<template>
<b-modal v-model="modalShow" v-if="marker" size="lg" :title="markerModel.ModalTitle">
    <b-tabs class='infoPanelClass' >
        <b-tab title="Acceso a datos" active v-if="markerModel.BancoDatos">
            <b-container style="margin-top: 15px">
                <b-row v-for="data in markerModel.BancoDatos" :key="data.key">
                    <b-col>{{data.key}}</b-col><b-col>{{data.value}}</b-col>
                </b-row>
            </b-container>
        </b-tab>
        <b-tab title="Informacion" v-if="markerModel.Informacion">
           <b-container style="margin-top: 15px">
               <b-row>
                   <b-col cols="8">
                       <b-row v-for="data in markerModel.Informacion" :key="data.key" v-if="data.value">
                          <b-col cols="3">{{data.key}}</b-col><b-col>{{data.value}}</b-col>
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

export default {
  name: "MarkerInfoPanel",
  props: {
    marker: { type: Object, default: null, required: false }
  },
  data() {
    return {
      modalShow: false
    };
  },
  watch: {
    marker: function() {
      this.modalShow = true;
    }
  },
  computed: {
    // Unificar mejor
    markerModel() {
      if (this.marker.mapResource.markerClass == MarkerClass.UBICACION) {
        return {
          ModalTitle: this.marker.tipoUbicacion + ": " + this.marker.nombre,
          Informacion: [
            { key: "Longitud", value: this.marker.longitud.toFixed(2) + " O" },
            { key: "Latitud", value: this.marker.latitud.toFixed(2) + " N" },
            { key: "Código modelo", value: this.marker.codigoModelo },
            { key: "Verificación", value: this.marker.mareografo } // Mirar
          ],
          BancoDatos: []
        };
      }
      else if (this.marker.mapResource.markerClass == MarkerClass.PUNTO_MALLA) {
         return {
          ModalTitle: "Pred. " + this.marker.mapOption.name + ": " + (this.marker.nombre ? this.marker.nombre : " Lat " + this.marker.latitud.toFixed(2) + " N" + ": Lon " + this.marker.longitud.toFixed(2) + " O"),
          Informacion: [
            { key: "Longitud", value: this.marker.longitud.toFixed(2) + " O" },
            { key: "Latitud", value: this.marker.latitud.toFixed(2) + " N" },
            { key: "Código modelo", value: this.marker.id },
            { key: "Cadencia", value: (this.marker.tdelta * 60) + ' Minutos'  },
            { key: "Malla", value: this.marker.malla },
            // { key: "Verificación", value: this.marker.mareografo } // ?
          ],
          BancoDatos: []
        };
      }
      else if (this.marker.mapResource.markerClass == MarkerClass.ESTACION) {
         return {
          ModalTitle: this.marker.nombre,
          Informacion: [
            { key: "Longitud", value: this.marker.longitud.toFixed(2) + " O" },
            { key: "Latitud", value: this.marker.latitud.toFixed(2) + " N" },
            { key: "Código", value: this.marker.id },
            { key: "Cadencia", value: this.marker.cadencia + ' Minutos'  },
            // ...
          ],
          BancoDatos: []
        };
      }
    },
    imgUrl() {
      //"https://maps.googleapis.com/maps/api/staticmap?zoom=5&size=160x140&maptype=satellite&markers=color:red%7Clabel:%7C" + this.marker.latitud + "," + this.marker.latitud + "&sensor=false&key=" + GOOGLE_API_KEY;
      return require("@/assets/markers/markerImg.png");
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped>
.infoPanelClass {
  font-size: 12px;
}
</style>
