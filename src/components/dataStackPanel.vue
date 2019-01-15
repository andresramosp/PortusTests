<template>
  <div class="list-container" >
    <draggable v-model="mapState.dataObjectsList" @start="drag=true" @end="drag=false">
      <div v-for="(dataPanel, index) in mapState.dataObjectsList" :key="dataPanel.id">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <span style="text-align: left; cursor: move" block href="#" v-b-toggle="'id' + dataPanel.id" variant="info">{{dataPanel.name}}</span>
            <span @click="cerrar(dataPanel.id)" style="float:right; cursor: pointer">x</span>
          </b-card-header>
          <b-collapse :id="'id' + dataPanel.id" :visible="index == 0" role="tabpanel">
            <b-card-body>
                <iframe v-if="dataPanel.type == 'Graphic'" :width="iFrameWidth" :height="iFrameHeight" :src="dataPanel.url"/>
                <DataTablesRTPanel v-if="dataPanel.type == 'RTDataTable'" :marker="dataPanel.marker" :parameters="dataPanel.parameters"/>
                <DataTablesPredPanel v-if="dataPanel.type == 'PredDataTable'" :marker="dataPanel.marker" :variable="dataPanel.variable"/>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </draggable>
  </div>
</template>

<script>
// import DxList from "devextreme-vue/list";
import MapState from "@/state/map.state";
import DataTablesRTPanel from "@/components/dataTables/dataTablesRTPanel.vue";
import DataTablesPredPanel from "@/components/dataTables/dataTablesPredPanel.vue";

import draggable from "vuedraggable";

export default {
  name: "DataStackPanel",
  components: {
    DataTablesRTPanel,
    DataTablesPredPanel,
    draggable
  },
  data() {
    return {
      iFrameWidth: window.innerWidth,
      iFrameHeight: 262,
      list: MapState.dataObjectsList,
      mapState: MapState
    };
  },
  props: {},
  computed: {},
  updated() {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
    }, 1000);
    
  },
  methods: {
    cerrar(id) {
      this.mapState.removeDataPanel(id);
    }
  }
};
</script>

<style scoped>
  .stackPanel {
    position: absolute;
    z-index: 3;
    bottom: 0px;
    width: 100%;
    background-color: lightgray;
  }
</style>