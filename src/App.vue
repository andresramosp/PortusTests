<template>
<div id="app" >
   <Map :baseMap='baseMap' :mapResources='mapResources' :mapOptions='mapOptions' @marker-click='openInfoPanel'>
   </Map>
  <b-modal v-model="modalShow" size="lg" :title="modalTitle">
     <InfoPanel :marker='marker' />
  </b-modal>
</div>
</template>

<script>

import Map from "./components/Map.vue";
import LayersPanel from "./components/LayersPanel.vue";
import InfoPanel from "./components/InfoPanel.vue";
import Config from '@/common/config';

export default {
  name: "app",
  components: {
    Map,
    LayersPanel,
    InfoPanel
  },
  data () {
    return {
      mapResources: [],
      mapOptions: [],
      baseMap: null,
      modalShow: false,
      modalTitle: '',
      marker: null
    }    
  },
  mounted () {
    var options = {
        minZoom: 1,
        maxZoom: 17,
        attribution:
          'Rendered with <a href="http://www.maptiler.com/">MapTiler</a>',
        tms: false
      };

    this.baseMap = L.tileLayer(
      "https://khms0.googleapis.com/kh?v=812&hl=es&x={x}&y={y}&z={z}",
      options
    );

    this.mapResources = [
        { id: 1, type: 'TileLayer.TimeLine', name: 'Nivel del Mar', resourceApi: 'mapTileResources/RES', tms: true },
        { id: 2, type: 'FeatureLayer', name: 'Nivmar Ubic. Puertos', resourceApi: 'ubicacionesNivmar/1', minZoom: 0, icon: 'nivmar-puerto.png' },
        { id: 3, type: 'FeatureLayer', name: 'Nivmar Ubic. Localidades', resourceApi: 'ubicacionesNivmar/2', minZoom: 7, icon: 'nivmar-localidad.png' },
        { id: 4, type: 'FeatureLayer', name: 'Nivmar Ubic. Playas', resourceApi: 'ubicacionesNivmar/3', minZoom: 8, icon: 'nivmar-playa.png' },
        { id: 5, type: 'TileLayer.TimeLine', name: 'Oleaje Atlántico', resourceApi: 'mapTileResources/VHM0Atl', tms: true },
        { id: 6, type: 'TileLayer.TimeLine', name: 'Oleaje Mediterráneo', resourceApi: 'mapTileResources/VHM0Med', tms: true },
        { id: 7, type: 'TileLayer.TimeLine', name: 'Oleaje', resourceApi: 'mapTileResources/CURR/VHM0', tms: true },
        { id: 8, type: 'TileLayer.TimeLine', name: 'Corriente', resourceApi: 'mapTileResources/CURR/circulation', tms: true },
        { id: 9, type: 'TileLayer.TimeLine', name: 'Temperatura', resourceApi: 'mapTileResources/SST', tms: true },
        { id: 10, type: 'TileLayer.TimeLine', name: 'Viento', resourceApi: 'mapTileResources/WSPD', tms: true }
      ];

    this.mapOptions = [
      { id: 0, group: 'Predicciones', name: 'Nivel del Mar', mapResources: [1, 2, 3, 4] },
      { id: 1, group: 'Predicciones', name: 'Corrientes', mapResources: [8] },
      { id: 2, group: 'Predicciones', name: 'Temperatura', mapResources: [9] },
      { id: 3, group: 'Predicciones', name: 'Oleaje Atl', mapResources: [5, 7] },
      { id: 4, group: 'Predicciones', name: 'Oleaje Med', mapResources: [6, 7] },
      { id: 5, group: 'Predicciones', name: 'Viento', mapResources: [10] }
    ]
      
  },
  methods: {
    openInfoPanel: function (marker) {
      // TODO: posiblemente hay que hacer aqui una llamada para el mareógrafo (requestMareografoDetalle), para otros markers
      this.marker = marker;
      this.modalTitle = marker.tipoUbicacion + `: ` + marker.nombre;
      this.modalShow = true;
    }
  }
};
</script>

<style scoped>

 

</style>


