<template>
  <div>
    <div class="row rowData">
      <div class="col-md-5" style="font-weight: 700; font-size: 13px">{{markerModel.Title}}</div><div class="col-md-7" style="text-align: right; color: blue">{{ $t('{mensajeMasInformacion}') }}</div>
    </div>
  <div v-if="notAvailable">
      <div class="row rowData">
        <div class="col-md-12">{{ marker.incidencia }}</div>
      </div>
    </div>
    <div v-else-if="markerModel.TiempoReal.length > 0" style="width:450px">
      <div class="row rowData" >
        <div class="col-md-6">{{ $t('{fechaTiempoReal}') }}</div><div class="col-md-6" style="text-align: right; font-weight: 700">{{markerModel.Date}}</div>
      </div>
      <div v-if="markerModel.Position" class="row rowData">
        <div class="col-md-6">{{ $t('{posicionBoyaTiempoReal}') }}</div><div class="col-md-6" style="text-align: right">{{markerModel.Position}}</div>
      </div>
      <div style="margin-bottom: 20px;"></div>
      <div  v-for="(data, index) in markerModel.TiempoReal" :key="data.nombreParametro" class="row rowData" :class="{ 'whiteBG': index % 2 != 0, 'grayBG': index % 2 == 0 }">
        <div class="col-md-6">{{data.nombreParametro}}</div>
        <div class="col-md-6" style="text-align: right" :class="{ 'paramQC': data.paramQC }">{{formatParamValue(data)}}</div>
      </div>
    </div>
    <div v-else>
      <div class="row rowData">
        <div class="col-md-12">{{ $t('{sinDatosRecientes}') }}</div>
      </div>
    </div>
  </div>

</template>



<script>

import MapUtils from "@/services/map.utils";
import { RedType } from "@/common/enums";

export default {
  name: "LastDataPopup",
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
        dateValue = tiempoReal.fecha ? tiempoReal.fecha.slice(0, 19) + " GMT" : "";
        // dateValue = tiempoReal.fecha;
        // dateValue = new Date(dateValue);
        // dateValue = dateValue.toISOString().slice(0, 19).replace("T", " ") + " GMT";
        var lastPositions = tiempoReal.datos.filter(tr => { return tr.nombreParametro == "Latitud" || tr.nombreParametro == "Longitud";});
        if (lastPositions.length > 0) {
          var latValue = parseFloat(lastPositions.find(lp => { return lp.nombreParametro == "Latitud"; }).valor).toFixed(2);
          var lonValue = parseFloat(lastPositions.find(lp => { return lp.nombreParametro == "Longitud"; }).valor).toFixed(2);
          var lastPositionValue = MapUtils.latLonToString(latValue, lonValue).replace(',', '');
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
.rowData {
  width: 450px;
}

.whiteBG {
  background-color: white;
}

.grayBG {
  background-color: #f8f8f8;
}

.paramQC {
  color: red;
}

.infoPanelClass {
  font-size: 12px;
}
</style>
