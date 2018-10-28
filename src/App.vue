<template>
<div id="app" >
   <Map :baseMap='baseMap' :mapResources='mapResources' :mapOptions='mapOptions' >
   </Map>
</div>
</template>

<script>

import Map from "./components/map.vue";
import { MapResources, MapOptions } from '@/common/mapResourceManager';

export default {
  name: "app",
  components: {
    Map
  },
  data () {
    return {
      mapResources: [],
      mapOptions: [],
      baseMap: null
    }    
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

    this.mapResources = MapResources;
    this.mapOptions = MapOptions.filter(opt => { return PC.map_options.length == 0 || PC.map_options.indexOf(opt.id) != -1});
      
  }
};
</script>

<style scoped>

#app { height: 100%;}
 
</style>


