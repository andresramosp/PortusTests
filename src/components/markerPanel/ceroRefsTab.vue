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
        <b-row v-if="infoCero">
           <b-col  md="auto">
            <label class="infoCero">
              {{infoCero}}
            </label>
          </b-col>
        </b-row>
        <b-row style="margin-top: 10px">
          <b-col md="auto">
            <b-button size="sm" variant="outline-primary" @click="openInformeNivelacion()">
              Informe nivelación
             </b-button>
          </b-col >
          <b-col md="auto">
            <b-button size="sm" variant="outline-primary" @click="openEsquemaDatum()">
              Esquema Datum
             </b-button>
          </b-col>
          <b-col md="auto">
            <b-button size="sm" variant="outline-primary" @click="openDefiniciones()">
              Definiciones
             </b-button>
          </b-col>
        </b-row>
</b-container>

</template>

<script>

import { MarkerClass } from "@/common/enums";
import ApiService from "@/services/api.service";
import { INFORMES_URL, BASE_URL_PORTUS } from '@/common/config';

export default {
  name: "ceroRefsTab",
  props: {
    mareografo: { type: Object, default: null, required: false }
  },
  data() {
    return {
      mareografoDetalle: null,
      imgUrl: null,
      informacion: [],
      infoCero: null
    };
  },
  mounted() {
  },
  created() {

       var cr = this;
       ApiService.get('mareografoDetalle/' + this.mareografo.id + '?locale=' + this.$getLocale())
       .then((result) => {
           cr.mareografoDetalle = result.data;
           cr.informacion = [
              { key: 'Clavo de Referencia', value: this.mareografoDetalle.clavoRef + (this.mareografoDetalle.ubicacion ? ('. ' + this.mareografoDetalle.ubicacion) : '') },
              { key: 'Cero ' + cr.mareografo.red.descripcion, value: this.mareografoDetalle.ceroRedmar },
              { key: 'Cota', value: this.mareografoDetalle.cotaCero.toFixed(2) + ' m. bajo Clavo de Referencia' }
            ];
          if (this.mareografoDetalle.diffRedmarNacional) {
            this.infoCero = 'Para referir al cero geodésico nacional (IGN): nivel ' 
            + (this.mareografoDetalle.diffRedmarNacional < 0 ? '+ ' : '- ') 
            + Math.abs(this.mareografoDetalle.diffRedmarNacional).toFixed(3);
          }
          else if (this.mareografoDetalle.diffRedmarHidrografico) {
            this.infoCero = 'Para referir al cero hidrográfico: nivel ' 
            + (this.mareografoDetalle.diffRedmarHidrografico < 0 ? '+ ' : '- ') 
            + Math.abs(this.mareografoDetalle.diffRedmarHidrografico).toFixed(3);
          }
          else if (this.mareografoDetalle.diffRedmarElipsoidal) {
            this.infoCero = 'Para referir al elipsoide (WGS84): nivel ' 
            + (this.mareografoDetalle.diffRedmarElipsoidal < 0 ? '+ ' : '- ') 
            + Math.abs(this.mareografoDetalle.diffRedmarElipsoidal).toFixed(3);
          }

       });

      this.imgUrl = BASE_URL_PORTUS + 'img/imgmareografos/' + this.mareografo.id + '.png';

  },
  methods: {
    openInformeNivelacion() {
      window.open(BASE_URL_PORTUS + 'pdf/nivelacion/' + this.mareografo.id + '.pdf', '_blank');
    },
    openEsquemaDatum() {
      window.open(BASE_URL_PORTUS + 'pdf/datums/' + this.mareografo.id + '.pdf', '_blank');
    },
    openDefiniciones() {
      window.open(BASE_URL_PORTUS + 'pdf/referencias/Descripcion_Referencia_NivelDelMar_es.pdf', '_blank');
    }
  }
};



</script>

<style scoped>

.infoPanelClass {
  font-size: 12px;
}

.infoCero {
  border-radius: 5px;
  border: 1px solid;
  padding: 10px;
  background-color: #f8f8f8;
  font-weight: 600;
}

</style>


