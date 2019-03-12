 <template>
 <div v-if="subMenuOptions.length > 0" 
      class="subMenu" 
      :class="{ 
        'subMenuLeft': !minimized && align == 'left',
        'subMenuLeftMin': minimized  && align == 'left',
        'subMenuRight': !minimized && align == 'right',
        'subMenuRightMin': minimized  && align == 'right'}" >
   <div >
      <transition appear :appear-class="appearClass" appear-to-class="slide-menu-enter-active">
        <div class="floatingPanel fadeIn"  :class="{ 
            'predicciones': mapOptionGroup.id == 'predicciones',
            'tiempo_real': mapOptionGroup.id == 'tiempo_real',
            'historico': mapOptionGroup.id == 'historico',
            'singlePanel': selectCombos.length == 0,
            'selectPanel': selectCombos.length > 0,
            'floatingPanelWidth': !isIE,
            'floatingPanelWidthIE': isIE
          }">
          <!-- Ojo: ahora mismo solo aceptaría un combo por subMenu. Poner v-for si se quiere soportar más -->
          <b-form-select v-if="selectCombos.length > 0" text-field="name" value-field="name" :options="subMenuOptions.filter(opt => opt.comboSelectId)" @change="setComboLayersVisibility" v-model="selectedOption" class="select-layers">
          </b-form-select>
          <div style="padding: 7px; display: inline-block">
               <div v-for="floatingOption in subMenuOptions.filter(opt => !opt.comboSelectId)" :key="subMenuOptions.indexOf(floatingOption)">
                  <label class="form-check-label unselectable">
                    <img style="" width="16" :src="floatingOption.active ? require('@/assets/icons/check_activo.png') : require('@/assets/icons/check_inactivo.png')" >
                    <input class="form-check-input" style="display: none" type="checkbox" v-model="floatingOption.active" @change="checkOptionChanged(floatingOption)" />
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
    minimized: { type: Boolean }
  },
  data() {
    return {
      align: PC.options_panel_align,
      isIE: PC.isIE,
      mapState: MapState,
      selectedOption: null,
      subMenuOptions: []
    };
  },
  computed: {
    selectCombos() {
      var combos = this.subMenuOptions
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
      'mapState.preloadedTimeLineLayers': function () {
        this.getOptions();
      },
      'mapState.preloadedMarkers': function () {
        this.getOptions();
      },
      // Aunque las opciones de cada subMenu son locales al componente, guardamos 
      // una referencia en el MapState para que éste pueda consultar las opciones activas.
      subMenuOptions: function() {
        this.mapState.subMenusTracker[this.mapOptionGroup.id] = this.subMenuOptions;
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
          var theOnlyMapResource = MapState.getMapResource(opt.mapResources[0]);
          if (opt.mapResources.length > 1 || theOnlyMapResource.subOption || theOnlyMapResource.groupLayersBy) {
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
      this.subMenuOptions = result;

    },

    setComboLayersVisibility: function(value) {
      this.subMenuOptions.filter(opt => opt.comboSelectId).forEach(opt => {
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
      var optionName, type;
      var comboSelectId = null;
      if (layer.mapResource.comboSelect) {
          optionName = layer.mapResource.groupLayersBy ? layer[layer.mapResource.groupLayersBy.field] : layer.mapResource.name;
          comboSelectId =  layer.mapResource.comboSelect.id;
          type = "comboSelectOption";
      }
      else {
          if (layer.mapResource.groupLayersBy) {
              optionName = layer.mapResource.groupLayersBy.label + ': ' 
              + ((layer.mapResource.groupLayersBy.field.indexOf('.') == -1) ? layer[layer.mapResource.groupLayersBy.field]
              : layer[layer.mapResource.groupLayersBy.field.split('.')[0]][layer.mapResource.groupLayersBy.field.split('.')[1]]);
              type = "groupedOption"
          }
          else if (layer.mapResource.subOption) {
              optionName = layer.mapResource.subOption;
              type = "subOption";
          }
          else {
            optionName = layer.mapResource.name;
            type = "singleOption";
          }
      }
      
      var option = groupList.find(opt => { return opt.name == optionName});
      if (!option) {
        option = {
          name:  optionName,
          layers: [layer],
          active: layer.visible,
          type: type,
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

.subMenu {
  position: absolute;
  /* left: 330px */
}

.subMenuLeft {
 left: 330px
}

.subMenuLeftMin {
 left: 84px
}

.subMenuRight {
 right: 330px
}

.subMenuRightMin {
 right: 84px
}

.floatingPanel {
  text-align: left;
  /* position: relative; */
  z-index: 2;
  /* right: 9px; */
  padding: 0px;
  border-radius: 0px;
  color: white;
  font-size: 13px;
  min-width: 100px;
}

.floatingPanelWidth {
   width: max-content;
}

.floatingPanelWidthIE {
   width: 130px;
}

.singlePanel {
  margin-top: 45px;
  
}

.selectPanel {
   margin-top: 10px;
}

select {
  /* width: 100%; */
}


.select-layers {
  height: 30px !important;
  border-radius: 0px;
  padding-right: 5px;
  padding-top: 2px;
  margin-bottom: 5px;
  display: block;
}

</style>