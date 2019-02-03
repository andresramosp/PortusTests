 <template>

    <div>

     <div class="allCenter">
      <img 
        :src="require('@/assets/gifs/loadingBars.gif')"
        v-show="loading"
        width="100"
      >
    </div>

    <b-row v-show="!displayShareInfo">
      <b-col v-if="!loading" class="fadeIn">

          <b-tabs v-if="marker && dataSources.length > 0"  v-model="tabIndex" class='infoPanelClass' >

              <b-tab 
                v-for="(dataSource, index) in dataSources" 
                :key="dataSource.id" 
                :title="$t('{'+ dataSource.id +'}')"
                :ref="'tableContainer' + index">

                <dx-data-grid
                  :data-source="dataSource.data"
                  :allow-column-reordering="true"
                  :row-alternation-enabled="true"
                  :show-borders="true"
                  :customize-columns="customizeColumns"
                  @initialized="initialized"
                  @cellPrepared="renderCell"
                >

                    <dx-paging :page-size="8"/>
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

    </div>
   
</template>

<script>
import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
import {DxDataGrid, DxColumn, DxPager, DxPaging } from "devextreme-vue/data-grid";

import ShareInfoPanel from "@/components/shareInfoPanel.vue";

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
      theme: "", // PC.color_theme,
      mapState: MapState,
      titulo: '',
      displayShareInfo: false,
      minimized: true,
      columnsNames: {},
      dataSources: [],
      tabIndex: 0,
      width: 1000,
      height: 360
    };
  },
  props: {
    marker: { type: Object, default: null },
    parameters: { type: Array, default: [] }
  },
  computed: {

    loading() {
      return !this.paramsGroups || this.dataSources.length != this.paramsGroups.length;
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
  watch: {
    parameters: function() {
      this.init();
    }
  },
  created() {
     this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.dataSources = [];
      if (this.marker != null && this.parameters.length > 0) {
          this.paramsGroups = this.parameters.map(p => p.variable).filter(function (elem, index, self) { return index == self.indexOf(elem); });
          this.paramsGroups.forEach(pGrp => {
            this.getTableData(this.parameters.filter(p => p.variable == pGrp), pGrp);
          });
          this.titulo = this.marker.nombre;
          if (this.marker.radar) {
            this.titulo += ". " + "Posición del punto: " +  " Lat " + parseFloat(this.marker.lat).toFixed(2) + " N" + ": Lon " + parseFloat(this.marker.lon).toFixed(2) + " O";
          }
      }
    },
    getTableData(parametrosDataSource, dataSourceId) {
      var dt = this;

      if (!this.marker.radar) {
        var url = "RTData/station/" + this.marker.id + "?locale=" + this.$getLocale();
        var params = parametrosDataSource.map(p => p.id);
      }
      else {
        var url = "RTData/radar/" + this.marker.id + "?locale=" + this.$getLocale();
        var params = [this.marker.latId, this.marker.lonId];
      }

      ApiService.post(url, params)
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
          col.width = 160;
        }
        // else {
        //    col.width = this.columnWidth;
        // }
        if (col.dataField == "QCs")
          col.visible = false;
      });
      return columns;
    },
    formatRow(row) {
      // var formattedRow = { 'Fecha (GMT)': new Date(row.fecha).toISOString().slice(0, 19).replace("T", " "),  };
      var formattedRow = { 'Fecha (GMT)': row.fecha.slice(0, 19),  };
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
      return value.toFixed(3);
    },
    initialized(dataGrid) {
      //dataGrid.component.columnOption('QCs', 'cssClass', 'colHeader');
    },
    renderCell(ev) {
      if (ev.rowType == "data" && ev.data.QCs.indexOf(ev.column.dataField) != -1) {
        ev.cellElement.style.color = 'red';
      }
      if (ev.column.caption.indexOf("Fecha") != -1) {
        ev.cellElement.style.textAlign = "center";
      }
      else {
        ev.cellElement.style.textAlign = "center";
      }
    },
    cerrar() {
      this.dataSources = [];
      MapState.setRTDataTable(null, []);
    },
    async asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    },
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
  width: 23px;
  margin-right: 6px;
}
</style>