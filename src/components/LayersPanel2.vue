<template>
  <div>
    <div class="form-check" v-for="layer in layers" :key="layer.id">
      <label class="form-check-label">
        <input class="form-check-input" type="checkbox" v-model="layer.active" @change="layerChanged(layer)" />
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
      layers: { type: Array, default: [], required: false }
      //map: { type: Object, default: null, required: false }
    }
  ,
  mounted() {
   
  },
  methods: {
     layerChanged: function (args) {
       if (args.active) {
         if (args.type == 'FeatureLayer') {
           LayersService.get(args.id)
           .then(layer => { 
            this.$emit('add-layer', { layer: layer, type: args.type });
          });
         }
         else if (args.type == 'TileLayer') {
            var tileLayer = L.tileLayer(args.resource, {});
            this.$emit('add-layer',  { layer: tileLayer, type: args.type}) ;
         }
       }
       else {
          this.$emit('remove-layer', args.id)
       }
       
    }
  }
}

</script>