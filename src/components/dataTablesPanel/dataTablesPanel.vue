 <template>
  <dx-popup
    v-if="marker"
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
      style="background: #606060; color: white"
      class="largeTitle"
    >
      {{titulo}}

      <span @click="cerrar" style="float:right; cursor:pointer">x</span>
   
    </div>

    <b-row v-show="!displayShareInfo">
      <b-col>
        <dx-data-grid
          v-if="marker && rtData"
          :data-source="rtData"
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
  name: "DataTablesPanel",
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
      columnsNames: null,
      rtData: null,
      dateColumnWidth: 130,
      columnWidth: 200,
      height: 370
    };
  },
  props: {
    marker: { type: Object, default: null },
    parameters: { type: Array, default: [] }
  },
  computed: {
    popupWidth() {
      if (this.columnsNames) {
        var width = (Object.keys(this.columnsNames).length * this.columnWidth) + this.dateColumnWidth + 15;
        if (width > window.innerWidth)
          width = window.innerWidth - 50;
        return width;
      }
      else {
        return 0;
      }
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
        this.getTableData();
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    getTableData() {
      var dt = this;
      ApiService.post(
        "RTData/" + this.marker.id + "?locale=" + this.$getLocale(), this.parameters)
        .then(result => {
          if (result.data.length > 0) {
            dt.columnsNames = this.generateColumnsNames(result.data[0]);
            dt.rtData = result.data.map((row) => this.formatRow(row) );
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
        if (col.dataField == "fecha") {
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
      var formattedRow = { fecha: new Date(row.fecha).toISOString().slice(0, 19).replace("T", " "),  };
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
      this.rtColumns = null;
      this.rtData = null;
      MapState.RTDataTableStation = null;
      MapState.RTDataTableParameters = [];
      
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