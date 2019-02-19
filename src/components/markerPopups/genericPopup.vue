<template>
  <b-card header-tag="header">
    <b-container style="width: 340px">
        <div class="row"  style="font-size: 13px; float: left">
          <div>
            {{tooltipText}}
           </div>
        </div>
         <div class="row" style="float: right; margin-top: 7px">
          <div class="alertText" >
              {{ tooltipTip }}
          </div>
        </div>
      </b-container>
  </b-card>
</template>

<script>

import { MarkerClass } from "@/common/enums";
import MapService from "@/services/map.service";
import MapState from "@/state/map.state";

export default {
  name: "GenericPopup",
  data() {
    return {
    };
  },
  props: {
    tooltipText: { type: String, default: null },
    tooltipTip: { type: String },
    position: { type: Object },
    //width: { type: String, default: '300px' }
  },
  mounted() {
    var popup = L.popup({ maxWidth: 500 })
        .setLatLng(L.latLng(this.position.y, this.position.x))
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
   padding-bottom: 7px;
   padding-top: 7px;
}

.container {
    padding-left: 3px;
    padding-right: 3px;
  }


.leaflet-popup-content-wrapper {
  padding: 0px;
}



</style>
