<template>
<div id="app" >
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

@media screen and (max-height: 550px) {
   /* .layersPanel, .leaflet-bar-timecontrol { */
   .layersPanel {
      -webkit-transform: scale(0.65);
    -webkit-transform-origin: 0 0;
    -webkit-transition:.3s;
    transform: scale(0.65);
    transform-origin: 0 0;
    transition:.3s;
   }
/* .playerOptions {
    -webkit-transform: scale(0.7) translate(-30%,-0%);
    -webkit-transition:.3s;
    transform: scale(0.7) translate(-30%,-0%);
    transition:.3s;
   } */
}

@media screen and (min-height: 551px) and (max-height: 630px) {
   /* .layersPanel, .leaflet-bar-timecontrol { */
   .layersPanel {
     -webkit-transform: scale(0.75);
    -webkit-transform-origin: 0 0;
    -webkit-transition:.3s;
    transform: scale(0.75);
    transform-origin: 0 0;
    transition:.3s;
   }
/* .playerOptions {
    -webkit-transform: scale(0.8) translate(-20%,-0%);
    -webkit-transition:.3s;
    transform: scale(0.8) translate(-20%,-0%);
    transition:.3s;
   } */
}

@media screen and (min-height: 631px) and (max-height: 700px) {
  /* .layersPanel, .leaflet-bar-timecontrol { */
   .layersPanel {
      -webkit-transform: scale(0.9);
    -webkit-transform-origin: 0 0;
    -webkit-transition:.3s;
    transform: scale(0.9);
    transform-origin: 0 0;
    transition:.3s;
   }
  /* .playerOptions {
    -webkit-transform: scale(0.9) translate(-10%,-0%);
    -webkit-transition:.3s;
    transform: scale(0.9) translate(-10%,-0%);
    transition:.3s;
   } */
}

@media only screen and (max-device-width: 768px) and (orientation: portrait) {

   .layersPanel {
      -webkit-transform: scale(2.0);
    -webkit-transform-origin: 0 0;
    -webkit-transition:.3s;
    transform: scale(2.0);
    transform-origin: 0 0;
    transition:.3s;
   }
}
@media only screen and (max-device-width: 768px) and (orientation: landscape){

   .layersPanel {
      -webkit-transform: scale(0.6);
    -webkit-transform-origin: 0 0;
    -webkit-transition:.3s;
    transform: scale(0.6);
    transform-origin: 0 0;
    transition:.3s;
   }
}


.fadeIn {
    /* -webkit-animation: animat_show 1.2s;
    animation: animat_show 1.2s;
    visibility: visible !important; */
}
.popup {
  position: absolute !important;
  top: 5% important;
}

@-webkit-keyframes animat_show{
    0%{opacity:0}
    100%{opacity:1}
 }

 .unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/* Mover a custom-controls CSS */

.dx-texteditor.dx-editor-outlined {
  border-radius: 0px !important;
}

.dx-list-item-content {
  padding: 0px !important;
}

.dx-popup-wrapper > .dx-overlay-content {
  border: 0px;
  border-radius: 0px;
}

.dx-dropdownlist-popup-wrapper .dx-popup-content {
  padding: 0px;
}

/* Mover a themes CSS */

.darkTheme .card-body {
  background-color: rgba(0, 0, 0, 0.7);
}

.darkTheme .card-header .predicciones, .darkThemeSub .predicciones {
  /* background-color: rgba(34, 37, 224, 0.7); */
  background-color: rgba(11, 90, 149, 0.7);
}

.darkTheme .card-header .tiempo_real, .darkThemeSub .tiempo_real {
  background-color: rgba(6, 136, 192, 0.7);
}

.darkTheme .card-header .historico, .darkThemeSub .historico {
  background-color: rgba(115, 170, 199, 0.7);
}

.darkTheme .predicciones .mapOptionChecked  img {
  background-color: rgba(11, 90, 149, 0.7);
}

.darkTheme .predicciones .mapOptionChecked {
    color: rgba(11, 90, 149, 1);
    font-weight: bold;
}

.darkTheme .tiempo_real .mapOptionChecked  img {
  background-color: rgba(6, 136, 192, 0.7);
}

.darkTheme .tiempo_real .mapOptionChecked {
    color: rgba(6, 136, 192, 1);
    font-weight: bold;
}

.darkTheme .historico .mapOptionChecked  img {
  background-color: rgba(115, 170, 199, 0.7);
}

.darkTheme .historico .mapOptionChecked {
    color: rgba(115, 170, 199, 1);
    font-weight: bold;
}



.darkTheme .predicciones .lightable:hover  {
  color: rgba(11, 90, 149, 1);
}


.darkTheme .predicciones .minimized .lightable img:hover  {
  background-color: rgba(11, 90, 149, 1);
}

.darkTheme .tiempo_real .lightable:hover  {
  color: rgba(6, 136, 192, 0.7);
}

.darkTheme .tiempo_real .minimized .lightable img:hover  {
  background-color: rgba(6, 136, 192, 0.7);
}

.darkTheme .historico .lightable:hover  {
  color: rgba(115, 170, 199, 0.7);
}

.darkTheme .historico .minimized .lightable img:hover  {
  background-color: rgba(115, 170, 199, 0.7);
}

 
</style>


