 <template>
  <dx-popup
    v-if="marker && parameters.length > 0"
    :visible="true"
    :position="popupPosition"
    :resize-enabled="true"
    :drag-enabled="true"
    :close-on-outside-click="false"
    :show-title="true"
    :width="popupWidth"
    :height="popupHeight"
    :shading="false"
    :title="titulo"
    class="popup"
    @hidden="cerrar"
    title-template="titleTemplate"
  >
    <div
      slot="titleTemplate"
      slot-scope="title"
      style="background: rgb(69, 99, 205); color: white"
      class="largeTitle"
    >
      {{titulo}}

      <span @click="cerrar" style="float:right; cursor:pointer">x</span>
   
    </div>

       <img
        style="margin-left: 450px; margin-top: 160px;"
        :src="require('@/assets/gifs/loadingBars.gif')"
        v-show="loading"
        width="100"
      >

    <b-row v-show="!displayShareInfo">
      <b-col v-if="!loading" class="fadeIn">

                  <dx-pivot-grid
                    ref="grid"
                    :data-source="dataSource"
                    :allow-sorting-by-summary="false"
                    :allow-filtering="true"
                    :show-borders="true"
                    :show-column-grand-totals="false"
                    :show-row-grand-totals="false"
                    :show-row-totals="false"
                    :show-column-totals="false"
                  >
                    <!-- <dx-field-chooser
                      :enabled="true"
                      :height="400"
                    /> -->
                  </dx-pivot-grid>
      
      </b-col>
    </b-row>
  </dx-popup>
</template>

<script>
import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
import { DxDataGrid, DxColumn, DxPager, DxPaging, DxGrouping, DxGroupPanel } from "devextreme-vue/data-grid";
import { DxPivotGrid, DxFieldChooser } from 'devextreme-vue/pivot-grid';

import ShareInfoPanel from "@/components/shareInfoPanel.vue";

export default {
  name: "DataTablesPredPanel",
  components: {
    DxPopup,
    DxToolbarItem,
    ShareInfoPanel,
    DxDataGrid,
    DxColumn,
    DxPager,
    DxPaging,
    DxGrouping,
    DxGroupPanel,
    DxPivotGrid,
    DxFieldChooser
  },
  data() {
    return {
      defaultLogo: PC.default_map_logo,
      align: PC.options_panel_align,
      theme: PC.color_theme,
      mapState: MapState,
      titulo: '',
      displayShareInfo: false,
      minimized: true,
      columnsNames: {},
      days: [],
      width: 1000,
      height: 360,
      dataSource: {
        fields: [
        {
          caption: 'Group',
          width: 120,
          dataField: 'Group',
          area: 'row',
          // sortBySummaryField: 'Total'
        }, 
        {
          caption: 'Parametro',
          dataField: 'Parametro',
          width: 150,
          area: 'row'
        }, 
        {
          dataField: 'Date',
          width: 50,
          area: 'column'
        },
        {
          dataField: 'Value',
          dataType: 'number',
          summaryType: 'sum',
          format: 'decimal',
          area: 'data'
        }],
        store:   [
                  { id: 1, Group: 'Corrientes', Parametro: 'p1', Date: '11:30', Value: 12 },
                  {id: 2, Group: 'Corrientes', Parametro: 'p1', Date: '12:30', Value: 13 },
                  {id: 3, Group: 'Corrientes', Parametro: 'p1', Date: '13:30', Value: 13 },
                  {id: 4, Group: 'Corrientes', Parametro: 'p1', Date: '14:30', Value: 22 },
                  {id: 5, Group: 'Corrientes', Parametro: 'p1', Date: '15:30', Value: 12 },
                  {id: 6, Group: 'Corrientes', Parametro: 'p1', Date: '16:30', Value: 12 },
                  {id: 7, Group: 'Corrientes', Parametro: 'p3', Date: '11:30', Value: 12 },
                  {id: 8, Group: 'Corrientes', Parametro: 'p3', Date: '12:30', Value: 13 },
                  {id: 9, Group: 'Corrientes', Parametro: 'p3', Date: '13:30', Value: 13 },
                  {id: 10, Group: 'Corrientes', Parametro: 'p3', Date: '14:30', Value: 22 },
                  {id: 11, Group: 'Corrientes', Parametro: 'p3', Date: '15:30', Value: 12 },
                  {id: 12, Group: 'Corrientes', Parametro: 'p3', Date: '16:30', Value: 12 },
                   {id: 13, Group: 'Salinidad', Parametro: 'p4', Date: '11:30', Value: 12 },
                  {id: 14, Group: 'Salinidad', Parametro: 'p4', Date: '12:30', Value: 13 },
                  {id: 15, Group: 'Salinidad', Parametro: 'p4', Date: '13:30', Value: 13 },
                  {id: 16, Group: 'Salinidad', Parametro: 'p4', Date: '14:30', Value: 22 },
                  {id: 17, Group: 'Salinidad', Parametro: 'p4', Date: '15:30', Value: 12 },
                  {id: 18, Group: 'Salinidad', Parametro: 'p4', Date: '16:30', Value: 11 }
                ]
      }
    };
  },
  props: {
    marker: { type: Object, default: null },
    variable: { type: String, default: null },
    parameters: { type: Array, default: [] }
  },
  computed: {
    loading() {
      return false;
    },
    popupWidth() {
      return this.width;
    },
    popupHeight() {
      return this.height;
    },
    popupPosition() {
      return this.minimized
        ? this.align == "left"
          ? "bottom"
          : "bottom"
        : "center";
    }
  },
  // TODO: comprobar si en el mount ya están todas las props y hacer el getTableData ahí
  watch: {
    marker: function() {
      if (this.marker != null) {
        this.titulo = this.marker.nombre;
      }
      // if (this.marker != null && this.parameters.length > 0 && this.variable) {
      //   this.getTableData();
      // }
    },
    parameters: function() {
      if (this.marker != null && this.parameters.length > 0 && this.variable) {
        this.getTableData();
      }
    },
    variable: function() {
      // if (this.marker != null && this.parameters.length > 0 && this.variable) {
      //   this.getTableData();
      // }
    }
  },
  created() {},
  mounted() {},
  methods: {
    getTableData() {
      var dt = this;
      ApiService.get(
        "predData/" + this.variable + "/" + this.marker.id + "?locale=" + this.$getLocale())
        .then(result => {
          if (result.data.length > 0) {
            // var dayData = { 
            //     id: 'Day 1',
            //     data: this.formatData(result.data)
            //     [
            //       { Group: 'Corrientes', Parametro: 'p1', '11:30': 1, '12:30': 0.3, '13:30': 21.1, '14:30': 1, '15:30': 0.3, '16:30': 21.1, '17:30': 1, '18:30': 0.3, '19:30': 21.1 },
            //       { Group: 'Corrientes', Parametro: 'p3', '11:30': 12, '12:30': 0.3, '13:30': 21.1, '14:30': 1, '15:30': 0.3, '16:30': 21.1, '17:30': 1, '18:30': 0.3, '19:30': 21.1 },
            //       { Group: 'Salinidad', Parametro: 'p4', '11:30': 3, '12:30': 0.6, '13:30': 121.1, '14:30': 1, '15:30': 0.3, '16:30': 21.1, '17:30': 1, '18:30': 0.3, '19:30': 21.1 }
            //     ]
            // }
            // dt.days.push(dayData);
          }
        });
    },
    customizeColumns(columns) {
      columns.forEach(col => {
        col.cssClass = "colHeader";
        if (col.dataField == 'nombreParametro' || col.dataField == "variableParametro") {
          col.width = 95;
        }
        else {
           col.width = 50;
        }
      });
      return columns;
    },
    formatData(data) {
      var result = [];
      data.forEach(fechaData => {
          fechaData.datos.forEach(paramData => {
            var reg = result.find(r => r.nombreParametro == paramData.nombreParametro);
            if (!reg) {
              reg = { variableParametro: paramData.variableParametro, nombreParametro: paramData.nombreParametro }
              result.push(reg);
            }
            var fecha = new Date(fechaData.fecha)
            var hora = fecha.toISOString().split('T')[1].substr(0,5)
            reg[hora] = paramData.valor; 
          })
        }
      )
      return result;
    },
    renderCell(ev) {
     
    },
    cerrar() {
      this.days = [];
      MapState.setPredDataTable(null, null, []);
    },
    
    // toggleShareInfo() {
    //   this.displayShareInfo = !this.displayShareInfo;
    // },

    // openShareInfo() {
    //     if (this.timeOutShareInfoClose)
    //         clearInterval(this.timeOutShareInfoClose)
    //      this.timeOutShareInfoOpen = setTimeout(() => {
    //         this.displayShareInfo = true;
    //     }, 500)
    // },

    // closeShareInfo() {
    //     if (this.timeOutShareInfoOpen)
    //         clearInterval(this.timeOutShareInfoOpen)
    //     this.timeOutShareInfoClose = setTimeout(() => {
    //         this.displayShareInfo = false;
    //     }, 500)
    // },

    // toggleMinimized() {
    //   this.minimized = !this.minimized;
    // }
  }
};
</script>

<style>

.dx-datagrid-headers .dx-row .colHeader {
    background-color: #7fb7e7f5 !important;
    font-size: 13.5px;
    color: #f8f9fa;
}



.largeTitle {
  font-size: 15px;
}

.smallTitle {
  font-size: 14px;
}

.shareInfoCenter {
  margin-top: 150px;
  width: 80%;
  margin-left: 100px;
}

.minimizeIcon {
  margin-top: 3px;
  float: right;
  cursor: pointer;
  width: 17px;
  margin-right: 6px;
}

.shareIcon {
  margin-top: 2px;
  float: right;
  cursor: pointer;
  width: 19px;
  margin-right: 6px;
}
</style>