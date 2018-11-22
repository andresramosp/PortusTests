<template>
<div id="app" >
   <Map :baseMap='baseMap' />
   <LayersPanel :mapOptions="mapOptions" /> 
   <MarkerInfoPanel :markers='mapState.markersSelected' />
   <StaticMapsPanel :mapResource='mapState.staticMapResourceSelected' />
</div>
</template>

<script>

import Map from "@/components/map.vue";
import MapState from "@/state/map.state";
import LayersPanel from "@/components/layersPanel.vue";
import MarkerInfoPanel from "@/components/markerInfoPanel.vue";
import StaticMapsPanel from "@/components/staticMapsPanel.vue";
import { MapOptions } from '@/common/mapResourceManager';

export default {
  name: "app",
  components: {
    Map,
    LayersPanel,
    MarkerInfoPanel,
    StaticMapsPanel
  },
  data () {
    return {
      mapState: MapState,
      mapOptions: [],
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
    this.mapOptions = MapOptions.filter(opt => { return PC.map_options.length == 0 || PC.map_options.indexOf(opt.id) != -1});  
  }
};
</script>

<style scoped>

#app { height: 100%;}
 
</style>


