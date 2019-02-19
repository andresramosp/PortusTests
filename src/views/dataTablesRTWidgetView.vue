<template>
<div style="text-align: center" >
   <DataTablesRTPanel v-if="parameters" :marker="station" :parameters="parameters" :isWidget="true" />
</div>
</template>

<script>

import ApiService from "@/services/api.service";
import DataTablesRTPanel from "@/components/dataTables/dataTablesRTPanel.vue";

export default {
  name: "DataTablesRTWidget",
  components: {
    DataTablesRTPanel
  },
  data () {
    return {
      station: null,
      parameters: null
    }    
  },
  created() {
    this.$setLocale(this.$route.query.locale ? this.$route.query.locale : 'es');
    document.body.classList.add(this.$route.query.theme ? this.$route.query.theme : PC.default_theme);
  },
  mounted () {
   
    this.station = { 
        id: parseInt(this.$route.query.stationCode),
        radar: this.$route.query.isRadar == 'true',
        latId: this.$route.query.latId,
        lonId: this.$route.query.lonId
      };
    this.variables = this.$route.query.variables.split(',');

    ApiService.post('parametros/' + this.station.id + '?locale=' + this.$getLocale(), this.variables)
              .then(result => {
                this.parameters = result.data;
              })

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


