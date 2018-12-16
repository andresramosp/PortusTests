 <template>

   <dx-popup
      v-if="ubicacion"
      :visible="true"
      :resize-enabled="true"
      :drag-enabled="true"
      :close-on-outside-click="false"
      :show-title="true"
      :width="1020"
      :height="553"
      :shading="false"
      :title="titulo"
      class="popup"
      @hidden="cerrar"
      title-template="titleTemplate"
    >
      
       <div slot="titleTemplate" slot-scope="title" style="font-size: 15px; background: #606060; color: white">
            {{titulo}} 
           <span @click="cerrar" style="float:right; cursor:pointer">x</span>
           <img :src='require("@/assets/icons/shareIcon.png")' class="shareIcon" @click="openShareInfo" />
        </div>

      <b-row>
        <b-col cols="5">
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
            <LocationsGraphsWidget :locationType='ubicacion.tipoUbicacion' :code="ubicacion.id" />
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
import LocationsGraphsWidget from "@/components/locationsWidget/locationsGraphsWidget.vue";

export default {
  name: "LocationsWidget",
   components: {
    DxPopup,
    DxToolbarItem,
    LocationsRTWidget,
    LocationsPredWidget,
    LocationsGraphsWidget
  },
  data() {
    return {
      defaultLogo: PC.default_map_logo,
      align: PC.options_panel_align,
      theme: PC.color_theme,
      mapState: MapState,
      titulo: '',
      shareUrl: '{baseUrl}/locationsWidget?locale={locale}&code={code}',
      iFrameCode: "<iframe width='1040' height='570' src='{shareUrl}' frameborder='0' />"
    };
  },
   props: {
    ubicacion: { type: Object, default: null }
  },
  watch: {
    ubicacion: function() {
      if (this.ubicacion != null) {
        // TODO: puerto / localidad de...
        this.titulo = this.$t('{locationsWidgetTitle1}')
        // + this.ubicacion.tipoUbicacion.toLowerCase() 
        // + ' de ' 
        + ' ' + this.ubicacion.nombre
        + '. ' +  this.$t('{locationsWidgetTitle2}');
      }
    }
  },
  created() {

  },
  mounted() {
     
  },
  methods: {
    openShareInfo() {
        var routeData = this.$router.resolve({ path: '/locationsWidget', 
          query: 
          { 
            locale: this.$getLocale(),
            code: this.ubicacion.id
          }
        });
        window.open(routeData.href, '_blank');
    },
    cerrar() {
      MapState.ubicacionSelected = null;
    }
  }
};
</script>

<style scoped>


.shareIcon {
  margin-top: 2px;
  float: right;
  cursor: pointer;
  width: 19px;
  margin-right: 6px;
}

</style>