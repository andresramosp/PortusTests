<template>
<div id="app" >
   <Map :baseMap='baseMap' :mapFixed="mapFixed" />
   <LayersPanel :mapOptionsGroups="mapState.mapOptionsGroups" :mapOptions="mapState.mapOptions" /> 
   <MarkerPanel :markers='mapState.markersSelected' />
   <StaticMapsPanel :mapResource='mapState.staticMapResourceSelected' />
   <UbicacionesPanel />
   <RegionesPanel />
   <LocationsWidget :ubicacion="mapState.ubicacionSelected" />
   <DataTablesPanel :marker="mapState.RTDataTableStation" :parameters="mapState.RTDataTableParameters" />
   <LogosList :logos="mapState.mapLogos" :defaultLogo="defaultLogo" />
</div>
</template>

<script>

import Map from "@/components/map.vue";
import MapState from "@/state/map.state";
import LayersPanel from "@/components/layersPanel.vue";
import MarkerPanel from "@/components/markerPanel/markerPanel.vue";
import StaticMapsPanel from "@/components/staticMapsPanel.vue";
import UbicacionesPanel from "@/components/ubicacionesPanel.vue";
import RegionesPanel from "@/components/regionesPanel.vue";
import LocationsWidget from "@/components/locationsWidget/locationsWidget.vue";
import DataTablesPanel from "@/components/dataTablesPanel/dataTablesPanel.vue";
import LogosList from "@/components/logosList.vue";
import { MapOptions } from '@/common/mapResourceManager';
import { MapOptionsGroups } from '@/common/mapResourceManager';

export default {
  name: "app",
  components: {
    Map,
    LayersPanel,
    MarkerPanel,
    StaticMapsPanel,
    UbicacionesPanel,
    RegionesPanel,
    LocationsWidget,
    LogosList,
    DataTablesPanel
  },
  data () {
    return {
      mapState: MapState,
      baseMap: null,
      mapFixed: PC.map_fixed,
      defaultLogo: PC.default_map_logo
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
    this.mapState.mapOptionsGroups = MapOptionsGroups;
    this.mapState.mapOptions = MapOptions.filter(opt => { return PC.map_options.length == 0 || PC.map_options.indexOf(opt.id) != -1});  
  }
};
</script>

<style>

#app { height: 100%;}

.fadeIn {
    -webkit-animation: animat_show 1.2s;
    animation: animat_show 1.2s;
    visibility: visible !important;
}

@-webkit-keyframes animat_show{
    0%{opacity:0}
    100%{opacity:1}
 }
 
</style>


