<template>
<div id="app" >
   <Map :baseMap='baseMap' :mapResources='mapResources' :mapOptions='mapOptions'>
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
      mapResources: [],
      mapOptions: [],
      baseMap: null
    }    
  },
  mounted () {
    var options = {
        minZoom: 1,
        maxZoom: 12,
        attribution:
          'Rendered with <a href="http://www.maptiler.com/">MapTiler</a>',
        tms: false
      };

    this.baseMap = L.tileLayer(
      "https://khms0.googleapis.com/kh?v=812&hl=es&x={x}&y={y}&z={z}",
      options
    );

    this.mapResources = [
        { id: 0, type: 'TileLayer', name: 'Cycling Routes', resourceUrl: 'https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', tms: false },
        { id: 1, type: 'TileLayer.TimeLine', name: 'Nivel del Mar', resourceUrl: 'https://portus.puertos.es/Portus//pathtiles/level/NIVMAR/RES/{d}{h}/map//{z}/{x}/{y}.png', tms: true },
        { id: 2, type: 'FeatureLayer', name: 'Nivmar Ubic. Puertos', resourceApi: 'ubicacionesNivmar/1', minZoom: 0, icon: 'nivmar-puerto.png' },
        { id: 3, type: 'FeatureLayer', name: 'Nivmar Ubic. Localidades', resourceApi: 'ubicacionesNivmar/2', minZoom: 7, icon: 'nivmar-localidad.png' },
        { id: 4, type: 'FeatureLayer', name: 'Nivmar Ubic. Playas', resourceApi: 'ubicacionesNivmar/3', minZoom: 8, icon: 'nivmar-playa.png' },
        { id: 5, type: 'TileLayer.TimeLine', name: 'Oleaje Atlántico Tiles', resourceUrl: 'https://portus.puertos.es/Portus//pathtiles/wave/ATL/VHM0/{d}{h}/map//{z}/{x}/{y}.png', tms: true }
      ];

    this.mapOptions = [
      { id: 0, group: 'Predicciones', name: 'Nivel del Mar', mapResources: [1, 2, 3, 4] },
      { id: 1, group: 'Predicciones', name: 'Oleaje Atlántico', mapResources: [5] }
    ]
      
  }
};
</script>


