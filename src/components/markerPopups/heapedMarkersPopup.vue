<template>
  <b-card header-tag="header">
    <b-card-header class="tiempo_real" header-tag="header">
        {{ $t('{markersProximosTitulo}') }}
        <img :src='require("@/assets/icons/x.png")' class="closeIcon" @click="cerrar">
    </b-card-header>
    <b-container>
      <div class="row">
        <div class="col-md-12 alertText" style="text-align: right">
          {{ $t('{markersProximosText}') }}
        </div>
      </div>
      <br>
      <div class="row rowData" v-for="marker in markers" :key="marker.id">
        <div class="col-md-12">
          <a @click="$emit('marker-item-clicked', marker)" class="heapedMarker">{{marker.nombre}}</a>
        </div>
      </div>
    </b-container>
  </b-card>
</template>



<script>

import MapState from "@/state/map.state";

export default {
  name: "HeapedMarkersPopup",
  data() {
    return {
      popUp : null
    };
  },
  props: {
    markerHovered: { type: Object, default: null },
    markers: { type: Array, default: null, required: false }
  },
  mounted() {
    var popup = L.popup({ maxWidth: 500 })
    .setLatLng(this.markerHovered.getLatLng())
    .setContent(this.$el);
    MapState.setHeapedPopup(popup);
  },
  methods: {
    cerrar() {
      MapState.closeHeapedPopup();
    }
  }
};
</script>

<style scoped>
.rowData {
  width: 450px;
}

.infoPanelClass {
  font-size: 12px;
}



.card {
  background-color: transparent;
  border: none;
}

.card-body {
  padding: 0px;
}


.rowDataTable {
  padding-top: 1.5px;
  padding-bottom: 1.5px;
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


.infoPanelClass {
  font-size: 12px;
}
</style>
