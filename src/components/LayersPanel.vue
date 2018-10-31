<template>
<div>
  
  <div class='layersPanel' :class="{ 'leftAlign': align == 'left', 'rightAlign': align == 'right' }">
      <b-card header="Predicciones" class="text-center panel-section" :class="theme" >
        <b-container>
           <b-row >
               <b-col cols="6" class="form-check text-left" v-if="mapOption.group == 'predicciones'" v-for="mapOption in mapOptions" :key="mapOption.id">
              <label class="form-check-label">
                <input class="form-check-input" type="checkbox" v-model="mapOption.active" @change="mapOptionChanged(mapOption)" />
                {{ mapOption.name }}
              </label>
            </b-col> 
           </b-row>
        </b-container>
         
      </b-card>
      <b-card header="Tiempo Real" class="text-center panel-section" :class="theme" >
        <b-container>
           <b-row >
               <b-col cols="6" class="form-check text-left" v-if="mapOption.group == 'tiempo_real'" v-for="mapOption in mapOptions" :key="mapOption.id">
              <label class="form-check-label">
                <input class="form-check-input" type="checkbox" v-model="mapOption.active" @change="mapOptionChanged(mapOption)" />
                {{ mapOption.name }}
              </label>
            </b-col> 
        </b-row>
        </b-container>
      </b-card>
  </div>

</div>
  
</template>


<script>

import MapState from "@/state/map.state";

export default {
  name: "LayersPanel",
  data() {
    return {
      align: PC.options_panel_align,
      theme: PC.color_theme
    };
  },
  props: {
    mapOptions: { type: Array, default: [], required: false }
  },
  mounted() {},
  methods: {
    mapOptionChanged: function(mapOption) {
       if (mapOption.active) {
        mapOption.mapResources.forEach(resId => {
          var mapResource = MapState.getMapResource(resId);
          MapState["add" + mapResource.type](mapResource, mapResource.type == "TimeLineLayer" ? mapResource.defaultVectors : null);
        });
      } else {
        mapOption.mapResources.forEach(resId => {
          MapState.removeLayer(resId);
        });
      }
      this.$emit("option-click", mapOption);
    }
  }
};
</script>

<style scoped>
.leftAlign {
  left: 12px;
}

.rightAlign {
  right: 12px;
}

.blueTheme {
  background-color: rgba(0, 123, 255, 0.5); 
}

.greenTheme {
  background-color: rgba(0, 255, 0, 0.5); 
}

.layersPanel {
  position: absolute;
  z-index: 2;
  width: 320px;
  top: 9px;
  /* background-color: rgba(0, 123, 255, 0.5);
  padding: 10px; */
  border-radius: 8px;
  color: white;
  font-size: 14px;
}

input[type="checkbox"] {
  width: 1.1em;
  height: 1.1em;
  padding-right: 3px;
}

.form-check {
  padding-top: 5px;
}

.form-check-input {
  margin-right: 5px;
}

.card-header{
  background-color: #091c3259;
  font-size: 19px
}

.panel-section {
  /* background-color: rgba(0, 123, 255, 0.5);  */
  margin-top: 12px; 
  border-radius: 8px;
}

</style>