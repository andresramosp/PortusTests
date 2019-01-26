<template>
  <dx-popup
     v-if="sourceId"
    :visible="true"
    :position="{ at: 'center', offset: '0 -20' }"
    :resize-enabled="false"
    :drag-enabled="true"
    :close-on-outside-click="false"
    :show-title="true"
    width="900"
    height="auto"
    :shading="false"
    :title="null"
    class="popup puertosInfoPopup"
    @hidden="cerrar"
  >
    <iframe class="puertosInfoContent fadeIn" :src="url" width="900" height="425" frameborder="0"/>
  </dx-popup>
</template>

<script>
import { DxPopup } from "devextreme-vue/popup";
import MapState from "@/state/map.state";
import { BASE_URL_PORTUS } from "@/common/config";

export default {
  name: "PuertosInfoPanel",
  components: {
    DxPopup
  },
  props: {
    sourceId: { type: String, required: false }
  },
  data() {
    return {
      mapState: MapState,
      url: null,
      infoPrefixUrl: "html/info/",
      dictionaryUrls: {
        "predicciones": { es: 'infofc.html', en: "infofc_en.html"},
        "tiempo_real": { es: 'infotr.html', en: "infotr_en.html"},
        "historico": { es: 'infohist.html', en: "infohist_en.html"},
        "pred_oleaje_atl": { es: 'info_predoes.html', en: "info_predoen.html"},
        "pred_oleaje_med": { es: 'info_predoes.html', en: "info_predoen.html"},
        "pred_nivmar": { es: 'info_prednes.html', en: "info_prednen.html"},
        "pred_viento": { es: 'info_predves.html', en: "info_predven.html"},
        "pred_corrientes": { es: 'info_predcorriente.html', en: "info_predcorrienteen.html"},
        "pred_temperatura": { es: 'info_temperatura.html', en: "info_temperaturaen.html"},
        "pred_salinidad": { es: 'info_salinidad.html', en: "info_salinidaden.html"}
      }
    };
  },
  watch: {
    sourceId: function() {
      if (this.sourceId) {
         var htmlReg =  this.dictionaryUrls[this.sourceId][this.$getLocale()];
         this.url = BASE_URL_PORTUS + this.infoPrefixUrl + htmlReg;
      }
      else {
        this.url = null;
      }
     
    }
  },
  mounted() {},
  created() {},
  methods: {
    cerrar() {
      this.mapState.setPortusInfoPanel(null);
    }
  }
};
</script>

<style scoped>
.puertosInfoContent {
  padding-right: 15px;
}

.puertosInfoPopup {
}
</style>
