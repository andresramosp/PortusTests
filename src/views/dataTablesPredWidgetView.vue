<template>
<div style="text-align: center" >
   <DataTablesPredPanel :marker="location" :variable="variable" :minimized="false" @loaded="loaded" />
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
    document.body.classList.add(this.$route.query.theme ? this.$route.query.theme : PC.default_theme);
  },
  mounted () {
   
    this.location = { 
        id: parseInt(this.$route.query.locationCode),
        latitud: parseFloat(this.$route.query.latitud),
        longitud: parseFloat(this.$route.query.longitud)
      };
    this.variable =this.$route.query.variable;
    if (this.$route.query.forPrint) {
        setTimeout(() => {
          window.focus();
          window.print();
          window.close();
        }, 1000);
      }
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


