<template>
  <div class="list-container" >
    <draggable v-model="mapState.dataObjectsList" @start="drag=true" @end="drag=false">
      <div v-for="(dataPanel) in mapState.dataObjectsList" :key="dataPanel.id">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <span style="text-align: left; cursor: move" block href="#" v-b-toggle="'id' + dataPanel.id" variant="info">{{dataPanel.name}}</span>
            <span @click="cerrar(dataPanel)" style="float:right; cursor: pointer">x</span>
          </b-card-header>
          <!-- :visible="index == 0" -->
          <b-collapse :id="'id' + dataPanel.id" :visible="true"  role="tabpanel"> 
            <b-card-body>
                <iframe v-if="dataPanel.type == 'Graphic'" :src="dataPanel.url" :width="iFrameWidth" :height="iFrameHeight" frameborder="0" />
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
import DataPanelsUtils from "@/services/dataPanels.utils";
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
    cerrar(dataPanel) {
      DataPanelsUtils.removeDataPanel(dataPanel);
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