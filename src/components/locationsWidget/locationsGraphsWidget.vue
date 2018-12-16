<template>
    
    <div style="width: 569px;" >
       <b-card :header="$t('{headerGraficos}')">
             <img v-if="!loading" :src="require('@/assets/locationsWidget/graficasFake.png')" style="width: 550px; margin-top: -15px" class="fadeIn" />
       </b-card>
    </div>
</template>

<script>

import Vue from 'vue'
import MapUtils from "@/services/map.utils";

export default {
  name: "LocationsGraphsWidget",
  data() {
    return {
      mapUtils: MapUtils,
      interval: null,
      loading: true
    };
  },
  props: {
    locationType: { type: String, default:'', required: true },
    code: { type: Number, default: '', required: true }
  },
  computed: {
   
  },
  created() {
    this.loading = false;
  },
  beforeDestroy() {
      clearInterval(this.interval);
  },
  methods: {
    
  }
};
</script>

<style scoped>

.variableTitle {
    position: absolute; 
    color:white; 
    font-size: 12px;
    margin-left: 5px;
}

.variableTitleSm {
    font-size: 12px;
    color: #111;
    position: absolute;
    font-weight: bold;
    margin-top: -3px;
}

.variableValue {
    position: absolute; 
    color:white; 
    font-weight: 600;
    font-size: 15px;
    margin-left: 50px;
    margin-top: 35px;
    /* letter-spacing: 0.1px; */
}

.variableValueSm {
    color: white;
    font-weight: 600;
    border-radius: 5px;
    font-size: 15px;
    background: #6683b3;
    padding: 4px 6px;
    margin-left: 118px;
}

.variableUnit {
    /* position: absolute;  */
    color:#ffc100; 
    font-weight: normal;
    font-size: 14px;
    font-style: italic;
}

.variableDate {
    color: #767676;
    font-weight: normal;
    font-size: 9px;
    font-family: Arial;
    position: absolute;
    margin-top: 72px;
    margin-left: 2px;
}

.variableDateSm {
    color: #767676;
    font-weight: normal;
    font-size: 9px;
    font-family: Arial;
    position: absolute;
    margin-top: 14px;
}

.winDirRotation {
    /* margin-top: -80px; 
    margin-left: -2px;  */
    position: absolute;
    margin-left: -109px;
    margin-top: 17px;
}

.winDirName {
    /* margin-top: -80px; 
    margin-left: -2px;  */
    position: absolute;
    margin-left: -106px;
    margin-top: 20px;
}

.card-header {
    background-color: #606060;
    font-size: 15px;
    padding: 4px 5px 11px 5px;
    color: white;
    text-align: right;
    height: 30px;
}

</style>