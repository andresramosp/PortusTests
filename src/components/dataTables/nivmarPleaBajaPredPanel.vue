<template>
  <div class="row allCenter" >
    <div v-for="day in days" :key="day.id" class="col-md-3" style="max-width: 18% !important;" >
        <div style="margin-bottom: 5px; font-size: 13.5px">{{ day.id }}</div>
        <b-table v-if="DBSource" striped hover :items="day.data" :fields="DBFields" :small="true" :fixed="true" :outlined="true" thead-class="hiddenHeader" >
          <template slot="indicador" slot-scope="data">
              <a :style="'color: ' + (data.value == 'Bajamar' ? 'green' : 'red' ) +''">
                {{data.value}}
              </a>
          </template>
        </b-table>
         <b-table v-else striped hover :items="day.data" :fields="calculatedFields" :small="true" :fixed="true" :outlined="true" thead-class="hiddenHeader" >
             <template slot="indicador" slot-scope="data">
              <a :style="'color: ' + (data.value == 'Min' ? 'green' : 'red' ) +''">
                {{data.value}}
              </a>
          </template>
        </b-table>
    </div>
  </div>
</template>

<script>

import ApiService from "@/services/api.service";

export default {
  name: "NivmarPleaBajaPredPanel",
  data() {
    return {
      days: [],
      DBSource: false,
      DBFields: {
        hora: {
          class: 'pleaBajaColumn',
        },
        indicador: {
          class: 'pleaBajaColumn',
          formatter: (value) => { return value < 1 ? "Bajamar" : "Pleamar" }
        },
        nivel: {
          class: 'pleaBajaColumn',
          formatter: (value) => { return parseFloat(value).toFixed(2) + ' (m)' }
        }
      },
      calculatedFields: {
       hora: {
          class: 'pleaBajaColumn',
        },
        indicador: {
          class: 'pleaBajaColumn'
        },
        nivel: {
          class: 'pleaBajaColumn',
          formatter: (value) => { return parseFloat(value).toFixed(2) + ' (m)' }
        }
      }
    };
  },
  props: {
    marker: { type: Object, default: null },
    dataAux: { type: Array, default: null }
  },
  watch: {
    marker: function() {
      if (this.marker != null) {
        this.days = [];
        this.getTableData();
      }
    }
  },
  created() {
     if (this.marker != null) {
        this.days = [];
        this.getTableData();
      }
  },
  mounted() {},
  methods: {
    async getTableData() {
      var result = await ApiService.get("predData/SEA_LEVEL_PLEABAJA/" + this.marker.id + "?locale=" + this.$getLocale());
      if (result.data.length > 0) {
          this.DBSource = true;
          var groupDays = result.data.map(d => new Date(d.fecha)
              .toISOString().split('T')[0])
              .filter(function (elem, index, self) { return index == self.indexOf(elem); });
          groupDays.forEach(day => {
            var dayData = { 
              id: new Date(day).toLocaleDateString(this.$getLocale() == 'es' ? 'es-ES' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
              data: this.formatData(result.data.filter(d => new Date(d.fecha).toISOString().split('T')[0] == day))
            }
            this.days.push(dayData);
          })

      }
      // No hay datos de PleaBaja, los obtenemos de los datos de la predicción
      else {
        this.DBSource = false;
        this.dataAux.forEach(day => {
          var minExtreme = this.getExtremeNivel(day, 'min');
          var maxExtreme = this.getExtremeNivel(day, 'max');
          var dayData = { 
              id: new Date(day._date).toLocaleDateString(this.$getLocale() == 'es' ? 'es-ES' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
              data: [ 
                { indicador: 'Max', hora: maxExtreme.hora, nivel: maxExtreme.nivel },
                { indicador: 'Min', hora: minExtreme.hora, nivel: minExtreme.nivel }
              ] 
            }
          this.days.push(dayData);
        })
      }
    },
    formatData(data) {
      var result = [];
      data.forEach(d => {
          var reg = { 
            hora: new Date(d.fecha).toISOString().split('T')[1].substr(0,5), 
            indicador: d.datos.find(d => d.nombreParametro == "indicador").valor, 
            nivel:  d.datos.find(d => d.nombreParametro == "nivel").valor 
          }
          result.push(reg);
      })
      return result;
    },
    getExtremeNivel(dayData, extreme) {
      var result = null
      var nivelReg = dayData.data.find(r => r.nombreParametro.toLowerCase().indexOf('nivel') != -1);
      for (var h in nivelReg) {
        if (h.indexOf('_') == -1 && !isNaN(parseFloat(nivelReg[h]))) {
          if (!result || ((extreme == 'min' && parseFloat(nivelReg[h]) < result.nivel) || (extreme == 'max' && parseFloat(nivelReg[h]) > result.nivel))) {
            result = { hora: h, nivel: parseFloat(nivelReg[h]) };
          }
        }
      }
      return result;
    }
  }
};
</script>


<style>


  .pleaBajaColumn {
    text-align: center; 
    font-size: 13px;
    /* width: 20px; */
  }

  .hiddenHeader {
    display: none;
  }
</style>
