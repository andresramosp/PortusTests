 <template>
 <div class="ubicacionesPanel blueTheme leftAlign">
      <div class="dx-fieldset">
      <div class="dx-fieldset-header">With Custom Search Options</div>
      <div class="dx-field">
        <div class="dx-field-value">
          <dx-autocomplete
            :data-source="ubicacionesList"
            :value.sync="city"
            value-expr="id"
            :maxItemCount="100"
            :min-search-length="1"
            :search-timeout="500"
            searchExpr="nombre"
            placeholder="Type two symbols to search..."
            item-template="stateTemplate"
          >

           <div slot="stateTemplate" slot-scope="data" >
              <span>{{ data.tipoUbicacion }} ({{ data.nombre }})</span>
            </div>
            
          </dx-autocomplete>
        </div>
      </div>
    </div>

 </div>
</template>

<script>

import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import { DxAutocomplete } from 'devextreme-vue/autocomplete';


export default {
  name: "UbicacionesPanelJQ",
   components: {
    DxAutocomplete
  },
  data() {
    return {
      align: PC.options_panel_align,
      theme: PC.color_theme,
      mapState: MapState,
      ubicacionesList: [],
      city: ''
    };
  },
  created() {
      this.getUbicaciones();
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