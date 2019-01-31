<template>

    <b-container style="margin-top: 15px; max-height: 500px; overflow-y: scroll">
            <b-row style="margin-bottom: 10px">
                <b-col col-md="12" offset-md="8">
                    <a :href="hrefPropietario" target='_blank'>
                        <img :src="imgPropietario"  />
                    </a>
                </b-col>
            </b-row>
            <!-- INFORMES ANUALES -->
            <div v-if="informesAnualesOptions.length > 0" style="margin-bottom: 10px">
                <img :src="require('@/assets/icons/collapsible.png')" class="collapseArrow" v-b-toggle="'collapseAnuales'" />
                <span v-b-toggle="'collapseAnuales'" style="font-size: 16px; cursor: pointer">Informes Anuales de todos los reportes de la estación</span>
                <b-collapse visible id="collapseAnuales" class="mt-2">
                    <b-card id="accordionContent" >
                        <b-row style="margin-top: 10px">
                            <b-col cols="3">
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
            <div v-for="varGrp in variables" :key="varGrp" style="margin-bottom: 10px;">
                <img :src="require('@/assets/icons/collapsible.png')" width="30" class="collapseArrow" v-b-toggle="'collapse' + varGrp" />
                <span v-b-toggle="'collapse' + varGrp" style="font-size: 16px; cursor: pointer">{{$t('{' + varGrp + '}')}}</span>
                <b-collapse visible :id="'collapse' + varGrp" accordion="my-accordion" class="mt-2">
                    <b-card id="accordionContent">
                        <div v-if="informesVariable.filter(i => i.variable == varGrp).length > 0">
                            <span style="font-size: 14px;">{{$t('{informesClimaticosLabel}')}}</span> 
                            <b-row style="margin-top: 10px; margin-bottom: 10px">
                                <b-col v-for="informeVar in informesVariable" :key="informeVar.id" v-if="informeVar.variable == varGrp" cols="3">
                                    <dx-button :text="informeVar.nombre" width="80" height="35" type="default" @click="openLink(informeVar.url)" />
                                </b-col>
                            </b-row>
                        </div>
                        <div v-if="productosVariable.filter(p => p.variable == varGrp).length > 0">
                            <span style="font-size: 14px;">{{$t('{analisisInteractivosLabel}')}}</span> 
                            <b-row style="margin-top: 10px; margin-left: 10px">
                                <b-col v-for="productoVar in productosVariable" :key="productoVar.id" v-if="productoVar.variable == varGrp" cols="6">
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
import { INFORMES_URL, BASE_URL_PORTUS, PUERTOS_URL } from '@/common/config';
import { RedType, MarkerClass } from "@/common/enums";
import DxButton from "devextreme-vue/button";

export default {
  name: "BancoDatosHistoricoTab",
  components: {
      DxButton
  },
  data() {
      return {
          informesVariable: [],
          productosVariable: [],
          variables: [],
          informesAnualesOptions: [],
          informeAnualSelected: null,
          anniosOptions: [],
          annioSelected: null,
          imgPropietario: null,
          hrefPropietario: null
      }
  },
  props: {
    markers: { type: Array, default: null, required: false }
  },
  mounted() {
  },
  created() {

    this.variables = this.markers.map(m => m.mapOption.variableType);
      
    if (!this.isMeteorologica() && !this.isModelo()) {
        this.getInformesAnuales();
    }
    this.getInformes();
    this.getProductos();

    if (this.markers[0].propietario != null) {
       this.imgPropietario = BASE_URL_PORTUS + "/img/logosOrganismos/" + this.markers[0].propietario + ".png";
       this.hrefPropietario = this.markers[0].urlPropietario;
    }
    else {
       this.imgPropietario = BASE_URL_PORTUS + "/img/logosOrganismos/0.png";
       this.hrefPropietario = PUERTOS_URL;
     }
  },
  methods: {
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
          window.open(url, '_blank');
      },
      openInformeAnual() {
          var estacion = this.markers[0];
          var url = INFORMES_URL 
                    + '/BD/informes/anuales/' 
                    + estacion.redId + '/' 
                    + estacion.id 
                    + this.informeAnualSelected 
                    + this.annioSelected.toString().substr(2, 2) 
                    + '.pdf';
          this.openLink(url);
      },
      productoOptionChanged(productoOption) {
         var estacion = this.markers[0];
         var url = INFORMES_URL + productoOption.url;
         this.openLink(url);
      },
      getInformes() {
          var subruta = this.isModelo() ? 'modelo' : 'estacion';
          ApiService.post('informesHist/'+ subruta + '/' + this.markers[0].id + '?locale=' + this.$getLocale(), this.variables)
          .then((params) => {
            this.informesVariable = params.data;
          })
      },
      getProductos() {
          var subruta = this.isModelo() ? 'modelo' : 'estacion';
          ApiService.post('productosHist/'+ subruta + '/' + this.markers[0].id + '?locale=' + this.$getLocale(), this.variables)
          .then((params) => {
            this.productosVariable = params.data;
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
                minYear = 2009;
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
      }
  }
};

</script>

<style scoped>

.collapseArrow {
    width: 25px; 
    height: 25px; 
    cursor: pointer; 
    margin-right: 10px
}

</style>