 <template>

   <dx-popup
      v-if="ubicacion"
      :visible="true"
      :resize-enabled="true"
      :drag-enabled="true"
      :close-on-outside-click="true"
      :show-title="true"
      :width="1000"
      :height="545"
      :shading="false"
      class="popup"
      :title="titulo"
      @hidden="cerrar"
    >
      
     <!-- <dx-toolbar-item
        text="Title"
        location="before" /> -->

      <b-row>
        <b-col >
          <b-row>
            <b-col>
               <LocationsRTWidget :locationType='ubicacion.tipoUbicacion' :code="ubicacion.id" />
            </b-col>
          </b-row>
           <b-row style="margin-top: 5px">
              <b-col>
              <LocationsPredWidget :locationType='ubicacion.tipoUbicacion' :code="ubicacion.id" />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div style="width: 420px">
                   <img :src="defaultLogo" style="margin-top: 5px; float: right" />
                  <img :src="'/images/logos/logoaemetSm.png'" style="margin-top: 5px; float: right" />
              </div>
            </b-col>
          </b-row>
        </b-col>
          <b-col>
            <!-- Gráficas -->
        </b-col>
      </b-row>

    </dx-popup>


</template>

<script>

import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';
import LocationsRTWidget from "@/components/locationsWidget/locationsRTWidget.vue";
import LocationsPredWidget from "@/components/locationsWidget/locationsPredWidget.vue";

export default {
  name: "LocationsWidget",
   components: {
    DxPopup,
    DxToolbarItem,
    LocationsRTWidget,
    LocationsPredWidget
  },
  data() {
    return {
      defaultLogo: PC.default_map_logo,
      align: PC.options_panel_align,
      theme: PC.color_theme,
      mapState: MapState,
      titulo: ''
    };
  },
   props: {
    ubicacion: { type: Object, default: null }
  },
  watch: {
    ubicacion: function() {
      if (this.ubicacion != null) {
        // TODO: puerto / localidad de...
        this.titulo = 'Previsiones y estado actual del mar en ' + this.ubicacion.nombre;
      }
    }
  },
  created() {

  },
  mounted() {
     
  },
  methods: {
    cerrar() {
      MapState.ubicacionSelected = null;
    }
  }
};
</script>

<style scoped>


</style>