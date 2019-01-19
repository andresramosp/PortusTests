<template>
<div>
  
  <div class='layersPanel' :class="{ 'leftAlign': align == 'left', 'rightAlign': align == 'right' }">
    <div v-for="optGrp in mapOptionsGroups" :key="optGrp.id">
       <b-row style="margin-left: 0px; margin-right: 0px">
          <b-card class="text-center panel-section" :class="theme" :header="$t(optGrp.name)" >
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
          <SubMenu :mapOptionGroup="optGrp" />
       </b-row>
    </div>
  </div>

</div>
  
</template>


<script>
import MapState from "@/state/map.state";
import SubMenu from "@/components/mainMenu/subMenu.vue";
export default {
  name: "MainMenu",
  components: {
    SubMenu
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
.darkTheme {
  background-color: rgba(0, 0, 0, 0.7);
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
  top: 9px;
  border-radius: 0px;
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
  background-color:#337ab7;
  font-size: 17px;
  padding: 7px 5px 7px 5px;
  border-radius: 0px !important;
}
.panel-section {
  /* background-color: rgba(0, 123, 255, 0.5);  */
  margin-top: 12px;
  border-radius: 8px;
   width: 320px;
  
}
</style>