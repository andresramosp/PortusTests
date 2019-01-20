<template>
<!-- <b-modal v-model="modalShow" v-if="markers && markers.length > 0" @hidden="onHidden" size="lg" :title="modalTitle"> -->

 <dx-popup
    v-if="markers && markers.length > 0"
    :visible="true"
    :position="{ at: 'center', offset: '0 -80' }"
    :resize-enabled="false"
    :drag-enabled="true"
    :close-on-outside-click="false"
    :show-title="true"
    width="700"
    height="auto"
    :shading="false"
    :title="modalTitle"
    class="popup"
    @hidden="cerrar"

  >

    <b-tabs class='infoPanelClass' >
        <b-tab v-if="!esAntena()" :title="$t('{accesoADatosTab}')" active>
            <BancoDatosHistoricoTab v-if="esHistorico()" :markers="markers" /> 
            <BancoDatosTab v-else :markers="mapState.markersSelected" /> 
        </b-tab>
        <b-tab :title="$t('{informacionTab}')">
            <InformacionTab :markers="mapState.markersSelected" />
        </b-tab>
        <b-tab v-if="esBoya() && !esHistorico()" :title="'Ultimas posiciones'" >
            <LastPositionsTab :boya="markerRef" />
        </b-tab>
         <b-tab v-else-if="esMareografo()" :title="'Ceros - Referencias'" >
            <CeroRefsTab :mareografo="markerRef" /> 
        </b-tab>
      </b-tabs>

      <div class="footer">
         <dx-button class="footerButton" :text="$t('{cerrarButton}')" width="80" height="30" type="default" @click="cerrar" />
      </div>

 </dx-popup>

   
<!-- </b-modal> -->
</template>

<script>

import { MarkerClass } from "@/common/enums";
import MapState from "@/state/map.state";
import MapUtils from "@/services/map.utils";
import InformacionTab from "@/components/markerPanel/informacionTab.vue"
import BancoDatosTab from "@/components/markerPanel/bancoDatosTab.vue"
import BancoDatosHistoricoTab from "@/components/markerPanel/bancoDatosHistoricoTab.vue"
import LastPositionsTab from "@/components/markerPanel/lastPositionsTab.vue"
import CeroRefsTab from "@/components/markerPanel/ceroRefsTab.vue"
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
import DxButton from "devextreme-vue/button";

export default {
  name: "MarkerPanel",
  components: {
    InformacionTab,
    BancoDatosTab,
    LastPositionsTab,
    BancoDatosHistoricoTab,
    CeroRefsTab,
    DxPopup, 
    DxToolbarItem,
    DxButton
  },
  props: {
    markers: { type: Array, default: [], required: false }
  },
  data() {
    return {
      mapState: MapState,
      markerRef: null,
      modalShow: false
    };
  },
  computed: {
    modalTitle() {
        if (this.markerRef.mapResource.markerClass == MarkerClass.Ubicacion) {
            return this.$t("{tipoUbicacion"+this.markerRef.tipoUbicacion+"}") + ": " + this.markerRef.nombre;
        }
        else if (this.markerRef.mapResource.markerClass == MarkerClass.PuntoMalla) {
            return "Pred. " +  this.$t(this.markerRef.mapOption.name) + ": " + MapUtils.getMarkerName(this.markerRef);
        }
        else if (this.markerRef.mapResource.markerClass == MarkerClass.PuntoMallaVerif) {
           return this.$t("{verificacionInfo}") + ": " + this.markerRef.nombre;
        }
        else if (this.markerRef.mapResource.markerClass == MarkerClass.EstacionRT 
              || this.markerRef.mapResource.markerClass == MarkerClass.EstacionHist) {
            return this.markerRef.nombre;
        }
        else if (this.markerRef.mapResource.markerClass == MarkerClass.PuntoMallaHist) {
           return this.$t("{puntoSimarLabel}") + ": (" + this.markerRef.id + ")";
        }
        else if (this.markerRef.mapResource.markerClass == MarkerClass.AntenaRadar) {
           return this.markerRef.radar.nombre + " - " + this.markerRef.nombre;
        }
    }
  },
  watch: {
    markers: function() {
      if (this.markers.length > 0) {
        this.modalShow = true;
        // Cogemos siempre el marker de más arriba 
        this.markerRef = this.markers[this.markers.length - 1]; 
      }
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {

    esHistorico() {
        return (this.markerRef.mapResource.markerClass == MarkerClass.PuntoMallaHist
             || this.markerRef.mapResource.markerClass == MarkerClass.EstacionHist)
    },

    esBoya() {
        return (this.markerRef.mapResource.markerClass == MarkerClass.EstacionRT
             || this.markerRef.mapResource.markerClass == MarkerClass.EstacionHist)
                &&   this.markerRef.boya;
    },

    esMareografo() {
        return (this.markerRef.mapResource.markerClass == MarkerClass.EstacionRT
             || this.markerRef.mapResource.markerClass == MarkerClass.EstacionHist)
                &&   this.markerRef.mareografo;
    },

    esAntena() {
        return this.markerRef.mapResource.markerClass == MarkerClass.AntenaRadar;
    },

    esRadar() {
        return this.markerRef.mapResource.markerClass == MarkerClass.EstacionRT
            && this.markerRef.radar;
    },
    
    cerrar(evt) {
       // Importante para que el v-if re-cree los subcomponentes, relanzando los create()
       // Como alternativa, se pueden usar computed/asyncComputed para actualizar los valores 
       MapState.markersSelected = [];
    }
  }
};
</script>

<style scoped>

.footer {
  border-top: 1px solid #ddd;
  margin-top: 20px;
}

.footerButton {
  margin-top: 10px;
  float: right;
  margin-bottom: 10px;
}

.infoPanelClass {
  font-size: 12px;
}
</style>
