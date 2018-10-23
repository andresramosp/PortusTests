<template>
  <div>
    <div class="form-check" v-for="mapOption in mapOptions" :key="mapOption.id">
      <label class="form-check-label">
        <input class="form-check-input" type="checkbox" v-model="mapOption.active" @change="mapOptionChanged(mapOption)" />
        {{ mapOption.name }}
      </label>
    </div> 
  </div>
</template>

<script>

import ApiService from "@/services/api.service";

export default {
  name: "LayersPanel",
  props: 
    {
      mapOptions: { type: Array, default: [], required: false }
    }
  ,
  mounted() {
   
  },
  methods: {
     mapOptionChanged: function (mapOption) {
      //  if (mapOption.active) {
      //     mapOption.mapResources.forEach(mr => {
      //       this.$emit('add-layer', mr);
      //     })
      //  }
      //  else {
      //    mapOption.mapResources.forEach(mr => {
      //       this.$emit('remove-layer', mr);
      //     })
          
      //  }
      this.$emit('option-click', mapOption);
    }
  }
}

</script>