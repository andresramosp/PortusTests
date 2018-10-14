<template>
  <div>
    <div class="form-check" v-for="layer in layers" :key="layer.id">
      <label class="form-check-label">
        <input class="form-check-input" type="checkbox" v-model="layer.active" @change="layerChanged(layer.id, layer.active)" />
        {{ layer.name }}
      </label>
    </div> 
  </div>
</template>

<script>

export default {
  name: "LayersPanelSlot",
  inject: ['getMap', 'getLayers'],
  data () {
    return {
      map: null,
      layers: []
    }
  },
  mounted() {
   this.map = this.getMap();
   //this.getMap((map) => this.map = map);
   this.layers = this.getLayers();
  },
  methods: {
     layerChanged: function (layerId, active) {
      const layer = this.layers.find(layer => layer.id === layerId);
      layer.features.forEach((feature) => {
        if (active) {
          feature.leafletObject.addTo(this.map);
        } else {
          feature.leafletObject.removeFrom(this.map);
        }
      });
    }
  }
}

</script>