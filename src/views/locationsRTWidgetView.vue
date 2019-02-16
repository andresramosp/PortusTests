<template>
<div v-if="code && locationType" >
   <LocationsRTWidget :locationType='locationType' :code="code" />
</div>
</template>

<script>

import LocationsRTWidget from "@/components/locationsWidget/locationsRTWidget.vue";

export default {
  name: "LocationsRTWiew",
  components: {
    LocationsRTWidget
  },
  data () {
    return {
      locationType: null,
      code: null
    }    
  },
  created() {
    this.$setLocale(this.$route.query.locale ? this.$route.query.locale : 'es');
    document.body.classList.add(this.$route.query.theme ? this.$route.query.theme : PC.default_theme);
  },
  mounted () {
   
    this.locationType = this.$route.query.locationType;
    this.code = parseInt(this.$route.query.code);

  }
};
</script>

<style>


 
</style>


