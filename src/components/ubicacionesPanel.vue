 <template>
 <div  class="ubicacionesPanel blueTheme leftAlign">
     <md-autocomplete md-dense
          v-model="ubicacion.nombre"
          :md-options="ubicaciones" 
          @md-changed="getResults" 
          @md-opened="getResults"
          @md-selected="getSelected"  >
      
      <label>Employees</label>

      <template slot="md-autocomplete-item" slot-scope="{ item, term }">
        <div style="color: white">
          {{item.tipoUbicacion}} - {{item.nombre}}
        </div>
      </template>


    </md-autocomplete>
 </div>
</template>

<script>

import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";

export default {
  name: "UbicacionesPanel",
  data() {
    return {
      align: PC.options_panel_align,
      theme: PC.color_theme,
      mapState: MapState,
      ubicacionesList: [],
      ubicaciones: [],
      ubicacion: {}
    };
  },
  created() {
    this.getUbicaciones();
  },
  mounted() {},
  methods: {

     getResults (searchTerm) {
        this.ubicaciones = new Promise(resolve => {
          if (this.timeOut) {
            window.clearTimeout(this.timeOut);
            console.log('canceled');
          }
          this.timeOut = window.setTimeout(() => {
            if (!searchTerm || searchTerm.length < 2) {
              resolve([])
            } else {
              const term = searchTerm.toLowerCase()
              resolve(this.ubicacionesList.filter(({ nombre }) => nombre.toLowerCase().includes(term)))
            }
          }, 300)
        })
      },

    getSelected() {
      console.log('getSelected', this.ubicacion.nombre);
    },

    async getUbicaciones() {
      var result = await ApiService.get('ubicaciones/');
      this.ubicacionesList = result.data.map(u => 
      { 
        return { 
          'id': u.id,
          'nombre': u.nombre, 
          'tipoUbicacion': u.tipoUbicacion,
          'toString': () => u.nombre,
          'toLowerCase': () => u.nombre.toLowerCase()
          }
      });
    }

    
  }
};
</script>

<style scoped>

.md-menu-content {
  background-color: rgba(0, 123, 255, 0.6) !important;
}

.ubicacionesPanel {
  position: absolute;
  z-index: 2;
  /* right: 9px; */
  top: 20px;
  padding: 10px;
  border-radius: 6px;
  color: white;
  font-size: 13px;
}

.leftAlign {
  left: 350px;
}

.rightAlign {
  right: 350px;
}

.blueTheme {
  background-color: rgba(0, 123, 255, 0.6);
}

.grayTheme {
  background-color: #39434fbf;
}

.greenTheme {
  background-color: rgba(0, 255, 0, 0.6);
}

</style>