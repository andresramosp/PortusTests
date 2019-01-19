 <template>
 <div v-if="floatingOptions.length > 0">
    <transition appear :appear-class="appearClass" appear-to-class="slide-menu-enter-active">
      <div class="floatingPanel fadeIn"  :class="{ 'leftAlign': align == 'left', 'rightAlign': align == 'right', blueThemeSub: theme == 'blueTheme', darkThemeSub: theme == 'darkTheme' }">
        <div class="form-check" v-for="floatingOption in floatingOptions" :key="floatingOptions.indexOf(floatingOption)">
           <label class="form-check-label">
             <input class="form-check-input" type="checkbox" v-model="floatingOption.active" @change="floatingOptionChanged(floatingOption)" />
               {{ $t(floatingOption.name) }}
            </label>
        </div> 
      </div>
     
   </transition>
   
 </div>
</template>

<script>

import MapState from "@/state/map.state";

export default {
  name: "SubMenu",
  props: {
    mapOptionGroup: { type: Object, default: null, required: false }
  },
  data() {
    return {
      align: PC.options_panel_align,
      theme: PC.color_theme,
      mapState: MapState
    };
  },
  computed: {
    appearClass() {
      return PC.options_panel_align == "right"
        ? "slide-menu-right"
        : "slide-menu-left";
    },

    floatingOptions() {

      var result = [];
      var vm = this;

      // Vamos recorriendo los mapOptions, filtrando solo aquellos que pertenecen al grupo
      // de este submenú (this.mapOptionGroup). Consideraremos que un mapOption es desglosable
      // en el submenú si: 1) tiene más de un mapResource o tiene cualquier número con agrupación
      // por layers (groupLayersBy) 2) no está marcado en el mapResoureManager como 'nonToggleable'. 
      // Dentro de ese mapOption vamos añadiendo al submenú todos los
      // mapResoure a excepción de aquellos marcados en mapResoureManager como 'nonToggleable'

      var optionsGrp = this.mapState.getActiveMapOptions().filter(opt => opt.group == this.mapOptionGroup.id && !opt.nonToggleable);
      optionsGrp.forEach(opt => {
          if (opt.mapResources.length > 1 || MapState.getMapResource(opt.mapResources[0]).groupLayersBy) {
            opt.mapResources.forEach(resId => {
                if (!MapState.getMapResource(resId).nonToggleable) {
                  var layersResouce = vm.mapState.getActiveLayers().filter(l => l.mapResource.id == resId)
                  layersResouce.forEach(layer => {
                    vm.addLayerToGroup(layer, result);
                  })
                }
            });
          }
        
      });

      return result;

    }
  },
  created() {},
  mounted() {},
  methods: {
    floatingOptionChanged: function(floatingOption) {
      floatingOption.method(floatingOption.args, floatingOption.active);
    },

    toggleVisibility: function(layers, visible) {
      layers.forEach(l => {
        l.visible = visible;
      })      
      var typeLayer = layers[0].mapResource.type;
      if (typeLayer == 'TimeLineLayer') {
        MapState.setVisibleTimeLineLayers();
      }
      else {
        MapState.setVisibleMarkerLayers();
      }
    },

    addLayerToGroup(layer, groupList) {
      var vm = this;
      var group;
      if (layer.mapResource.groupLayersBy)
        group = layer.mapResource.groupLayersBy.label + ': ' 
        + ((layer.mapResource.groupLayersBy.field.indexOf('.') == -1) ? layer[layer.mapResource.groupLayersBy.field]
        : layer[layer.mapResource.groupLayersBy.field.split('.')[0]][layer.mapResource.groupLayersBy.field.split('.')[1]]);
      else
        group = layer.mapResource.name;
      var option = groupList.find(opt => { return opt.name == group});
      if (!option) {
        option = {
          name:  group,
          method: vm.toggleVisibility,
          args: [layer],
          active: layer.visible 
        }
        groupList.push(option);
      }
      else {
        option.args.push(layer);
      }
    }
  }
};
</script>

<style scoped>
.slide-menu-right {
  position: fixed;
  transform: translate(170px, 0);
  -webkit-transform: translate(170px, 0);
}

.slide-menu-left {
  position: fixed;
  transform: translate(-170px, 0);
  -webkit-transform: translate(-170px, 0);
}

.slide-menu-enter-active {
  transition: all 0.5s ease;
}

.floatingPanel {
  text-align: left;
  position: relative;
  z-index: 2;
  /* right: 9px; */
  top: 50px;
  padding: 10px;
  border-radius: 6px;
  color: white;
  font-size: 13px;
}

.leftAlign {
  left: 15px;
}

.rightAlign {
  right: 15px;
}

.blueThemeSub {
  background-color: #337ab7;
}
.darkThemeSub {
  background-color: #337ab7
}

</style>