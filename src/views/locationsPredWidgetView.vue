<template>
<div v-if="code && locationType"  >
   <LocationsPredWidget :locationType='locationType' :code="code" />
</div>
</template>

<script>

import LocationsPredWidget from "@/components/locationsWidget/locationsPredWidget.vue";

export default {
  name: "LocationsRTWiew",
  components: {
    LocationsPredWidget
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


