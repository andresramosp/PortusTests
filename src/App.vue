<template>
<div id="app" >
   <Map :baseMap='baseMap' :layers='layers'>
   </Map>
</div>
</template>

<script>

import Map from "./components/Map.vue";
import LayersPanel from "./components/LayersPanel.vue";

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
  mounted () {
    var options = {
        minZoom: 2,
        maxZoom: 12,
        attribution:
          'Rendered with <a href="http://www.maptiler.com/">MapTiler</a>',
        tms: false
      };

    this.baseMap = L.tileLayer(
      "https://khms0.googleapis.com/kh?v=812&hl=es&x={x}&y={y}&z={z}",
      //"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options
    );

    this.layers = [
        { id: 'churches', type: 'FeatureLayer', name: 'Churches', resource: 'churches' }, 
        { id: 'restaurants', type: 'FeatureLayer', name: 'Restaurants', resource: 'restaurants' },
        { id: 'cycling-routes', type: 'TileLayer', name: 'Cycling Routes', resourceUrl: 'https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', tms: false },
        { id: 'prediccion-nivmar', type: 'TileLayer.TimeLine', name: 'Nivel del Mar', resourceUrl: 'https://portus.puertos.es/Portus//pathtiles/level/NIVMAR/RES/{d}{h}/map//{z}/{x}/{y}.png', tms: true},
        { id: 'prediccion-oleajeAtlantico', type: 'TileLayer.TimeLine', name: 'Oleaje Atlántico', resourceUrl: 'https://portus.puertos.es/Portus//pathtiles/wave/ATL/VHM0/{d}{h}/map//{z}/{x}/{y}.png', tms: true}
      ];
      
  }
};
</script>


