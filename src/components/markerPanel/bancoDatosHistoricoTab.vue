<template>

    <b-container style="margin-top: 15px">
         <div style="margin-bottom: 10px">
                <span v-b-toggle="'collapseAnuales'" style="font-size: 16px; font-weight: bold; cursor: pointer">Informes Anuales de todos los reportes de la estación</span>
                <div >
                    <b-collapse visible id="collapseAnuales" class="mt-2">
                    
                    <b-row style="margin-top: 10px">
                        <b-col cols="3">
                              <b-form-select v-model="informeAnualSelected" :options="informesAnualesOptions" class="mb-3">
                                <template slot="first">
                                </template>
                            </b-form-select>
                        </b-col>
                        <b-col>
                            <b-button size="sm" variant="secundary" @click="openInformeAnual()">
                                Descargar
                            </b-button>
                        </b-col>
                    </b-row>
                    </b-collapse>
                </div>
            </div>
            <div v-for="varGrp in variables" :key="varGrp" style="margin-bottom: 10px">
                <span v-b-toggle="'collapse' + varGrp" style="font-size: 16px; font-weight: bold; cursor: pointer">{{varGrp}}</span>
                <div >
                    <b-collapse visible :id="'collapse' + varGrp" class="mt-2">
                    <span style="font-size: 14px; font-weight: bold;">{{$t('{informesClimaticosLabel}')}}</span> 
                    <b-row style="margin-top: 10px">
                        <b-col v-for="informeVar in informesVariable" :key="informeVar" v-if="informeVar.variable == varGrp" cols="3">
                            <b-button size="sm" variant="secundary" @click="openLink(informeVar.url)">
                                {{informeVar.nombre}}
                            </b-button>
                        </b-col>
                    </b-row>
                    </b-collapse>
                </div>
            </div>
    </b-container>

</template>

<script>

// TODO: - Combo años - IsRedCos (back) - Checkboxes gráficas - Caso Punto Malla

import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import { INFORMES_URL } from '@/common/config';

export default {
  name: "BancoDatosHistoricoTab",
  data() {
      return {
          informesVariable: [],
          variables: [],
          informesAnualesOptions: [],
          informeAnualSelected: null
      }
  },
  props: {
    markers: { type: Array, default: null, required: false }
  },
  mounted() {
  },
  created() {
       var mi = this;
       this.variables = this.markers.map(m => m.mapOption.variableType);
       ApiService.post('informesHist/' + this.markers[0].id + '?locale=' + this.$getLocale(), this.variables)
       .then((params) => {
           this.informesVariable = params.data;
       })
       if (this.markers[0].mareografo) {
           this.informesAnualesOptions = [
               { value: 'N', text: 'Nivel'}
            ];
           this.informeAnualSelected = 'N';
       }
       else if (this.markers[0].redCos) {
            this.informesAnualesOptions = [
               { value: 'O', text: 'Oleaje'},
               { value: 'T', text: 'Temp. Agua'}
            ];
            this.informeAnualSelected = 'O';
       }
       else {
            this.informesAnualesOptions = [
               { value: 'I', text: 'Introducción'}, 
               { value: 'R', text: 'Resumen Medidas'}, 
               { value: 'O', text: 'Oleaje'},
               { value: 'C', text: 'Corrientes'},
               { value: 'H', text: 'Hidrografía'},
               { value: 'M', text: 'Meteorología'}
            ];
            this.informeAnualSelected = 'I';
       }
  },
  methods: {
      openLink(url) {
          window.open(url, '_blank');
      },
      openInformeAnual() {
          var estacion = this.markers[0];
          var url = INFORMES_URL + '/BD/informes/anuales/' + estacion.redId + '/' + estacion.id + this.informeAnualSelected + '12' + '.pdf';
          this.openLink(url);
      }
  }
};

</script>