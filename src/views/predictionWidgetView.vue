<template>
<div id="app" >
   <Map :baseMap='baseMap' :mapFixed="true" :isWidget="true" />
</div>
</template>

<script>

import Map from "@/components/map.vue";
import MapState from "@/state/map.state";

export default {
  name: "PredictionWidgetView",
  components: {
    Map
  },
  data () {
    return {
      mapState: MapState,
      baseMap: null
    }    
  },
  created() {
    this.$setLocale(this.$route.query.locale ? this.$route.query.locale : 'es');
  },
  mounted () {
    this.baseMap = L.tileLayer(
      PC.base_layer,
      {
        minZoom: PC.base_layer_min_zoom,
        maxZoom: PC.base_layer_max_zoom,
        tms: false
      }
    );

    MapState.playerMinimized = true;

    var resourceId = this.$route.query.resourceId;
    var predictionResource = MapState.getMapResource('pred-tiles-' + resourceId);
    predictionResource.defaultVectors =  this.$route.query.vec == 'true';
    predictionResource.comboSelect = null;
    MapState.addTimeLineLayer(predictionResource);
    
    var zoom = this.$route.query.zoom;
    var lat = this.$route.query.lat;
    var lon = this.$route.query.lon;
    MapState.getMap().setView(L.latLng(lat, lon), zoom);

  }
};
</script>

<style>

#app { height: 100%;}

/* .leaflet-bottom {
  padding-left: 45%;
} */
 
</style>


