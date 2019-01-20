<template>
<div >
  
  <div class='layersPanel' :class="{ 'leftAlign': align == 'left', 'rightAlign': align == 'right' }">
    <img @click="toggleMinimized()" width="27" style="position: absolute; z-index:5; left: -10px" :src="require('@/assets/icons/predictionWidget.png')" />
    <div v-for="optGrp in mapOptionsGroups" :key="optGrp.id">
       <b-row style="margin-left: 0px; margin-right: 0px">
          <b-card class="text-center panel-section" :class="[theme, minimized ? 'minimized': '']" header-tag="header" >
          <h6 slot="header" class="mb-0" :class="optGrp.id">{{$t(optGrp.name)}}</h6>
          <b-container>
            <b-row >
                <b-col v-for="mapOption in mapOptions.filter(opt => opt.group == optGrp.id)" :key="mapOption.id" cols="6" class="form-check text-left" style="padding-top: 2px;" >
                  <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" v-model="mapOption.active" :value="mapOption.active" @change="mapOptionChanged(mapOption)" />
                    {{ minimized ? '' : $t(mapOption.name) }}
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
      $t: this.$t,
      minimized: false
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
    toggleMinimized: function() {
      this.minimized = !this.minimized;
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
.card {
  background-color: transparent;
  border: none;
}
.card-header {
    font-size: 17px;
  padding: 0px 0px 0px 0px;
  border-radius: 0px !important;
}
.mb-0 {
  padding-top: 7px;
  padding-bottom: 7px;
}

.panel-section {
  /* background-color: rgba(0, 123, 255, 0.5);  */
  margin-top: 12px;
  border-radius: 0px;
   width: 320px;
}

.minimized {
  width: 150px !important;
}

</style>