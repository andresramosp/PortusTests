 <template>
    <div class="floatingPanel" :class="{ 'leftAlign': align == 'left', 'rightAlign': align == 'right' }" v-if="floatingOptions.length > 0">
        <div class="form-check" v-for="floatingOption in floatingOptions" :key="floatingOptions.indexOf(floatingOption)">
            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" v-model="floatingOption.active" @change="floatingOptionChanged(floatingOption)" />
                 {{ floatingOption.name }}
            </label>
        </div> 
    </div>
</template>

<script>
import MapState from "@/state/map.state";

export default {
  name: "FloatingLayerOptions",
  data() {
    return {
      align: PC.options_panel_align
    };
  },
  props: {
    mapOption: { type: Object, default: null, required: false }
  },
  computed: {
    floatingOptions() {
      var result = [];
      var vm = this;
      if (this.mapOption) {
        this.mapOption.mapResources.forEach(resId => {
          var mapResource = MapState.getMapResource(resId);
          if (mapResource.vectors) {
            result.push({
              name: "Dirección",
              type: "shiftIsoVectorial",
              resourceId: resId
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
      this[floatingOption.type](
        floatingOption.resourceId,
        floatingOption.active
      );
    },

    shiftIsoVectorial: function(mapResourceId, vectorial) {
      MapState.removeLayer(mapResourceId);
      var mapResource = MapState.getMapResource(mapResourceId);
      MapState.addTimeLineLayer(mapResource, vectorial);
    }
  }
};
</script>

<style scoped>

.floatingPanel {
  position: absolute;
  z-index: 2;
  background-color: rgba(0, 123, 255, 0.5);
  /* right: 9px; */
  /* top: 500px; */
  padding: 10px;
  border-radius: 6px;
  color: white;
  font-size: 17px;
}

.leftAlign {
  left: 9px;
  top: 520px;
}

.rightAlign {
  right: 9px;
  top: 500px;
}

</style>