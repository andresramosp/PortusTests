<template>
<div>
  
  <div class='layersPanel' :class="{ 'leftAlign': align == 'left', 'rightAlign': align == 'right' }">
      <b-card v-for="optGrp in mapOptionsGroups" :header="$t(optGrp.name)" class="text-center panel-section" :class="theme" :key="optGrp.id">
        <b-container>
           <b-row >
               <b-col v-for="mapOption in mapOptions.filter(opt => opt.group == optGrp.id)" :key="mapOption.id" cols="6" class="form-check text-left" style="padding-top: 2px;" >
                <label class="form-check-label">
                  <input class="form-check-input" type="checkbox" v-model="mapOption.active" :value="mapOption.active" @change="mapOptionChanged(mapOption)" />
                  {{ $t(mapOption.name) }}
              </label>
            </b-col> 
           </b-row>
        </b-container>
       </b-card>
  </div>

  <FloatingLayerOptions />

</div>
  
</template>


<script>
import MapState from "@/state/map.state";
import FloatingLayerOptions from "@/components/floatingLayerOptions.vue";
export default {
  name: "LayersPanel",
  components: {
    FloatingLayerOptions
  },
  data() {
    return {
      mapState: MapState,
      align: PC.options_panel_align,
      theme: PC.color_theme,
      $t: this.$t
    };
  },
  props: {
    mapOptions: { type: Array, default: [], required: false },
    mapOptionsGroups: { type: Array, default: [], required: false }
  },
  computed: {
  },
  mounted() {},
  methods: {
    mapOptionChanged: function(mapOption) {
        this.mapState.setMapOption(mapOption.id, mapOption.active);
    },
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
  background-color: rgba(0, 123, 255, 0.6);
}
.grayTheme {
  background-color: #39434fbf;
}
.greenTheme {
  background-color: rgba(0, 255, 0, 0.6);
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
  font-size: 13px;
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
.card-header {
  background-color: #091c3259;
  font-size: 17px;
  padding: 7px 5px 7px 5px
}
.panel-section {
  /* background-color: rgba(0, 123, 255, 0.5);  */
  margin-top: 12px;
  border-radius: 8px;
}
</style>