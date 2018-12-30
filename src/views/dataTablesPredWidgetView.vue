<template>
<div style="text-align: center" >
   <DataTablesPredPanel :marker="location" :variable="variable" :minimized="false" />
</div>
</template>

<script>

import DataTablesPredPanel from "@/components/dataTables/dataTablesPredPanel.vue";

export default {
  name: "DataTablesPredWidget",
  components: {
    DataTablesPredPanel
  },
  data () {
    return {
      location: null,
      variable: null
    }    
  },
  created() {
    this.$setLocale(this.$route.query.locale ? this.$route.query.locale : 'es');
  },
  mounted () {
   
    this.location = { 
        id: parseInt(this.$route.query.locationCode),
        latitud: parseFloat(this.$route.query.latitud),
        longitud: parseFloat(this.$route.query.longitud)
      };
    this.variable =this.$route.query.variable;

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


