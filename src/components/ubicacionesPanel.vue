 <template>
 <div class="ubicacionesPanel" :class="{ 'leftAlign': align == 'right', 'rightAlign': align == 'left', 'blueTheme': theme == 'blueTheme', 'darkTheme': theme == 'darkTheme' }">
     <span class="ubicacionesIcon" style="float: left; width: 28px; height: 28px"></span>
     <dx-autocomplete style="float: right" 
            :data-source="ubicacionesList"
            :maxItemCount="200"
            :min-search-length="1"
            :search-timeout="200"
            valueExpr="nombre"
            searchExpr="nombre"
            :placeholder="$t('{ubicacionesPlaceHolder}')"
            item-template="itemTemplate"
            @itemClick="abrirUbicacion"
            @valueChanged="checkEmptyValue"
            :show-clear-button="true"
            height="28px"
            width="270px" >

           <div slot="itemTemplate" slot-scope="item">
              <img width="27" :src="require('@/assets/icons/' + item.tipoUbicacion.toLowerCase() + '.png')" />
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
import LocationsRTWidget from "@/components/locationsWidget/locationsRTWidget.vue";

export default {
  name: "UbicacionesPanel",
   components: {
    DxAutocomplete
  },
  data() {
    return {
      align: PC.options_panel_align,
      theme: "", // PC.color_theme,
      mapState: MapState,
      ubicacionesList: null,
      defaultZoom: 6,
      marker: null,
      mapOptionActivated: null,
      predResourceActivated: null,
      waveMapResourcePrefix: 'pred-tiles-oleaje-', // + region del puerto
      waveMapOptionPrefix: 'pred_oleaje_' // + region del puerto
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

      var customIcon = L.icon({ 
        iconUrl: require('@/assets/markers/' + ubicacion.tipoUbicacion.toLowerCase() + '.png'), 
        iconSize: [30, 30], 
        iconAnchor: [0, 30],
        popupAnchor:  [15, -30] 
        });

      this.marker = L.marker([ubicacion.latitud, ubicacion.longitud], { icon: customIcon });
      this.marker.mapResource = {};

      var up = this;
      this.marker.on('click', function (e) {
        up.mapState.ubicacionSelected = null;
        up.mapState.ubicacionSelected = ubicacion;
      });
      this.marker.on('mouseover', function (e) {
        var marker = this;
        marker.timeOut = setTimeout(() => {
        marker.locationsRTComponent = new Vue({ 
            ...LocationsRTWidget, 
            propsData: { 
              locationType: ubicacion.tipoUbicacion,
              code: ubicacion.id, 
              asTooltip: true
            } }).$mount()
          marker.bindPopup(marker.locationsRTComponent.$el, {
            maxWidth: 560
          });
          marker.openPopup();
        }, 50);
      });
      this.marker.on('mouseout', function (e) {
        var marker = this;
        if (marker.timeOut) {
          clearTimeout(marker.timeOut);
        }
        marker.closePopup();
        marker.unbindPopup();
        marker.locationsRTComponent.$destroy(true);
      });
      this.marker.addTo(map);

      var latLng = new L.LatLng(ubicacion.latitud, ubicacion.longitud);
      map.flyTo(latLng, ubicacion.minZoom != -1 ? ubicacion.minZoom : this.defaultZoom);

      if (ubicacion.tipoUbicacion == UbicacionType.PUERTO) {
        setTimeout(() => {
          this.addPrediction(ubicacion);
        }, 2000);
        
      }

      this.mapState.ubicacionSelected = ubicacion;
      
    },

    checkEmptyValue(ev) {
      if (!ev.value) {
        if (this.marker) {
          this.marker.remove();
        }
        this.removePrediction();
        this.mapState.ubicacionSelected = null;
      }
    },

    addPrediction(ubicacion) {
        // this.predResourceActivated = this.mapState.getMapResource(this.waveMapResourcePrefix + ubicacion.region.toLowerCase());
        // this.predResourceActivated.oldVectorsValue = this.predResourceActivated.defaultVectors;
        // this.predResourceActivated.defaultVectors = true;

        this.mapOptionActivated = this.mapState.getMapOption(this.waveMapOptionPrefix + ubicacion.region.toLowerCase());
        this.mapOptionActivated.mapResources.forEach(resId => {
            var mapResource = MapState.getMapResource(resId);
            if (mapResource.type == "TimeLineLayer") {
               mapResource.oldVectorsValue = mapResource.defaultVectors;
               mapResource.defaultVectors = true;
            }
        });
        this.mapState.setMapOption(this.mapOptionActivated.id, true);
       
    },

    removePrediction() {
        if (this.mapOptionActivated) {
          this.mapState.setMapOption(this.mapOptionActivated.id, false);
          this.mapOptionActivated.mapResources.forEach(resId => {
            var mapResource = MapState.getMapResource(resId);
            if (mapResource.type == "TimeLineLayer") {
                mapResource.defaultVectors = mapResource.oldVectorsValue;
            }
          });

          this.mapOptionActivated = null;

          //this.predResourceActivated.defaultVectors = this.predResourceActivated.oldVectorsValue;

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
  /* left: 50px; */
  left: 250px;
}

.rightAlign {
  right: 250px;
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