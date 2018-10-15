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

import ApiService from "@/api/api.service";

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
            ApiService.get('markers', args.resource)
            .then(layer => { 
            this.$emit('add-layer', { layer: layer.data, type: args.type, id: args.id });
          });
         }
         else if (args.type == 'TileLayer.TimeLine') {
            var tileLayer = L.tileLayer(args.resourceUrl, { tms: args.tms });
            var portusTimeLayer = L.timeDimension.layer.tileLayer.timeLine(tileLayer, {});
            this.$emit('add-layer',  { layer: portusTimeLayer, type: args.type, id: args.id }) ;
         }
         else if (args.type == 'TileLayer') {
            var tileLayer = L.tileLayer(args.resourceUrl, { tms: args.tms });
            this.$emit('add-layer',  { layer: tileLayer, type: args.type, id: args.id }) ;
         }
       }
       else {
          this.$emit('remove-layer', args.id)
       }
       
    }
  }
}

</script>