<template>
  <div>
    <div class="row rowData">
      <div class="col-md-5" style="font-weight: 700; font-size: 13px">{{markerModel.Title}}</div><div class="col-md-7" style="text-align: right; color: blue">{{moreInfoTag}}</div>
    </div>
    <div v-if="markerModel.TiempoReal.length > 0" style="width:450px">
      <div class="row rowData" >
        <div class="col-md-6">{{dateTag}}</div><div class="col-md-6" style="text-align: right; font-weight: 700">{{markerModel.Date}}</div>
      </div>
      <div v-if="markerModel.LastPosition" class="row rowData">
        <div class="col-md-6">{{lastPositionTag}}</div><div class="col-md-6" style="text-align: right">{{markerModel.LastPosition}}</div>
      </div>
      <div style="margin-bottom: 20px;"></div>
      <div class="row rowData" :class="{ 'whiteBG': index % 2 != 0, 'grayBG': index % 2 == 0 }" v-for="(data, index) in markerModel.TiempoReal" :key="data.key">
        <div class="col-md-6">{{data.key}}</div>
        <div class="col-md-6" style="text-align: right">{{data.value}}</div>
      </div>
    </div>
    <div v-else-if="notAvailable">
      <div class="row rowData">
        <div class="col-md-12">{{notAvailableTag}}</div>
      </div>
    </div>
    <div v-else>
      <div class="row rowData">
        <div class="col-md-12">{{emptyTag}}</div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "LastDataPopup",
  data() {
    return {
      dateTag: "Hora del último dato", // Diccionario
      emptyTag: "No hay datos recientes",
      moreInfoTag: "click en icono para acceso a datos",
      lastPositionTag: "Última posición",
      notAvailableTag: "Estación temporalmente fuera de servicio"
    };
  },
  props: {
    marker: { type: Object, default: null, required: false },
    data: { type: Object, default: null, required: false }
  },
  computed: {
    notAvailable() {
      return (1 <= this.marker.estado && this.marker.estado <= 2);
    },
    markerModel() {
      var dateValue;
      var lastPositionValue;
      var tiempoReal = Object.keys(this.data).map(k => {
        return { key: k, value: this.data[k] };
      });
      if (tiempoReal.length > 0) {
        dateValue = tiempoReal.find(tr => { return tr.key == "Fecha"; }).value;
        dateValue = new Date(dateValue);
        dateValue = dateValue.toISOString().slice(0, 19).replace("T", " ") + " GMT";
        var lastPositions = tiempoReal.filter(tr => { return tr.key == "Latitud" || tr.key == "Longitud"; });
        if (lastPositions.length > 0) {
          var latValue = parseFloat(lastPositions.find(lp => { return lp.key == "Latitud"}).value).toFixed(2);
          var lonValue = parseFloat(lastPositions.find(lp => { return lp.key == "Longitud"}).value).toFixed(2);
          var lastPositionValue = "Lat " + Math.abs(latValue) + "º " + (latValue >= 0 ? 'N' : 'S') + " Lon " + Math.abs(lonValue) + "º " + (lonValue >= 0 ? 'E' : 'O');
        }
        tiempoReal = tiempoReal.filter(tr => { return tr.key != "Fecha" && tr.key != "Latitud" && tr.key != "Longitud";});

      }
      return {
        Title: this.marker.nombre,
        Date: dateValue,
        LastPosition: lastPositionValue,
        TiempoReal: tiempoReal
      };
    }
  },
  mounted() {},
  methods: {}
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

.infoPanelClass {
  font-size: 12px;
}
</style>
