 <template>
  <div v-if="stationsList"
        @mouseover="$emit('rtinfo-mouseover')" 
        @mouseout="$emit('rtinfo-mouseout')" 
        class="infoPanel infoRTPanel">
    <span style="font-size: 13px; font-weight: bold">
      Se muestran las medidas de los sensores más cercanos al punto seleccionado.
    </span>
    <br /> <br />
    <b-row v-for="stationCode in Object.keys(stationsList)" :key="stationCode">
      <b-col>
           <b-row>
             <b-col>
                  <span style="font-size: 14px; color: #ffc71e; font-weight: bold">{{stationsList[stationCode][0].name}}</span>
             </b-col>
     
      </b-row>
       <b-row style="margin-top: 10px; margin-bottom: 10px">
           <b-col cols="7" >
               <b-row >
                  <b-col style="font-weight:600;" cols="5">Latitud</b-col>
                  <b-col >{{stationsList[stationCode][0].latitude}}</b-col>
               </b-row>
                <b-row >
                  <b-col style="font-weight:600;" cols="5">Longitud</b-col>
                  <b-col >{{stationsList[stationCode][0].longitude}}</b-col>
               </b-row>
                <b-row >
                  <b-col style="font-weight:600;" cols="5">Cadencia</b-col>
                  <b-col >{{stationsList[stationCode][0].cadence}}</b-col>
               </b-row>
                <b-row >
                  <b-col style="font-weight:600;" cols="5">Profundidad</b-col>
                  <b-col >{{stationsList[stationCode][0].depth}}</b-col>
               </b-row>
                <b-row >
                  <b-col style="font-weight:600;" cols="5">Fecha Inst.</b-col>
                  <b-col >{{stationsList[stationCode][0].anchor_date}}</b-col>
               </b-row>
                <b-row >
                  <b-col style="font-weight:600;" cols="5">Tipo</b-col>
                  <b-col >{{stationsList[stationCode][0].station_type}}</b-col>
               </b-row>
                  <b-row >
                  <b-col style="font-weight:600;" cols="5">Modelo</b-col>
                  <b-col >{{stationsList[stationCode][0].model}}</b-col>
               </b-row>
          </b-col>
          <b-col>
            <img width="115" :src="stationsList[stationCode][0].image_url"  />
          </b-col>
      </b-row>
      </b-col>
   
       
      </b-row>
  </div>
</template>

<script>

import Vue from 'vue';
import { SIMO_URL } from '@/common/config';

export default {
  name: "InfoRTPanel",
  components: {},
  data() {
    return {
      stationsList: null
    };
  },
  props: {
    code: { type: Number, default: null }
  },
  computed: {
  },
  watch: {
    code() {
      this.getData();
    }
  },
  created() {
    this.getData();
  },
  mounted() {},
  methods: {
    async getData() {
        var tipo = this.locationType == 'Puerto' ? 'harbor' : 'city';
        var result = await Vue.axios
            .get(SIMO_URL + 'stations/harbor/' + this.code)
            .catch((error) => {
                throw new Error(`[RWV] ApiService ${error}`)
            });
        this.stationsList = result.data;
      },
  }
};
</script>

<style scoped>

.infoRTPanel {
  overflow-y: scroll; 
  overflow-x: hidden; 
  padding: 5px
}

</style>