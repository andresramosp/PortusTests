<template>
<div >
   <LocationsWidget :ubicacion="ubicacion" />
</div>
</template>

<script>

import LocationsWidget from "@/components/locationsWidget/locationsWidget.vue";
import ApiService from "@/services/api.service";

export default {
  name: "LocationsWidgetWiew",
  components: {
    LocationsWidget
  },
  data () {
    return {
      ubicacion: null
    }
  },
  async created() {
    this.$setLocale(this.$route.query.locale ? this.$route.query.locale : 'es');
    var code = parseInt(this.$route.query.code);
    var result = await ApiService.get('ubicaciones/' + code + '?locale=' + this.$getLocale());
    this.ubicacion = result.data;
  },
  mounted () {
  }
};
</script>

<style>

.fadeIn {
    -webkit-animation: animat_show 1.2s;
    animation: animat_show 1.2s;
    visibility: visible !important;
}
 
</style>


