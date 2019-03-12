<template>
  <b-card header-tag="header">
      <b-card-header class="tiempo_real" header-tag="header">
            {{markerModel.Title}}
       </b-card-header>
    <b-container>
      <div class="row rowData">
        <div class="col-md-5"></div>
        <div
          class="col-md-7 alertText"
          style="text-align: right;"
        >{{ $t('{mensajeMasInformacion}') }}</div>
      </div>
      <div v-if="notAvailable">
        <div class="row rowData">
          <div class="col-md-12">{{ marker.incidencia }}</div>
        </div>
      </div>
      <div v-else-if="markerModel.TiempoReal.length > 0" style="width:450px">
        <div class="row rowData">
          <div class="col-md-6">{{ $t('{fechaTiempoReal}') }}</div>
          <div class="col-md-6" style="text-align: right; font-weight: 700">{{markerModel.Date}}</div>
        </div>
        <div v-if="markerModel.Position" class="row rowData">
          <div class="col-md-6">{{ $t('{posicionBoyaTiempoReal}') }}</div>
          <div class="col-md-6" style="text-align: right">{{markerModel.Position}}</div>
        </div>
        <div style="margin-bottom: 20px;"></div>
        <div
          v-for="(data, index) in markerModel.TiempoReal"
          :key="data.nombreParametro"
          class="row rowData rowDataTable"
          :class="{ 'whiteBG': index % 2 != 0, 'grayBG': index % 2 == 0 }"
        >
          <div class="col-md-8">
             <img style="float: left; margin-left: -3px; margin-right: 3px; margin-top: -4px; position: absolute" width="25" 
                    :title="$t('{' + data.variable + '}')"
                    :src='require("@/assets/icons/bancoDatos/" + data.variable.toLowerCase() + ".png")'>
            <span style="margin-left: 25px"> {{data.nombreParametro}} </span>
            </div>
          <div
            class="col-md-4"
            style="text-align: right"
            :class="{ 'paramQC': data.paramQC }"
          >{{formatParamValue(data)}}</div>
        </div>
      </div>
      <div v-else>
        <div class="row rowData">
          <div class="col-md-12">{{ $t('{sinDatosRecientes}') }}</div>
        </div>
      </div>
    </b-container>
  </b-card>
</template>



<script>

import MapService from "@/services/map.service";
import { RedType } from "@/common/enums";

export default {
  name: "RTDataPopup",
  data() {
    return {
    };
  },
  props: {
    marker: { type: Object, default: null, required: false },
    data: { type: Object, default: null, required: false },
    radarPoint: { type: Boolean, default: false, required: false }
  },
  computed: {
    notAvailable() {
      return (
        !this.radarPoint && (
          (1 <= this.marker.estado && this.marker.estado <= 2) ||
          (this.marker.red.tipoRed == RedType.PROPAGACION && this.marker.estado > 0)
        )
      );
      //return this.marker.incidencia != null;
    },
    markerModel() {
      var dateValue;
      var lastPositionValue;
      var tiempoReal = this.data;
      if (tiempoReal.datos.length > 0) {
        if (PC.isIE)
          dateValue = tiempoReal.fecha ? tiempoReal.fecha.slice(0, 19) + " GMT" : "";
        else 
          dateValue = tiempoReal.fecha ? MapService.getDateString(new Date(tiempoReal.fecha)) + " GMT" : ""; //new Date(tiempoReal.fecha).toLocaleString().replaceAll('/', '-') + " GMT" : "";
        var lastPositions = tiempoReal.datos.filter(tr => { return tr.nombreParametro == "Latitud" || tr.nombreParametro == "Longitud";});
        if (lastPositions.length > 0) {
          var latValue = parseFloat(lastPositions.find(lp => { return lp.nombreParametro == "Latitud"; }).valor).toFixed(2);
          var lonValue = parseFloat(lastPositions.find(lp => { return lp.nombreParametro == "Longitud"; }).valor).toFixed(2);
          var lastPositionValue = MapService.latLonToString(latValue, lonValue).replace(',', '');
        }
        tiempoReal = tiempoReal.datos.filter(tr => { return (tr.nombreParametro != "Latitud" && tr.nombreParametro != "Longitud" );});
      }
      var ld = this;
      return {
        Title: this.marker.nombre,
        Date: dateValue,
        Position: lastPositionValue,
        TiempoReal: tiempoReal
      };
    }
  },
  mounted() {},
  methods: {
    formatParamValue: function(lastDataResult) {
      var value = parseFloat(lastDataResult.valor) / lastDataResult.factor;
      return value.toFixed(2) + " (" + lastDataResult.unidad + ")";
    }
  }
};
</script>

<style scoped>

.card {
  background-color: transparent;
  border: none;
}

.card-body {
  padding: 0px;
}

.rowData {
  width: 450px;
}

.rowDataTable {
    padding-top: 3.5px;
    padding-bottom: 2.5px;
}

.leaflet-popup-content-wrapper {
  padding: 0px;
}

.container {
    padding-bottom: 15px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 5px;
  }

.row {
    margin-left: 5px;
    margin-right: 5px;
 }

.paramQC {
  color: red;
}

.infoPanelClass {
  font-size: 12px;
}
</style>
