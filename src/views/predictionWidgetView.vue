<template>
<div id="app" >
   <Map :baseMap='baseMap' :mapFixed="true" :isWidget="true" />
   <LogosList :logos="mapState.mapLogos" :defaultLogo="defaultLogo" />
</div>
</template>

<script>

import Map from "@/components/map.vue";
import MapState from "@/state/map.state";
import LogosList from "@/components/logosList.vue";

export default {
  name: "PredictionWidgetView",
  components: {
    Map,
    LogosList
  },
  data () {
    return {
      mapState: MapState,
      baseMap: null,
      defaultLogo: PC.default_map_logo
    }    
  },
  created() {
    this.$setLocale(this.$route.query.locale ? this.$route.query.locale : 'es');
    document.body.classList.add(this.$route.query.theme ? this.$route.query.theme : PC.default_theme);
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
    predictionResource.variableType = this.$route.query.var;
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

.leaflet-bottom {
  padding-left: 42%;
}
 
</style>


