<template>
  <b-card header-tag="header">
    <b-container>
      <div class="row">
        <span class="alertText">
          {{ toolTipText.split(':')[0] }}:&nbsp;&nbsp;
        </span>
        <span>
          {{ toolTipText.split(':')[1] }} 
        </span>
      </div>
    </b-container>
  </b-card>
</template>

<script>

import { MarkerClass } from "@/common/enums";
import MapService from "@/services/map.service";
import MapState from "@/state/map.state";

export default {
  name: "SimpleMarkerPopup",
  data() {
    return {
      popUp : null
    };
  },
  props: {
    marker: { type: Object, default: null }
  },
  computed: {
    toolTipText: function(){
       var value = "";
       switch (this.marker.mapResource.markerClass) {
        case MarkerClass.Ubicacion:
          value = this.$t("{tipoUbicacion" + this.marker.tipoUbicacion+"}") + ": " + this.marker.nombre;
          break;
        case MarkerClass.PuntoMalla:
          value =  "Pred. " + this.$t(this.marker.mapOption.name) + ": " + MapService.getMarkerName(this.marker);
          break;
        case MarkerClass.PuntoMallaVerif:
          value = this.$t("{verificacionInfo}") + ": " + this.marker.nombre;
          break;
        case MarkerClass.EstacionHist:
          value = this.$t("{estacionHistTooltip}") + ": " + this.marker.nombre;
          break;
        case MarkerClass.PuntoMallaHist:
          value = this.$t("{estacionHistTooltip}") + ": " + this.$t("{puntoSimarLabel}") + ": (" + this.marker.id + ")";
          break;
        case MarkerClass.AntenaRadar:
          value = this.marker.radar.nombre + ": " + this.marker.nombre;
          break;
      }
      return value;
    }
  },
  mounted() {

    
    var popup = L.popup({ maxWidth: 500 })
    .setLatLng(this.marker.getLatLng())
    .setContent(this.$el);

    popup.openOn(MapState.getMap());
    
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


.leaflet-popup-content-wrapper {
  padding: 0px;
}

.container {
    padding-bottom: 10px;
    padding-left: 3px;
    padding-right: 3px;
    padding-top: 8px;
  }

.row {
    margin-left: 5px;
    margin-right: 5px;
 }

</style>
