<template>
<div id="app">
   <Map :baseMap='baseMap' :mapFixed="mapFixed" />
   <MainMenu :mapOptionsGroups="mapState.mapOptionsGroups" :mapOptions="mapState.mapOptions" /> 
   <MarkerPanel :markers='mapState.markersSelected' />
   <StaticMapsPanel :mapResource='mapState.staticMapResourceSelected' />
   <UbicacionesPanel />
   <RegionesPanel />
   <LocationsWidget :ubicacion="mapState.ubicacionSelected" />
   <LogosList :logos="mapState.mapLogos" :defaultLogo="defaultLogo" />
   <DataStackPanel />
   <PuertosInfoPanel :sourceId="mapState.puertosInfoSourceId" />
</div>
</template>

<script>

import Map from "@/components/map.vue";
import MapState from "@/state/map.state";
import MainMenu from "@/components/mainMenu/mainMenu.vue";
import MarkerPanel from "@/components/markerPanel/markerPanel.vue";
import StaticMapsPanel from "@/components/staticMapsPanel.vue";
import UbicacionesPanel from "@/components/ubicacionesPanel.vue";
import RegionesPanel from "@/components/regionesPanel.vue";
import LocationsWidget from "@/components/locationsWidget/locationsWidget.vue";
import LogosList from "@/components/logosList.vue";
import DataStackPanel from "@/components/dataStackPanel.vue";
import PuertosInfoPanel from "@/components/puertosInfoPanel.vue";
import { MapOptions } from '@/common/mapResourceManager';
import { MapOptionsGroups } from '@/common/mapResourceManager';

export default {
  name: "app",
  components: {
    Map,
    MainMenu,
    MarkerPanel,
    StaticMapsPanel,
    UbicacionesPanel,
    RegionesPanel,
    LocationsWidget,
    LogosList,
    DataStackPanel,
    PuertosInfoPanel
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
    document.body.classList.add(this.$route.query.theme ? this.$route.query.theme : PC.default_theme);
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



 
</style>


