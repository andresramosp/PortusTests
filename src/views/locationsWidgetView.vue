<template>
<div >
   <LocationsWidget :ubicacion="ubicacion" :popupPosition="'left top'" />
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
    document.body.classList.add(this.$route.query.theme ? this.$route.query.theme : PC.default_theme);
    var code = parseInt(this.$route.query.code);
    var result = await ApiService.get('ubicaciones/' + code + '?locale=' + this.$getLocale());
    this.ubicacion = result.data;
    setTimeout(() => {
      this.loaded();
    }, 2000);
  },
  mounted () {
  },
  methods: {
    loaded() {
      if (this.$route.query.forPrint) {
        setTimeout(() => {
          window.focus();
          window.print();
          window.close();
        }, 1000);
      }
    }
  }
};
</script>

<style>


 
</style>


