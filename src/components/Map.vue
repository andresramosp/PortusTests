<template>
<div class="row">
   <div class="col-md-9">
        <div id="map"></div>
    </div>
    <div class="col-md-3">
       <!-- <slot name="layersPanel" v-if="map != null">vf</slot> -->
       <LayersPanel2 :layers="layers" :map="map" @add-layer="addLayer" @remove-layer="removeLayer" /> 
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
    layerChanged: function (args) {
      if (!args.active) {
        this.removeLayer(args.layerId);
      }
      else {
        this.addLayer(args.layerId);
      }
    },
    addLayer: function (layer) {
      var markers = [];
      layer.features.forEach((feature) => {
        var marker = L.marker(feature.coords).bindPopup(feature.name);
        marker.zoomRange = feature.zoomRange;
        markers.push(marker);  
      });
      var featureGroupLayer = L.featureGroup(markers); 
      featureGroupLayer.id = layer.id;
      featureGroupLayer.addTo(this.map);
      this.checkVisibleLayerAtZoom();
    },
    removeLayer: function (idLayer) {
      this.map.eachLayer(function(layer){
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

      var vm = this;
      this.map.on('zoomend', function(){
        vm.checkVisibleLayerAtZoom();
      });

      L.Control.measureControl().addTo(this.map);
    },
    checkVisibleLayerAtZoom: function () {
      var zoom = this.map.getZoom();
      this.map.eachLayer(function(layer){
        if (layer instanceof L.FeatureGroup) {
          var markers = layer.getLayers();
          markers.forEach(m => {
            m.setOpacity((m.zoomRange.min < zoom && zoom < m.zoomRange.max) ? 1 : 0.2);
          })
        }
      });
    },
    setBaseLayer: function () {
       if (this.baseMap) {
        this.baseMap.addTo(this.map);
      }
    }
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