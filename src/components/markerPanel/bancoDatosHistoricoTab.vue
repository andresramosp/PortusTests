<template>

    <b-container style="margin-top: 15px; max-height: 500px; overflow-y: scroll">
            <!-- INFORMES ANUALES -->
            <div v-if="informesAnualesOptions.length > 0" style="margin-bottom: 10px" class="fadeIn">
                <img :src="require('@/assets/icons/collapsible_blue.png')" :class="[informesCollapseModel ? 'invertedArrow': '']" class="collapseArrow" v-b-toggle="'collapseAnuales'" />
                <span v-b-toggle="'collapseAnuales'" style="font-size: 16px; cursor: pointer">Informes Anuales de todos los reportes de la estación</span>
                <b-collapse visible id="collapseAnuales" class="mt-2" v-model="informesCollapseModel">
                    <b-card id="accordionContent" >
                        <b-row style="margin-top: 10px">
                            <b-col cols="4">
                                <b-form-select v-model="informeAnualSelected" :options="informesAnualesOptions" class="mb-3">
                                    <template slot="first">
                                    </template>
                                </b-form-select>
                            </b-col>
                            <b-col cols="3">
                                <b-form-select v-model="annioSelected" :options="anniosOptions" class="mb-3" style="width: 80%">
                                    <template slot="first">
                                    </template>
                                </b-form-select>
                            </b-col>
                            <b-col>
                                <dx-button :text="$t('{descargarButton}')" width="80" height="35" type="default" @click="openInformeAnual" />
                            </b-col>
                        </b-row>
                    </b-card>
                </b-collapse>
            </div>
            <!-- INFORMES Y PRODUCTOS -->
            <div v-for="variable in variables" :key="variable.varGrp" style="margin-bottom: 10px;" class="fadeIn">
                <img :src="require('@/assets/icons/collapsible_blue.png')" width="30" :class="[variable.collapseModel ? 'invertedArrow': '']" class="collapseArrow" v-b-toggle="'collapse' + variable.varGrp" />
                <span v-b-toggle="'collapse' + variable.varGrp" style="font-size: 16px; cursor: pointer">{{$t('{' + variable.varGrp + '}')}}</span>
                <b-collapse visible :id="'collapse' + variable.varGrp" accordion="my-accordion" class="mt-2" v-model="variable.collapseModel">
                    <b-card id="accordionContent">
                        <div v-if="informesVariable.filter(i => i.variable == variable.varGrp).length > 0">
                            <span style="font-size: 14px;">{{$t('{informesClimaticosLabel}')}}</span> 
                            <b-row style="margin-top: 10px; margin-bottom: 10px">
                                <b-col v-for="informeVar in informesVariable" :key="informeVar.id" v-if="informeVar.variable == variable.varGrp" cols="3">
                                    <dx-button :text="informeVar.nombre" height="35" type="default" @click="openLink(informeVar.url)" />
                                </b-col>
                            </b-row>
                        </div>
                        <div v-if="productosVariable.filter(p => p.variable == variable.varGrp).length > 0">
                            <span style="font-size: 14px;">{{$t('{analisisInteractivosLabel}')}}</span> 
                            <b-row style="margin-top: 10px; margin-left: 10px">
                                <b-col v-for="productoVar in productosVariable" :key="productoVar.id" v-if="productoVar.variable == variable.varGrp" cols="6">
                                    <label class="form-check-label" style="font-size: 13px" >
                                        <img style="" width="16" :src="productoVar.active ? require('@/assets/icons/check_activo.png') : require('@/assets/icons/check_inactivo.png')" >
                                        <input class="form-check-input" style="display: none" type="checkbox" v-model="productoVar.active" @change="productoOptionChanged(productoVar)" />
                                        {{ $t(productoVar.nombre) }}
                                    </label>
                                </b-col>
                            </b-row>
                        </div>
                    </b-card>
                </b-collapse>
            </div>
            <div v-if="isInactiva()" style="text-align: center; font-size: 14px; color: red !important; font-weight: bold;">
                {{$t('{estacionHistInactivaLabel}')}}
            </div>
    </b-container>

</template>

<script>

import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import DataPanelsService from "@/services/dataPanels.service";
import { BANCO_DATOS_URL, BASE_URL_PORTUS, PUERTOS_URL } from '@/common/config';
import { RedType, MarkerClass } from "@/common/enums";
import DxButton from "devextreme-vue/button";

export default {
  name: "BancoDatosHistoricoTab",
  components: {
      DxButton
  },
  data() {
      return {
          mapState: MapState,
          informesVariable: [],
          productosVariable: [],
          variables: [],
          informesAnualesOptions: [],
          informeAnualSelected: null,
          anniosOptions: [],
          annioSelected: null,
          informesCollapseModel: true
          
      }
  },
  props: {
    markers: { type: Array, default: null, required: false }
  },
  computed: {
      contentLoaded() {
          return this.productosVariable.length > 0;
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
        this.variables = this.markers.map(m => { return { varGrp: m.mapOption.variableType, collapseModel: false } });
        this.variables[0].collapseModel = true;
        
        if (!this.isMeteorologica() && !this.isModelo()) {
            this.getInformesAnuales();
        }
        this.getInformes();
        this.getProductos();
      },
      isModelo() {
          return this.markers[0].mapResource.markerClass == MarkerClass.PuntoMallaHist;
      },
      isMeteorologica() {
          return this.markers[0].meteorologica;
      },
      isInactiva() {
          return this.markers[0].estado == 3;
      },
      openLink(url) {
          window.open(url,'targetWindow',
                                     'toolbar=no,'
                                   + 'location=no,'
                                   + 'status=no,'
                                   + 'menubar=no,'
                                   + 'scrollbars=yes,'
                                   + 'resizable=yes,'
                                   + 'width=650,'
                                   + 'height=' + screen.availHeight);
          
      },
      openInformeAnual() {
          var estacion = this.markers[0];
          var url = BANCO_DATOS_URL 
                    + '/BD/informes/anuales/' 
                    + estacion.redId + '/' 
                    + estacion.id 
                    + this.informeAnualSelected 
                    + this.annioSelected.toString().substr(2, 2) 
                    + '.pdf';
          this.openLink(url);
      },
      productoOptionChanged(productoOption) {
         DataPanelsService.setExternalGraph(this.markers[0], productoOption, productoOption.active);
      },
      getInformes() {
          var variables = this.markers.map(m => m.mapOption.variableType)
          var subruta = this.isModelo() ? 'modelo' : 'estacion';
          ApiService.post('informesHist/'+ subruta + '/' + this.markers[0].id + '?locale=' + this.$getLocale(), variables)
          .then((params) => {
            this.informesVariable = params.data;
          })
      },
      getProductos() {
          var variables = this.markers.map(m => m.mapOption.variableType)
          var subruta = this.isModelo() ? 'modelo' : 'estacion';
          ApiService.post('productosHist/'+ subruta + '/' + this.markers[0].id + '?locale=' + this.$getLocale(), variables)
          .then((params) => {
            this.setBancoDatos(params);
          })
         
      },
      getInformesAnuales() {
        var minYear, maxYear;
        var mi = this;
        if (this.markers[0].mareografo) {
            minYear = 2012; 
            maxYear = this.markers[0].estado != 3 ? 2016 : new Date(this.markers[0].fechaFin).getFullYear();
            this.informesAnualesOptions = [
                { value: 'N', text: 'Nivel'}
                ];
            this.informeAnualSelected = 'N';
        }
        else if (this.markers[0].red.tipoRed == RedType.REDCOS) {
                minYear = 1985 //; 2009;
                maxYear = !this.isInactiva() ? 2014 : new Date(this.markers[0].fechaFin).getFullYear();
                this.informesAnualesOptions = [
                    { value: 'O', text: 'Oleaje'}
                ];
                if (this.markers[0].modelo == "Triaxys")
                    this.informesAnualesOptions.push({ value: 'H', text: 'Temp. Agua'});
                this.informeAnualSelected = 'O';
        }
        else {
                minYear = 2012; 
                maxYear = !this.isInactiva() ? 2015 : new Date(this.markers[0].fechaFin).getFullYear();
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
        if (maxYear < minYear)
            maxYear = minYear;
        for (var i = minYear; i <= maxYear; i++) {
            this.anniosOptions.push(i);
        };
        this.annioSelected = this.anniosOptions[this.anniosOptions.length - 1];
      },

     // La lista de parámetros-checkboxes de cada marker la guardamos en un objeto
     // del global state (BancosDatos), para poder gestionar de forma coherente
     // la relación entre el estado del banco de datos  y cada tabla/gráfica abierta desde él,
     // así como mantener el estado de los checks en caso de una actualización (al añadir variables)

     setBancoDatos(params) {
         this.mapState.addBancoDatos(this.markers[0].id, params.data, true);
         this.productosVariable = this.mapState.getBancoDatos(this.markers[0].id, true).filter(p => this.markers.map(m => m.mapOption.variableType).indexOf(p.variable) != -1);
     }
  }
};

</script>

<style scoped>

.invertedArrow {
    transform: rotate(180deg);
}

.collapseArrow {
    width: 25px; 
    height: 25px; 
    cursor: pointer; 
    margin-right: 10px
}

</style>