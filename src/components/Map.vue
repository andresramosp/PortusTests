<template>
<div class="row">
   <div class="col-md-9">
        <div id="map"></div>
    </div>
    <div class="col-md-3">
       <!-- <slot name="layersPanel" v-if="map != null"></slot> -->
       <LayersPanel2 :layers="layers" :map="map" @layer-changed="layerChanged" /> 
    </div>
    <slot></slot>
</div>
</template>

<script>

import UsuariosService from "@/api/usuarios.service";
import LayersPanel2 from "@/components/LayersPanel2.vue";
import LayersService from "@/api/layers.service";

export default {
  name: "Map",
  components: {
    LayersPanel2
  },
  props: {
    layers: Array,
    baseMap: Object
  },
  data() {
    return {
      map: null
    };
  },
  watch: {
    baseMap: function (oldValue, newValue) {
      this.setBaseLayer();
    }
  },
  mounted() {
    this.initMap();
    this.setBaseLayer();
  },
  methods: {
    getMap: function (found) {
      return this.map;
    },
    layerChanged: function (layerId, active) {
      // if (!active) {
      //   this.removeLayer(layerId);
      // }
      // else {
      //   this.addLayer(layerId);
      // }
      this.addLayer(layerId);
    },
    addLayer: function (idLayer) {
      var vm = this;
      LayersService.get(idLayer)
        .then(layer => { 
          var markers = [];
          layer.features.forEach((feature) => {
            var marker = L.marker(feature.coords).bindPopup(feature.name);
            marker.addTo(vm.map);
            markers.push(markers);  
          });
          L.featureGroup(markers).addTo(vm.map); //as
      });
    
    },
    removeLayer: function (idLayer) {
      map.eachLayer(function(layer){
        if (layer.id == idLayer)
          layer.remove();
      });
    },
    initMap: function() {
      var mapExtent = [-13.22547087, 31.27732673, 56.43171235, 69.50672323];
      var bounds = new L.LatLngBounds(
        new L.LatLng(mapExtent[1], mapExtent[0]),
        new L.LatLng(mapExtent[3], mapExtent[2])
      );
      this.map = L.map('map').fitBounds(bounds);
      L.Control.measureControl().addTo(this.map);
    },
    setBaseLayer: function () {
       if (this.baseMap) {
        this.baseMap.addTo(this.map);
      }
    },
    // initLayers: function () {
    //   this.layers.forEach((layer) => {
    //     const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
    //     const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');
    //     markerFeatures.forEach((feature) => {
    //       feature.leafletObject = L.marker(feature.coords)
    //         .bindPopup(feature.name);
    //         if (layer.active) {
    //           feature.leafletObject.addTo(this.map);
    //         }
          
    //     });
    //     polygonFeatures.forEach((feature) => {
    //       feature.leafletObject = L.polygon(feature.coords)
    //         .bindPopup(feature.name);
    //     });
    //   });
    // },
   
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  z-index: 1;
  height: 600px;
}

#slider {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 5;
}
</style>