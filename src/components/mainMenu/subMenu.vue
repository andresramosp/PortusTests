 <template>
 <div v-if="floatingOptions.length > 0">
   <div class="darkThemeSub">
      <transition appear :appear-class="appearClass" appear-to-class="slide-menu-enter-active">
        <div class="floatingPanel fadeIn"  :class="{ 
            'leftAlign': align == 'left', 
            'rightAlign': align == 'right', 
            'predicciones': mapOptionGroup.id == 'predicciones',
            'tiempo_real': mapOptionGroup.id == 'tiempo_real',
            'historico': mapOptionGroup.id == 'historico',
            'singlePanel': selectCombos.length == 0,
            'selectPanel': selectCombos.length > 0
          }">
          <!-- <select v-for="selectComboId in selectCombos" :key="selectComboId" v-model="selectedOption" @change="setComboLayersVisibility()">
             <option :value="floatingOption" v-for="floatingOption in floatingOptions.filter(opt => opt.comboSelectId == selectComboId)" :key="floatingOptions.indexOf(floatingOption)">
               {{ $t(floatingOption.name) }}
             </option>
          </select> -->
          <!-- Ojo: ahora mismo solo aceptaría un combo por subMenu. Poner v-for como arriba para soportar más -->
          <b-form-select v-if="selectCombos.length > 0" text-field="name" value-field="name" :options="floatingOptions.filter(opt => opt.comboSelectId)" @change="setComboLayersVisibility" v-model="selectedOption" class="select-layers">
          </b-form-select>
          <div style="padding: 7px">
               <div class="form-check" v-for="floatingOption in floatingOptions.filter(opt => !opt.comboSelectId)" :key="floatingOptions.indexOf(floatingOption)">
                  <label class="form-check-label unselectable">
                    <input class="form-check-input" type="checkbox" v-model="floatingOption.active" @change="checkOptionChanged(floatingOption)" />
                      {{ $t(floatingOption.name) }}
                  </label>
              </div> 
          </div>
       
        </div>
      </transition>
   </div>
   
   
 </div>
</template>

<script>

import MapState from "@/state/map.state";

export default {
  name: "SubMenu",
  props: {
    mapOptionGroup: { type: Object, default: null, required: false },
    preloadedTimeLineLayers: { type: Array },
    preloadedMarkers: { type: Array}
  },
  data() {
    return {
      align: PC.options_panel_align,
      theme: PC.color_theme,
      mapState: MapState,
      selectedOption: null,
      floatingOptions: []
    };
  },
  computed: {
    selectCombos() {
      var combos = this.floatingOptions
        .filter(m => m.comboSelectId)
        .map(m => {
          return m.comboSelectId;
        })
        .filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
      return combos;
    },
    appearClass() {
      return PC.options_panel_align == "right"
        ? "slide-menu-right"
        : "slide-menu-left";
    },
   
  },
  watch: {
      preloadedTimeLineLayers: function () {
        this.getOptions();
      },
      preloadedMarkers: function () {
        this.getOptions();
      }
    },
  created() {},
  mounted() {},
  methods: {

    getOptions() {

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
      // Marcamos la opción pre-seleccionada del combo
      var selectedOption = result.find(opt => opt.comboSelectId && opt.active);
      if (selectedOption)
        this.selectedOption = selectedOption.name;
      this.floatingOptions = result;

    },

    setComboLayersVisibility: function(value) {
      this.floatingOptions.filter(opt => opt.comboSelectId).forEach(opt => {
        this.setLayersVisibility(opt.layers, opt.name == value);
      });
      
    },

    checkOptionChanged: function(floatingOption) {
      this.setLayersVisibility(floatingOption.layers, floatingOption.active);
    },

    setLayersVisibility: function(layers, visible) {
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
      var optionName;
      var comboSelectId = null;
      if (layer.mapResource.comboSelect) {
          optionName = layer.mapResource.groupLayersBy ? layer[layer.mapResource.groupLayersBy.field] : layer.mapResource.name;
          comboSelectId =  layer.mapResource.comboSelect.id;
      }
      else {
          if (layer.mapResource.groupLayersBy) {
              optionName = layer.mapResource.groupLayersBy.label + ': ' 
              + ((layer.mapResource.groupLayersBy.field.indexOf('.') == -1) ? layer[layer.mapResource.groupLayersBy.field]
              : layer[layer.mapResource.groupLayersBy.field.split('.')[0]][layer.mapResource.groupLayersBy.field.split('.')[1]]);
          }
          else {
            optionName = layer.mapResource.name;
          }
      }
      
      var option = groupList.find(opt => { return opt.name == optionName});
      if (!option) {
        option = {
          name:  optionName,
          layers: [layer],
          active: layer.visible,
          comboSelectId: comboSelectId
        }
        groupList.push(option);
      }
      else {
        option.layers.push(layer);
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
  padding: 0px;
  border-radius: 0px;
  color: white;
  font-size: 13px;
  min-width: 120px;
}

.singlePanel {
  top: 50px;
}

.selectPanel {
  top: 12px;
}

select {
  width: 100%;
}

.leftAlign {
  left: 15px;
}

.rightAlign {
  right: 15px;
}

.select-layers {
  height: 30px !important;
  border-radius: 0px;
  padding-right: 5px;
  padding-top: 2px;
  margin-bottom: 5px;
}

</style>