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

          <b-tabs v-if="marker && dataSources.length > 0" class='infoPanelClass' >

              <b-tab v-for="dataSource in dataSources" :key="dataSource.id" :title="dataSource.id">

                <dx-data-grid
                  :data-source="dataSource.data"
                  :allow-column-reordering="true"
                  :row-alternation-enabled="true"
                  :show-borders="true"
                  :customize-columns="customizeColumns"
                  @initialized="initialized"
                  @cellPrepared="renderCell"
                >

                    <dx-paging :page-size="10"/>
                    <dx-pager
                      :show-page-size-selector="false"
                      :allowed-page-sizes="[15]"
                      :show-info="true"
                      :show-navigation-buttons="true"
                    />

                </dx-data-grid>

              </b-tab>

          </b-tabs>

      
      </b-col>
    </b-row>
  </dx-popup>
</template>

<script>
import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
import {DxDataGrid, DxColumn, DxPager, DxPaging } from "devextreme-vue/data-grid";

import ShareInfoPanel from "@/components/locationsWidget/shareInfoPanel.vue";

export default {
  name: "DataTablesRTPanel",
  components: {
    DxPopup,
    DxToolbarItem,
    ShareInfoPanel,
    DxDataGrid,
    DxColumn,
    DxPager,
    DxPaging
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
      dataSources: [],
      width: 1000,
      height: 410,
      loading: true
    };
  },
  props: {
    marker: { type: Object, default: null },
    parameters: { type: Array, default: [] }
  },
  computed: {
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
  watch: {
    marker: function() {
      if (this.marker != null && this.parameters.length > 0) {
        this.titulo = this.marker.nombre;
      }
    },
    parameters: function() {
      // TODO: intentar quitar el await y lanzar todos a la vez, arreglar problema en backend de statement closed
      this.dataSources = [];
      this.loading = true;
      if (this.marker != null && this.parameters.length > 0) {
          var paramsGroups = this.parameters.map(p => p.variable).filter(function (elem, index, self) { return index == self.indexOf(elem); });
          this.asyncForEach(paramsGroups, async pGrp => {
            await this.getTableData(this.parameters.filter(p => p.variable == pGrp), pGrp);
            if (this.dataSources.length == paramsGroups.length)
              this.loading = false;
          });
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    getTableData(parametrosDataSource, dataSourceId) {
      var dt = this;
      return ApiService.post(
        "RTData/" + this.marker.id + "?locale=" + this.$getLocale(), parametrosDataSource.map(p => p.id))
        .then(result => {
          if (result.data.length > 0) {
             var dataSource = { 
                id: dataSourceId,
                data: result.data.map((row) => this.formatRow(row) )
              };
            dt.dataSources.push(dataSource);
            Object.assign(this.columnsNames, this.generateColumnsNames(result.data[0]));
          }
        });
    },
    generateColumnsNames(row) {
      var result = {};
      row.datos.forEach(dato => {
        result[dato.nombreColumna] = dato.nombreParametro + " (" + dato.unidad + ")";;
      });
      return result;
    },
    customizeColumns(columns) {
      columns.forEach(col => {
        col.caption = this.columnsNames[col.dataField];
        col.cssClass = "colHeader";
        if (col.dataField == 'Fecha (GMT)') {
          col.width = this.dateColumnWidth;
        }
        else {
           col.width = this.columnWidth;
        }
        if (col.dataField == "QCs")
          col.visible = false;
      });
      return columns;
    },
    formatRow(row) {
      var formattedRow = { 'Fecha (GMT)': new Date(row.fecha).toISOString().slice(0, 19).replace("T", " "),  };
      formattedRow.QCs = [];
      row.datos.forEach(dato => {
        formattedRow[dato.nombreColumna] = this.formatParamValue(dato);
        if (dato.paramQC)
          formattedRow.QCs.push(dato.nombreColumna);
      });
      return formattedRow;
    },
    formatParamValue: function(lastDataResult) {
      var value = parseFloat(lastDataResult.valor) / lastDataResult.factor;
      return value.toFixed(2);
    },
    initialized(dataGrid) {
      //dataGrid.component.columnOption('QCs', 'cssClass', 'colHeader');
    },
    renderCell(ev) {
      if (ev.rowType == "data" && ev.data.QCs.indexOf(ev.column.dataField) != -1)
        ev.cellElement.style.color = 'red';
    },
    cerrar() {
      this.dataSources = [];
      MapState.RTDataTableStation = null;
      MapState.RTDataTableParameters = [];
      
    },
    async asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
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