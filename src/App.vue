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

import Map from "./components/map.vue";
import LayersPanel from "./components/layersPanel.vue";
import InfoPanel from "./components/infoPanel.vue";
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
      //"https://khms0.googleapis.com/kh?v=812&hl=es&x={x}&y={y}&z={z}",
      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options
    );

    this.mapResources = [
        { 
          id: 1, 
          type: 'TimeLineLayer', 
          name: 'Nivel del Mar', 
          resourceApi: 'mapTileResources/RES', 
          tms: true 
        },
        { 
          id: 2, 
          type: 'FeatureLayer', 
          name: 'Nivmar Ubic. Puertos', 
          resourceApi: 'ubicacionesNivmar/1', 
          minZoom: 0, 
          icon: 'nivmar-puerto.png' 
        },
        { 
          id: 3, 
          type: 'FeatureLayer', 
          name: 'Nivmar Ubic. Localidades', 
          resourceApi: 'ubicacionesNivmar/2', 
          minZoom: 7, 
          icon: 'nivmar-localidad.png' 
        },
        { 
          id: 4, 
          type: 'FeatureLayer', 
          name: 'Nivmar Ubic. Playas', 
          resourceApi: 'ubicacionesNivmar/3', 
          minZoom: 8, 
          icon: 'nivmar-playa.png' 
        },
        { 
          id: 5, 
          type: 'TimeLineLayer', 
          name: 'Oleaje Atlántico', 
          resourceApi: 'mapTileResources/VHM0Atl', 
          tms: true,
          vectors: true
        },
        { 
          id: 6, 
          type: 'TimeLineLayer', 
          name: 'Oleaje Mediterráneo', 
          resourceApi: 'mapTileResources/VHM0Med', 
          tms: true,
          vectors: true
        },
        { 
          id: 7, 
          type: 'TimeLineLayer', 
          name: 'Oleaje', 
          resourceApi: 'mapTileResources/VHM0', 
          tms: true ,
          vectors: true
        },
        { 
          id: 8, 
          type: 'TimeLineLayer', 
          name: 'Corriente', 
          resourceApi: 'mapTileResources/CURR/circulation', 
          tms: true,
          vectors: true
        },
        { 
          id: 9, 
          type: 'TimeLineLayer', 
          name: 'Temperatura', 
          resourceApi: 'mapTileResources/SST', 
          tms: true 
        },
        { 
          id: 10, 
          type: 'TimeLineLayer', 
          name: 'Viento', 
          resourceApi: 'mapTileResources/WSPD', 
          tms: true,
          vectors: true
        },
        { 
          id: 11, 
          type: 'TimeLineLayer', 
          name: 'Salinidad', 
          resourceApi: 'mapTileResources/SAL', 
          tms: true 
        },
        { 
          id: 12, 
          type: 'FeatureLayer', 
          name: 'Puntos Cirana', 
          resourceApi: 'puntoMallaCirana', // {zoom}
          minZoom: 0, 
          serverMode: true,
          icon: 'nivmar-puerto.png' 
        }
      ];

    this.mapOptions = [
      { id: 0, group: 'Predicciones', name: 'Nivel del Mar', mapResources: [1, 2, 3, 4] },
      { id: 1, group: 'Predicciones', name: 'Corrientes', mapResources: [12] }, // [8, 12]
      { id: 2, group: 'Predicciones', name: 'Temperatura', mapResources: [9] },
      { id: 3, group: 'Predicciones', name: 'Oleaje Atl', mapResources: [5, 7] },
      { id: 4, group: 'Predicciones', name: 'Oleaje Med', mapResources: [6] },
      { id: 5, group: 'Predicciones', name: 'Viento', mapResources: [10] },
      { id: 6, group: 'Predicciones', name: 'Salinidad', mapResources: [11] }
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


