<template>
  <b-container style="margin-top: 15px">
    <b-table striped hover dark :items="data" :fields="fields" :small="true" :bordered="false" :outlined="false" ></b-table>
  </b-container>
</template>

<script>

import ApiService from "@/services/api.service";

export default {
  name: "LastPositionsTab",
  props: {
    boya: { type: Object, default: null, required: false }
  },
  data () {
    return {
      fields: {
        fecha: {
          label: this.$t('{ultimaPosicionFecha}'),
          sortable: true
        },
        longitud: {
          label: this.$t('{longitudInfo}'),
          sortable: false
        },
        latitud: {
          label: this.$t('{latitudInfo}'),
          sortable: false
        }
      },
      data: []
    }
  },
  created() {
      var mi = this;
      ApiService.get('lastData/positions/' + this.boya.id)
      .then((params) => {
        mi.data = params.data.map(d => 
        { 
          return { 
            // fecha: new Date(d.fecha).toISOString().slice(0, 19).replace("T", " "), 
            fecha: d.fecha.slice(0, 19), 
            latitud: d.latitud.toFixed(4),
            longitud: d.longitud.toFixed(4),
          } 
        });
      })
  }
}
</script>