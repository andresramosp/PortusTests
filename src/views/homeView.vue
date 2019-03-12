<template>
<div id="app">
   <Map :mapFixed="mapFixed" :scrollWheelZoom="scrollWheelZoom" />
   <MainMenu :mapOptionsGroups="mapState.mapOptionsGroups" :mapOptions="mapState.mapOptions" /> 
   <MarkerPanel :markers='mapState.markersSelected' />
   <StaticMapsPanel :mapResource='mapState.staticMapResourceSelected' />
   <UbicacionesPanel v-if="showCitiesPanel" />
   <RegionesPanel v-if="showRegionsPanel" />
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
      mapFixed: PC.map_fixed,
      scrollWheelZoom: PC.scroll_wheel_zoom,
      defaultLogo: PC.default_map_logo,
      showCitiesPanel: PC.show_cities_panel,
      showRegionsPanel: PC.show_regions_panel
    }    
  },
  created() {
    this.$setLocale(this.$route.query.locale ? this.$route.query.locale : 'es');
    document.body.classList.add(this.$route.query.theme ? this.$route.query.theme + "Theme" : PC.default_theme);
  }
};
</script>

<style>



 
</style>


