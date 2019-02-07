 <template>
  <dx-popup
    v-if="ubicacion"
    :visible="true"
    :position="popupPosition"
    :resize-enabled="false"
    :drag-enabled="true"
    :close-on-outside-click="false"
    :show-title="true"
    :width="popupWidth"
    :height="popupHeight"
    :shading="false"
    :title="titulo"
    class="popup"
    @hidden="cerrar"
    title-template="titleTemplate"
  >
    <div
      slot="titleTemplate"
      slot-scope="title"
      class="popupHeader"
    >
        {{titulo}}
      
        <img
        :src='require("@/assets/icons/x.png")'
        class="closeIcon"
        @click="cerrar"
      >
   
       <ShareInfoPanel
          v-if="routeData"
          :routeData="routeData"
          style="float: right; margin-right: 6px; margin-top: -1px"
          position="bottomLeft"
          :imgWidth="20"
          panelWidth="790px"
          :offsetX="0"
          iconColor="white"
          @opening="showingShareInfo = true"
          @closing="showingShareInfo = false"
          :iFrameWidth="1040"
          :iFrameHeight="570"
        />

    <!-- <span @click="toggleMinimized" style="float:right; cursor:pointer">_</span> -->
       <!-- <img
        :src='require("@/assets/icons/minimize.png")'
        class="minimizeIcon"
        @click="toggleMinimized"
      > -->

    </div>

    <b-row v-show="!displayShareInfo" class="simoPanel" :class="[showingShareInfo ? 'blur' : '']">
      <b-col :cols="!minimized ? 5 : 12">
        <b-row>
          <b-col>
            <LocationsRTWidget :locationType="ubicacion.tipoUbicacion" :code="ubicacion.id"/>
          </b-col>
        </b-row>
        <b-row style="margin-top: 5px">
          <b-col>
            <LocationsPredWidget :locationType="ubicacion.tipoUbicacion" :code="ubicacion.id"/>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div style="width: 420px">
              <img :src="defaultLogo" style="margin-top: 5px; float: right">
              <img :src="'/images/logos/logoaemetSm.png'" style="margin-top: 5px; float: right">
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col>
        <LocationsGraphsWidget v-if="!minimized" :locationType="ubicacion.tipoUbicacion" :code="ubicacion.id"/>
      </b-col>
    </b-row>
  </dx-popup>
</template>

<script>
import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
import LocationsRTWidget from "@/components/locationsWidget/locationsRTWidget.vue";
import LocationsPredWidget from "@/components/locationsWidget/locationsPredWidget.vue";
import LocationsGraphsWidget from "@/components/locationsWidget/locationsGraphsWidget.vue";
import ShareInfoPanel from "@/components/shareInfoPanel.vue";

export default {
  name: "LocationsWidget",
  components: {
    DxPopup,
    DxToolbarItem,
    LocationsRTWidget,
    LocationsPredWidget,
    LocationsGraphsWidget,
    ShareInfoPanel
  },
  data() {
    return {
      defaultLogo: PC.default_map_logo,
      align: PC.options_panel_align,
      theme: "", // PC.color_theme,
      mapState: MapState,
      titulo: "",
      displayShareInfo: false,
      routeData: null,
      minimized: false,
      showingShareInfo: false
      // popupWidth: 1020,
      // popupHeight: 553,
      // popupPosition: 'center'
    };
  },
  props: {
    ubicacion: { type: Object, default: null }
  },
  computed: {
    popupWidth() {
      return this.minimized ? 453 : 1020;
    },
    popupHeight() {
      return this.minimized ? 528 : 551;
    },
    popupPosition() {
      return this.minimized ? (this.align == 'left' ? 'right bottom' : 'left bottom') : 'center';
    }
  },
  watch: {
    ubicacion: function() {
      if (this.ubicacion != null) {

        this.titulo =
          this.$t("{locationsWidgetTitle1}") +
          // + this.ubicacion.tipoUbicacion.toLowerCase()
          // + ' de '
          " " +
          this.ubicacion.nombre +
          ". " //+
          // this.$t("{locationsWidgetTitle2}");

        this.routeData = this.$router.resolve({
          path: "/locationsWidget",
          query: {
            locale: this.$getLocale(),
            code: this.ubicacion.id
          }
        });
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    cerrar() {
      MapState.ubicacionSelected = null;
      if (this.minimized)
        this.toggleMinimized();
    },

    toggleMinimized() {
      this.minimized = !this.minimized;
    }
  }
};
</script>

<style scoped>


.shareInfoCenter {
    margin-top: 150px;
    width: 80%;
    margin-left: 100px;
}

.minimizeIcon {
  margin-top: 3px;
  float: right;
  cursor: pointer;
  width: 17px;
  margin-right: 6px;
}


</style>