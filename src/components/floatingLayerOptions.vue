 <template>
 <div>
    <transition appear :appear-class="appearClass" appear-to-class="slide-menu-enter-active">
      <div v-if="floatingOptions.length > 0" class="floatingPanel"  :class="{ 'leftAlign': align == 'left', 'rightAlign': align == 'right', blueTheme: theme == 'blueTheme', greenTheme: theme == 'greenTheme' }">
        <div class="form-check" v-for="floatingOption in floatingOptions" :key="floatingOptions.indexOf(floatingOption)">
           <label class="form-check-label">
             <input class="form-check-input" type="checkbox" v-model="floatingOption.active" @change="floatingOptionChanged(floatingOption)" />
               {{ $t(floatingOption.name) }}
            </label>
        </div> 
         <div class="form-check" v-if="vectorsOption" >
           <label class="form-check-label">
             <input class="form-check-input" type="checkbox" v-model="vectorsOption.active" @change="floatingOptionChanged(vectorsOption)" />
               {{ $t(vectorsOption.name) }}
            </label>
        </div> 
      </div>
     
   </transition>
 </div>
</template>

<script>
import MapState from "@/state/map.state";

export default {
  name: "FloatingLayerOptions",
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

    vectorsOption() {
      // TODO: sacar solo el primero, o devolver lista
      var result = null;
      var vm = this;
      this.mapState.activeMapOptions.forEach(opt => {
         opt.mapResources.forEach(resId => {
            var mapResource = MapState.getMapResource(resId);
            if (mapResource.vectors) {
              result = {
                name: "Dirección",
                method: vm.toggleVectorial,
                args: resId,
                active: mapResource.defaultVectors
              };
            }
        });
      })
      return result;
      
    },

    floatingOptions() {

      var result = [];
      var vm = this;

      this.mapState.getActiveMapOptions().forEach(opt => {
          if (opt.mapResources.length > 1 || opt.mapResources[0].groupLayersBy) {
            opt.mapResources.forEach(resId => {
                var layersResouce = vm.mapState.getActiveLayers().filter(l => l.mapResource.id == resId)
                layersResouce.forEach(layer => {
                  vm.addLayerToGroup(layer, result);
                })
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

    toggleVectorial: function(mapResourceId, vectorial) {
      MapState.removeLayer(mapResourceId);
      var mapResource = MapState.getMapResource(mapResourceId);
      MapState.addTimeLineLayer(mapResource, vectorial);
    },
    
    toggleVisibility: function(layers, visible) {
      layers.forEach(l => {
        l.visible = visible;
      })      
      MapState.setVisibleTimeLineLayers();
      MapState.setVisibleMarkerLayers();
    },

    addLayerToGroup(layer, groupList) {
      var vm = this;
      var group;
      if (layer.mapResource.groupLayersBy)
        group = layer.mapResource.groupLayersBy.label + ': ' + layer[layer.mapResource.groupLayersBy.field];
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
  position: absolute;
  z-index: 2;
  /* right: 9px; */
  top: 20px;
  padding: 10px;
  border-radius: 6px;
  color: white;
  font-size: 13px;
}

.leftAlign {
  left: 350px;
}

.rightAlign {
  right: 350px;
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
</style>