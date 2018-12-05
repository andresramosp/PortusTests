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
        <!-- <b-row v-if="hasPeriodosFondeo()" style="margin-top: 10px">
          <b-col>
            <b-button size="sm" variant="outline-primary" @click="openPeriodosFondeo()">
              Períodos de fondeo
             </b-button>
          </b-col>
        </b-row> -->
</b-container>

</template>

<script>

import { MarkerClass } from "@/common/enums";
import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import { INFORMES_URL, BASE_URL_PORTUS, STATIC_URL } from '@/common/config';

export default {
  name: "ceroRefsTab",
  props: {
    mareografo: { type: Object, default: null, required: false }
  },
  data() {
    return {
      mapState: MapState,
      informacion: []
    };
  },
  computed: {
    imgUrl() {
      return '';
      }
  },
  mounted() {
  },
  created() {

      // this.informacion = [
      //           { key: this.$t("{longitudInfo}"), value: this.markers[0].longitud.toFixed(2) + " O" },
      //           { key: this.$t("{latitudInfo}"), value: this.markers[0].latitud.toFixed(2) + " N" },
      //           { key: this.$t("{codigoModeloInfo}"), value: this.markers[0].codigoModelo },
      //           { key: this.$t("{verificacionInfo}"), value: this.markers[0].mareografo } // Mirar
      //         ];

  },
  methods: {
    hasPeriodosFondeo() {
      return this.markers[0].mapResource.markerClass == MarkerClass.ESTACION_HISTORICO
          && this.markers[0].red.tipoRed == "REDEXT";
    },
    openPeriodosFondeo() {
      window.open(STATIC_URL + 'pdf/pfondeo/' + this.markers[0].id + '.pdf', '_blank');
    }
  }
};



</script>

<style scoped>

.infoPanelClass {
  font-size: 12px;
}
</style>


