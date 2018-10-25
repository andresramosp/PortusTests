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
import { MapResources, MapOptions } from '@/common/mapResourceManager';

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
        minZoom: PC.base_layer_min_zoom,
        maxZoom: PC.base_layer_max_zoom,
        attribution:
          'Rendered with <a href="http://www.maptiler.com/">MapTiler</a>',
        tms: false
      };

    this.baseMap = L.tileLayer(
      PC.base_layer,
      options
    );

    this.mapResources = MapResources;
    this.mapOptions = MapOptions.filter(opt => { return PC.map_options.indexOf(opt.id) != -1});
      
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

#app { height: 100%;}
 

</style>


