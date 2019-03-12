<template>
<div style="text-align: center" >
   <DataTablesPredPanel :marker="location" 
                        :variable="variable" 
                        :minimized="false" 
                        @loaded="loaded" 
                        :preselectedTabIndex="tab"
                        :isWidget="true" />
</div>
</template>

<script>

import DataTablesPredPanel from "@/components/dataTables/dataTablesPredPanel.vue";
import { MapResources } from '@/common/mapResourceManager';

export default {
  name: "DataTablesPredWidget",
  components: {
    DataTablesPredPanel
  },
  data () {
    return {
      location: null,
      variable: null,
      tab: 0
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
        longitud: parseFloat(this.$route.query.longitud),
        mapResource: MapResources.find(m => m.id == this.$route.query.mapResource)
      };
    this.variable =this.$route.query.variable;
  },
  methods: {
    loaded() {
       if (this.$route.query.forPrint) {
        this.tab = this.$route.query.tab;
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


