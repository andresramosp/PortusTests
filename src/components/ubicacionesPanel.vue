 <template>
 <div class="ubicacionesPanel" :class="{ 'leftAlign': align == 'right', 'rightAlign': align == 'left', 'blueTheme': true }">
     <img :src="require('@/assets/icons/localidad.png')" style="float: left; margin-right: 5px" />
     <dx-autocomplete style="float: right" 
            :data-source="ubicacionesList"
            :maxItemCount="200"
            :min-search-length="1"
            :search-timeout="200"
            valueExpr="nombre"
            searchExpr="nombre"
            placeholder="Búsqueda de localidades, puertos y playas..."
            item-template="itemTemplate"
            @itemClick="abrirUbicacion"
            @valueChanged="checkValue"
            width="300px" >

           <div slot="itemTemplate" slot-scope="item">
              <img :src="require('@/assets/icons/' + item.tipoUbicacion.toLowerCase() + '.png')" />
              <span style="font-size: 14px; margin-left: 5px">{{ item.nombre }}</span>
            </div>
            
      </dx-autocomplete>
 </div>
</template>

<script>

import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import { DxAutocomplete } from 'devextreme-vue/autocomplete';
import { UbicacionType } from "@/common/enums";
import Vue from 'vue';


export default {
  name: "UbicacionesPanel",
   components: {
    DxAutocomplete
  },
  data() {
    return {
      align: PC.options_panel_align,
      theme: PC.color_theme,
      mapState: MapState,
      ubicacionesList: null,
      defaultZoom: 6,
      marker: null,
      mapOptionActivated: null
    };
  },
  created() {
      this.getUbicaciones();
  },
  mounted() {
     
  },
  methods: {

    async getUbicaciones() {
      var result = this.ubicacionesList || await ApiService.get('ubicaciones/');
      this.ubicacionesList = result.data;
    },

    abrirUbicacion(ev) {

      var map = this.mapState.getMap()
      var ubicacion = ev.itemData;

      if (this.marker) {
        this.marker.remove();
      }

      this.removePrediction();

      var customIcon = L.icon({ iconUrl: require('@/assets/markers/' + ubicacion.tipoUbicacion.toLowerCase() + '.png'), iconSize: [30, 30], iconAnchor: [15, 30] });
      this.marker = L.marker([ubicacion.latitud, ubicacion.longitud], { icon: customIcon });
      this.marker.addTo(map);
      var latLng = new L.LatLng(ubicacion.latitud, ubicacion.longitud);
      map.flyTo(latLng, ubicacion.minZoom != -1 ? ubicacion.minZoom : this.defaultZoom);

      if (ubicacion.tipoUbicacion == UbicacionType.PUERTO) {
        this.addPrediction(ubicacion);
      }
      
    },

    checkValue(ev) {
      if (!ev.value) {
        if (this.marker) {
          this.marker.remove();
        }
        this.removePrediction();
      }
    },

    addPrediction(ubicacion) {
        this.mapOptionActivated = this.mapState.mapOptions.find(m => m.id == 'pred_oleaje_' + ubicacion.region.toLowerCase());
        if (!this.mapOptionActivated.active) {
          Vue.set(this.mapOptionActivated, 'active', true);
          this.mapOptionActivated.mapResources.forEach(resId => {
              var mapResource = this.mapState.getMapResource(resId);
              if (mapResource.type == "MarkerLayer")
                this.mapState.addMarkerLayer(mapResource, this.mapOptionActivated);
              if (mapResource.type == "TimeLineLayer")
                this.mapState.addTimeLineLayer(mapResource, true);
          });
        }
       
    },

    removePrediction() {
        if (this.mapOptionActivated) {
          Vue.set(this.mapOptionActivated, 'active', false);
          this.mapOptionActivated.mapResources.forEach(resId => {
            MapState.removeLayer(resId);
          });
          this.mapOptionActivated = null;
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
  top: 8px;
  padding: 10px;
  border-radius: 6px;
  color: white;
  font-size: 13px;
}

.leftAlign {
  left: 50px;
}

.rightAlign {
  right: 50px;
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