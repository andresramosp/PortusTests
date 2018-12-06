 <template>
 <div class="ubicacionesPanel blueTheme leftAlign">
    <div id="autocomplete" />
 </div>
</template>

<script>

import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";

export default {
  name: "UbicacionesPanelJQ",
  data() {
    return {
      align: PC.options_panel_align,
      theme: PC.color_theme,
      mapState: MapState,
      ubicacionesList: [],
      ubicaciones: [],
      ubicacion: {}
    };
  },
  created() {
    this.getUbicaciones();
    jQuery( "#autocomplete" ).autocomplete({
      source: this.ubicacionesList
    });
  },
  mounted() {
     
  },
  methods: {

    getSelected() {
      console.log('getSelected', this.ubicacion.nombre);
    },

    async getUbicaciones() {
      var result = await ApiService.get('ubicaciones/');
      this.ubicacionesList = result.data;
    }

    
  }
};
</script>

<style scoped>

.md-menu-content {
  background-color: rgba(0, 123, 255, 0.6) !important;
}

.ubicacionesPanel {
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