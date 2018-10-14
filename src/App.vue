<template>
<div id="app" >
   <Map :baseMap='baseMap' :layers='layers'>
   </Map>
</div>
</template>

<script>

import Map from "./components/Map.vue";
import LayersPanel from "./components/LayersPanel.vue";
import LayersService from "@/api/layers.service";

export default {
  name: "app",
  components: {
    Map,
    LayersPanel
  },
  data () {
    return {
      layers: [],
      baseMap: null
    }    
  },
  created () {
    LayersService.init();
  },
  mounted () {
    var options = {
        minZoom: 2,
        maxZoom: 12,
        attribution:
          'Rendered with <a href="http://www.maptiler.com/">MapTiler</a>',
        tms: false
      };

    this.baseMap = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options
    );

    this.layers = [
        { type: 'FeatureLayer', id: 0, name: 'Churches', resource: 'https://localhost:8080/api/layers/0' }, 
        { type: 'FeatureLayer', id: 1, name: 'Restaurants' },
        { type: 'TileLayer', id: 2, name: 'Cycling Routes', resource: 'https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png' }
      ];
      
  }
};
</script>


