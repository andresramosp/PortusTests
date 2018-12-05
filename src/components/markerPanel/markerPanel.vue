<template>
<b-modal v-model="modalShow" v-if="markers && markers.length > 0" @hidden="onHidden" size="lg" :title="modalTitle">
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
         <b-tab v-else-if="esMareografo()" :title="'Cero referencias'" >
            <CeroRefsTab :mareografo="markerRef" /> 
        </b-tab>
      </b-tabs>
</b-modal>
</template>

<script>

import { MarkerClass } from "@/common/enums";
import MapState from "@/state/map.state";
import InformacionTab from "@/components/markerPanel/informacionTab.vue"
import BancoDatosTab from "@/components/markerPanel/bancoDatosTab.vue"
import BancoDatosHistoricoTab from "@/components/markerPanel/bancoDatosHistoricoTab.vue"
import LastPositionsTab from "@/components/markerPanel/lastPositionsTab.vue"
import CeroRefsTab from "@/components/markerPanel/ceroRefsTab.vue"

export default {
  name: "MarkerPanel",
  components: {
    InformacionTab,
    BancoDatosTab,
    LastPositionsTab,
    BancoDatosHistoricoTab,
    CeroRefsTab
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
        if (this.markerRef.mapResource.markerClass == MarkerClass.UBICACION) {
            return this.$t("{tipoUbicacion"+this.markerRef.tipoUbicacion+"}") + ": " + this.markerRef.nombre;
        }
        else if (this.markerRef.mapResource.markerClass == MarkerClass.PUNTO_MALLA) {
            return "Pred. " +  this.$t(this.markerRef.mapOption.name) + ": " + (this.markerRef.nombre ? this.markerRef.nombre : " Lat " + this.markerRef.latitud.toFixed(2) + " N" + ": Lon " + this.markerRef.longitud.toFixed(2) + " O");
        }
        else if (this.markerRef.mapResource.markerClass == MarkerClass.PUNTO_MALLA_VERIF) {
           return this.$t("{verificacionInfo}") + ": " + this.markerRef.nombre;
        }
        else if (this.markerRef.mapResource.markerClass == MarkerClass.ESTACION 
              || this.markerRef.mapResource.markerClass == MarkerClass.ESTACION_HISTORICO) {
            return this.markerRef.nombre;
        }
        else if (this.markerRef.mapResource.markerClass == MarkerClass.PUNTO_MALLA_HISTORICO) {
           return this.$t("{puntoSimarLabel}") + ": (" + this.markerRef.id + ")";
        }
    }
  },
  watch: {
    markers: function() {
      if (this.markers.length > 0) {
        this.modalShow = true;
        this.markerRef = this.markers[0]; // TODO: El de mayor index
      }
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {

    esHistorico() {
        return (this.markerRef.mapResource.markerClass == MarkerClass.PUNTO_MALLA_HISTORICO
             || this.markerRef.mapResource.markerClass == MarkerClass.ESTACION_HISTORICO)
    },

    esBoya() {
        return (this.markerRef.mapResource.markerClass == MarkerClass.ESTACION
             || this.markerRef.mapResource.markerClass == MarkerClass.ESTACION_HISTORICO)
                &&   this.markerRef.boya;
    },

    esMareografo() {
        return (this.markerRef.mapResource.markerClass == MarkerClass.ESTACION
             || this.markerRef.mapResource.markerClass == MarkerClass.ESTACION_HISTORICO)
                &&   this.markerRef.mareografo;
    },

    esAntena() {
        return this.markerRef.mapResource.markerClass == MarkerClass.ANTENA_RADAR;
    },
    
    onHidden (evt) {
       // Importante para que el v-if re-cree los subcomponentes, relanzando los create()
       // Como alternativa, se pueden usar computed/asyncComputed para actualizar los valores 
       MapState.markersSelected = [];
    }
  }
};
</script>

<style scoped>

.infoPanelClass {
  font-size: 12px;
}
</style>
