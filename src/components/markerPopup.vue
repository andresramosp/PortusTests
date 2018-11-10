<template>
  <div v-if="markerModel.TiempoReal.length > 0" style="margin-top: 15px; width:400px">
    <div class="row rowData">
      <div class="col-md-6">{{dateTag}}</div><div class="col-md-6" style="text-align: right">{{markerModel.DateValue}}</div>
    </div>
    <div class="row rowData" :class="{ 'whiteBG': index % 2 != 0, 'grayBG': index % 2 == 0 }" v-for="(data, index) in markerModel.TiempoReal" :key="data.key">
      <div class="col-md-6">{{data.key}}</div>
      <div class="col-md-6" style="text-align: right">{{data.value}}</div>
    </div>
  </div>
</template>

<script>

import { MarkerClass } from "@/common/enums";

export default {
  name: "MarkerPopup",
  data () {
    return {
      dateTag: "Fecha último dato" // Diccionario
    }
  },
  props: {
    marker: { type: Object, default: null, required: false },
    data: { type: Object, default: null, required: false }
  },
  computed: {
    markerModel() {
      if (this.marker.mapResource.markerClass == MarkerClass.UBICACION) {
        
      }
      else if (this.marker.mapResource.markerClass == MarkerClass.PUNTO_MALLA) {
         
      }
      else if (this.marker.mapResource.markerClass == MarkerClass.PUNTO_MALLA_VERIF) {
        
      }
      else if (this.marker.mapResource.markerClass == MarkerClass.ESTACION) {
         var tiempoReal = Object.keys(this.data).map(k => {
            return { key: k, value: this.data[k] }
         });
         var dateValue = tiempoReal.find(tr => { return tr.key == "Fecha"}).value;
         tiempoReal = tiempoReal.filter(tr => { return tr.key != "Fecha" });
         return {
          ModalTitle: this.marker.nombre,
          DateValue: dateValue,
          TiempoReal: tiempoReal
        };
      }
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped>

.rowData {
  width: 400px;
}

.whiteBG {
  background-color: white;
}

.grayBG {
  background-color: #f8f8f8;
}

.infoPanelClass {
  font-size: 12px;
}
</style>
