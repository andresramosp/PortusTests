<template>
<div id="app" >
   <Map :baseMap='baseMap' :mapFixed="mapFixed" />
   <LayersPanel :mapOptionsGroups="mapOptionsGroups" :mapOptions="mapOptions" /> 
   <MarkerPanel :markers='mapState.markersSelected' />
   <StaticMapsPanel :mapResource='mapState.staticMapResourceSelected' />
   <UbicacionesPanelJQ />
</div>
</template>

<script>

import Map from "@/components/map.vue";
import MapState from "@/state/map.state";
import LayersPanel from "@/components/layersPanel.vue";
import MarkerPanel from "@/components/markerPanel/markerPanel.vue";
import StaticMapsPanel from "@/components/staticMapsPanel.vue";
import UbicacionesPanelJQ from "@/components/ubicacionesPanelJQ.vue";
import { MapOptions } from '@/common/mapResourceManager';
import { MapOptionsGroups } from '@/common/mapResourceManager';

export default {
  name: "app",
  components: {
    Map,
    LayersPanel,
    MarkerPanel,
    StaticMapsPanel,
    UbicacionesPanelJQ
  },
  data () {
    return {
      mapState: MapState,
      mapOptions: [],
      mapOptionsGroups: MapOptionsGroups,
      baseMap: null,
      mapFixed: PC.map_fixed,
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


