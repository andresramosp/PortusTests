<template>
<div v-if="code && locationType" style="text-align: center" >
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
  },
  mounted () {
   
    this.locationType = this.$route.query.locationType;
    this.code = parseInt(this.$route.query.code);

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


