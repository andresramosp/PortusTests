<template>

    <b-container style="margin-top: 15px">
        <b-row>
          INFORMES
        </b-row>
        <!-- <b-row v-for="param in bancoDatos" :key="param.id">
            <b-col style="font-weight:600;">
                {{param.nombre}}
            </b-col>
            <b-col>
                <input class="form-check-input" type="checkbox" />
            </b-col>
            <b-col>
                <input class="form-check-input" type="checkbox" />
            </b-col>
        </b-row> -->
    </b-container>

</template>

<script>

import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";

export default {
  name: "BancoDatosHistoricoTab",
  data() {
      return {
          informes: null
      }
  },
  props: {
    markers: { type: Array, default: null, required: false }
  },

  mounted() {
  },
  created() {
       var mi = this;
       ApiService.post('informesHist/' + this.markers[0].id + '?locale=' + this.$getLocale(),
        this.markers.map(m => m.mapOption.variableType))
       .then((params) => {
           this.informes = params.data;
       })
  }
};

</script>