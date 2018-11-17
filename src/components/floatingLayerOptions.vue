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
      theme: PC.color_theme
    };
  },
  props: {
    mapOption: { type: Object, default: null, required: false }
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
      var multiLayer = this.mapOption.mapResources.length > 1;
      if (this.mapOption) {
        this.mapOption.mapResources.forEach(resId => {
          var mapResource = MapState.getMapResource(resId);
          if (mapResource.vectors) {
            result.push({
              name: "Dirección",
              method: vm.toggleVectorial,
              resourceId: resId,
              active: mapResource.defaultVectors
            });
          }
          if (multiLayer) {
            result.push({
              name:  mapResource.name,
              method: vm.toggleVisibility,
              resourceId: resId,
              active: mapResource.unchecked ? false : true
            });
          }
        });

        return result;
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    floatingOptionChanged: function(floatingOption) {
      floatingOption.method(floatingOption.resourceId, floatingOption.active);
    },

    toggleVectorial: function(mapResourceId, vectorial) {
      MapState.removeLayer(mapResourceId);
      var mapResource = MapState.getMapResource(mapResourceId);
      MapState.addTimeLineLayer(mapResource, vectorial);
    },
    
    toggleVisibility: function(mapResourceId, visible) {
      if (visible) {
        // && !MapState.hasLayer...
        // Buscar si entre las floatingOptions hay un toggleVectorial, y si está activo, enviarlo en caso de TimeLineLayer
        // (Si no, al quitar y poner el layer, no respeta los vectores. Otra forma sería desactivar vectores automáticamente)
        var mapResource = MapState.getMapResource(mapResourceId);
        if (mapResource.type == "MarkerLayer")
          MapState.addMarkerLayer(mapResource, this.mapOption);
        if (mapResource.type == "TimeLineLayer")
          MapState.addTimeLineLayer(mapResource); // segundo parámetro con model del check de dirección
      } else {
        MapState.removeLayer(mapResourceId);
      }
    },

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
  top: 500px;
  padding: 10px;
  border-radius: 6px;
  color: white;
  font-size: 17px;
}

.leftAlign {
  left: 12px;
}

.rightAlign {
  right: 12px;
}

.blueTheme {
  background-color: rgba(0, 123, 255, 0.6);
}

.greenTheme {
  background-color: rgba(0, 255, 0, 0.6);
}
</style>