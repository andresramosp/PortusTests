 <template>
 <div class="ubicacionesPanel" :class="{ 'leftAlign': align == 'right', 'rightAlign': align == 'left', 'blueTheme': theme == 'blueTheme', 'darkTheme': theme == 'darkTheme' }">
     <img :src="require('@/assets/icons/regiones.png')" width="27" style="float: left;" />
     <dx-select-box  style="float: right" 
            :items="regionesList"
            display-expr="nombre"
            value-expr="id"
            @itemClick="abrirRegion"
             @valueChanged="checkEmptyValue"
            :show-clear-button="true"
            placeholder="Regions"
            width="150px"
            item-template="itemTemplate"
            >

            <div slot="itemTemplate" slot-scope="item">
              <span style="font-size: 14px; margin-left: 5px">{{ item.nombre }}</span>
            </div>

     </dx-select-box>
 </div>
</template>

<script>

import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import { DxSelectBox } from 'devextreme-vue/';


export default {
  name: "RegionesPanel",
   components: {
    DxSelectBox
  },
  data() {
    return {
      align: PC.options_panel_align,
      theme: "", // PC.color_theme,
      mapState: MapState,
      regionesList: null
    };
  },
  created() {
      this.getRegiones();
  },
  mounted() {
     
  },
  methods: {

    async getRegiones() {
      var result = this.regionesList || await ApiService.get('zonas/' + '?locale=' + this.$getLocale());
      this.regionesList = result.data;
    },

    abrirRegion(ev) {
      var region = ev.itemData;
      var latLng = new L.LatLng(region.latitud, region.longitud);
      this.mapState.getMap().flyTo(latLng, region.zoom);
    
    },

    checkEmptyValue(ev) {
      if (!ev.value) {
          var mapExtent = PC.map_initial_bounds;
          var bounds = new L.LatLngBounds(
            new L.LatLng(mapExtent[1], mapExtent[0]),
            new L.LatLng(mapExtent[3], mapExtent[2])
          );
          this.mapState.getMap().flyToBounds(bounds);
      }
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
  top: 0px;
  padding: 10px;
  border-radius: 0px;
  color: white;
  font-size: 13px;
}

.leftAlign {
  left: 415px;
}

.rightAlign {
  right: 415px;
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