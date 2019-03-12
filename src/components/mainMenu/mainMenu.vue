<template>
<div >
  
  <div class='layersPanel unselectable' :class="[align == 'left' ? 'leftAlign' : 'rightAlign']">
      <span style="position: absolute; z-index: 5; cursor: pointer; width: 25px; height: 25px" 
            :class="minimizerClassList"
            @click="toggleMinimized()">
      </span>
    <div v-for="optGrp in mapOptionsGroups.groups" :key="optGrp.id">
       <b-row :class="optGrp.id" style="margin-left: 0px; margin-right: 0px">
          <b-card class="text-center panel-section" :class="[minimized ? 'minimized': '', fading ? 'fadeInMenu' : '']" @animationend="fading=false" header-tag="header" >
            <h6 slot="header" class="mb-0" :class="optGrp.id">
              {{ minimized ? $t(optGrp.nameMin) : $t(optGrp.name) }}
               <img :src='require("@/assets/icons/info.png")'
                  class="infoGroup"
                  :class="[align == 'left' ? 'infoGroupRight' : 'infoGroupLeft']"
                  @click="openGroupInfo(optGrp.id)"
                >
            </h6>
            <b-container>
              <b-row >
                  <b-col v-for="mapOption in mapOptions.filter(opt => opt.group == optGrp.id)" :key="mapOption.id" cols="6" class="form-check text-left" style="padding-top: 3px; margin-bottom: 3px;" >
                    <label class="form-check-label lightable" :class="[mapOption.active ? 'mapOptionChecked' : '']" :title="minimized ? $t(mapOption.name) : ''" style="float: left; cursor: pointer">
                      <span style="float: left; margin-right: 2px; margin-top: -2.5px; height: 28px"
                            class="fadeIn"
                            :class="[mapOption.iconClass, mapOption.active ? 'mapOptionChecked' : '']">

                      </span>
                      <input class="form-check-input" style="display: none" 
                            type="checkbox" 
                            v-model="mapOption.active" 
                            :value="mapOption.active" 
                            :disabled="false"
                            @change="mapOptionChanged(mapOption)" />
                       {{ minimized ? '' : $t(mapOption.name) }}
                  </label>
                </b-col> 
              </b-row>
            </b-container>
          </b-card>
          <SubMenu :mapOptionGroup="optGrp" :minimized="minimized" />
       </b-row>
    </div>
  </div>

</div>
  
</template>


<script>

import MapState from "@/state/map.state";
import SubMenu from "@/components/mainMenu/subMenu.vue";
import Vue from 'vue';

export default {
  name: "MainMenu",
  components: {
    SubMenu
  },
  data() {
    return {
      mapState: MapState,
      align: PC.options_panel_align,
      theme: "", // PC.color_theme,
      $t: this.$t,
      minimized: PC.user_preferences.menu_minimized  != undefined ? PC.user_preferences.menu_minimized : false,
      fading: false
    };
  },
  props: {
    mapOptions: { type: Array, default: [], required: false },
    mapOptionsGroups: { type: Object, default: null, required: false }
  },
  computed: {
    minimizerClassList() {
      var list = [];
      if (this.align == 'left') {
        list.push('leftImgMinimizer')
        if (!this.minimized) {
          list.push('replegarIcon')
        }
        else {
          list.push('desplegarIcon')
        }
      }
      else {
        list.push('rightImgMinimizer')
        if (!this.minimized) {
          list.push('desplegarIcon')
        }
        else {
          list.push('replegarIcon')
        }
      }
      return list;
    }
  },
  mounted() {},
  methods: {
    mapOptionChanged: function(mapOption) {
        this.mapState.setMapOption(mapOption.id, mapOption.active);
    },
    toggleMinimized: function() {
      this.minimized = !this.minimized;
      localStorage.setItem('menu_minimized', this.minimized);
      this.fading = true;
    },
    openGroupInfo: function(groupId) {
      this.mapState.setPortusInfoPanel(groupId);
    }
  }
};
</script>

<style scoped>

.infoGroup {
  margin-top: 1px;
  cursor: pointer;
  width: 18px;
}

.infoGroupRight {
  float: right;
  margin-right: 5px;
}

.infoGroupLeft {
  float: left;
  margin-left: 5px;
}

.leftImgMinimizer {
  left: -10px
}

.rightImgMinimizer {
  right: -10px
}

.leftAlign {
  left: 12px;
}
.rightAlign {
  right: 12px;
}

.layersPanel {
  position: absolute;
  z-index: 2;
  top: 2px;
  border-radius: 0px;
  font-size: 13px;
}
input[type="checkbox"] {
  width: 1.1em;
  height: 1.1em;
  padding-right: 3px;
}
.form-check {
  padding-top: 5px;
  padding-left: 10px !important;
}
.col-6 {
  padding-right: 10px !important;
}
.form-check-input {
  margin-right: 5px;
}
.container {
  /* padding-left: 5px !important; */
  /* padding-right: 5px !important; */
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
.card-body {
  padding: 5px !important;
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
  width: 75px !important;
}


.minimized .form-check {
  padding-right: 0px !important;
  padding-left: 2px !important;

}




</style>