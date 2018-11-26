<template>

    <b-container style="margin-top: 15px">
        <b-row>
            <b-col style="text-align: left; font-weight:600;" offset="4">
            {{$t('{bancoDatosGraficos}')}}
            </b-col>
            <b-col style="text-align: left; font-weight:600;">
            {{$t('{bancoDatosTablas}')}}
            </b-col>
        </b-row>
        <b-row v-for="param in bancoDatos" :key="param.id">
            <b-col style="font-weight:600;">
                {{param.nombre}}
            </b-col>
            <b-col>
                <input class="form-check-input" type="checkbox" />
            </b-col>
            <b-col>
                <input class="form-check-input" type="checkbox" />
            </b-col>
        </b-row>
    </b-container>

</template>

<script>

import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";

export default {
  name: "BancoDatosTab",
  data() {
      return {
          bancoDatos: []
      }
  },
  props: {
    markers: { type: Array, default: null, required: false }
  },

  mounted() {
  },
  created() {
       var mi = this;
       ApiService.post('parametros?locale=' + this.$getLocale(),
        this.markers.map(m => m.mapOption.variableType))
       .then((params) => {
           this.bancoDatos = params.data;
             // TODO: parámetro extra si es nivel del mar, ver cómo hacer
             // TODO: botones extras, ver
       })
  }
};

    //   asyncComputed: {
    //     async bancoDatos() {
    //        var params = await ApiService.post('parametros?locale=' + this.$getLocale(),
    //             this.markers.map(m => m.mapOption.variableType));
    //         return params.data;
    //       }
    //   },

</script>