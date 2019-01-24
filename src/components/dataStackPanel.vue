<template>
  <div class="list-container" >
    <draggable v-model="mapState.dataObjectsList" @start="drag=true" @end="drag=false">
      <div v-for="(dataPanel) in mapState.dataObjectsList" :key="dataPanel.id">
        <b-card no-body class="mb-1">
          <b-card-header style="cursor: move;" header-tag="header" class="p-1" role="tab" href="#" v-b-toggle="'id' + dataPanel.id" block>
            <span style="text-align: left; font-size: 14px" variant="info">{{dataPanel.name}}</span>
            <span @click="cerrar(dataPanel)" style="float:right; cursor: pointer">x</span>
          </b-card-header>
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
      mapState: MapState,
      oldDataLenth: null,
      dataModified: false
    };
  },
  props: {},
  computed: {},
  updated() {
    // Control para saber si debemos mover el scroll hacia abajo cuando cambia la lista
    // Si el cambio se debe a la inserción de un elemento, bajamos el scroll
    // Si el cambio se debe a una reordenación o un borrado de elementos, no lo bajamos
     if (this.oldDataLenth == 0 || this.oldDataLenth < this.mapState.dataObjectsList.length) {
        this.dataModified = true;
      }
      else {
        this.dataModified = false;
      }
      this.oldDataLenth = this.mapState.dataObjectsList.length;

      if (this.dataModified) {
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollTop != undefined ? document.body.scrollTop + 370 : document.documentElement + 340);
        }, 1000);
      }
      //localStorage.setItem('data_stack_panel', JSON.stringify(this.mapState.dataObjectsList));
    
  },
  methods: {
    cerrar(dataPanel) {
      DataPanelsUtils.removeDataPanel(dataPanel);
      DataPanelsUtils.saveDataUserPrefs(dataPanel.marker);
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