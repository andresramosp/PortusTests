<template>
<div class="row">
   <div class="col-md-9">
        <div id="map"></div>
    </div>
    <div class="col-md-3">
       <!-- <slot name="layersPanel" v-if="map != null">vf</slot> -->
       <LayersPanel2 :layers="layers" @add-layer="addLayer" @remove-layer="removeLayer" /> 
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
    addLayer: function (args) {
      if (args.type == 'FeatureLayer') {
        var layer = args.layer;
        var markers = [];
        layer.forEach((feature) => {
          var marker = L.marker([feature.lat, feature.lon]).bindPopup(feature.name);
          marker.minZoom = feature.minZoom;
          marker.maxZoom = feature.maxZoom;
          markers.push(marker);  
        });
        var featureGroupLayer = L.featureGroup(markers); 
        featureGroupLayer.id = args.id;
        featureGroupLayer.addTo(this.map);
        this.checkVisibleLayerAtZoom();
      }
      else if (args.type == 'TileLayer' || args.type == 'TileLayer.TimeLine') {
        args.layer.id = args.id;
        args.layer.addTo(this.map);
      }
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

      var startDate = new Date();
      startDate.setUTCHours(0, 0, 0, 0);
      //startDate.setDate(startDate.getDate()-55);
      
      this.map = L.map('map', {
        fullscreenControl: true,
        timeDimensionControl: true,
        timeDimensionControlOptions: {
        position: 'bottomleft',
        playerOptions: {
            transitionTime: 1000,
          }
        },
        timeDimension: true,
        timeDimensionOptions: {
          timeInterval: startDate.toISOString() + "/PT72H",
          period: "PT3H"
        }, }).fitBounds(bounds);

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
            m.setOpacity((m.minZoom < zoom && zoom < m.maxZoom) ? 1 : 0.2);
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