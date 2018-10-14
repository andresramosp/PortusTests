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
  name: "LayersPanel",
  props: 
    {
      layers: { type: Array, default: [], required: false },
      map: { type: Object, default: null, required: false }
    }
  ,
  mounted() {
   
  },
  methods: {
     layerChanged: function (layerId, active) {
      this.$emit('layer-changed', layerId)
      // const layer = this.layers.find(layer => layer.id === layerId);
      // layer.features.forEach((feature) => {
      //   if (active) {
      //     feature.leafletObject.addTo(this.map);
      //   } else {
      //     feature.leafletObject.removeFrom(this.map);
      //   }
      // });
    }
  }
}

</script>