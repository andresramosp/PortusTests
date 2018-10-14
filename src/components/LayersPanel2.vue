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

import LayersService from "@/api/layers.service";

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
       if (active) {
        LayersService.get(layerId)
        .then(layer => { 
          this.$emit('add-layer', layer)
        });
       }
       else {
          this.$emit('remove-layer', layerId)
       }
       
    }
  }
}

</script>