<template>
  <div>
    <div class="row rowData">
      <div class="col-md-12" style="font-weight: 700; font-size: 13px">{{heapedPanelTitle}}</div>
    </div>
     <div class="row">
      <div class="col-md-12" style="font-weight: 700; font-size: 13px">{{heapedPanelText}}</div>
    </div>
    <br />
    <div class="row rowData" v-for="marker in markers" :key="marker.id">
      <div class="col-md-12" >
        <a @click="$emit('marker-item-clicked', marker)" class="heapedMarker" >{{marker.nombre}}</a>
      </div>
    </div>
  </div>
</template>

<script>

import MapState from "@/state/map.state";

export default {
  name: "HeapedMarkersPopup",
  data() {
    return {
      popUp : null,
      heapedPanelTitle: "Markers muy próximos",
      heapedPanelText: "Haga zoom para verlos o seleccione para acceso a datos."
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
    openMarkerInfoPanel: function(marker) {
      MapState.markerSelected = marker;
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

.infoPanelClass {
  font-size: 12px;
}

.heapedMarker {
  cursor: pointer; 
  /* text-decoration: underline !important;  */
  font-weight: 600; 
  color: blue !important;
}
</style>
