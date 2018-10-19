<template>
    <b-tabs class='infoPanelClass' v-if="marker">
        <b-tab title="Acceso a datos" active v-if="markerModel.BancoDatos">
            <b-container style="margin-top: 15px">
                <b-row v-for="data in markerModel.BancoDatos" :key="data.key">
                    <b-col>{{data.key}}</b-col><b-col>{{data.value}}</b-col>
                </b-row>
            </b-container>
        </b-tab>
        <b-tab title="Informacion" v-if="markerModel.Informacion">
           <b-container style="margin-top: 15px">
               <b-row>
                   <b-col cols="8">
                       <b-row v-for="data in markerModel.Informacion" :key="data.key" v-if="data.value">
                          <b-col cols="3">{{data.key}}</b-col><b-col>{{data.value}}</b-col>
                      </b-row>
                   </b-col>
                    <b-col>
                       <img :src="imgUrl"  />
                   </b-col>
               </b-row>
            </b-container>
        </b-tab>
      </b-tabs>
</template>

<script>



export default {
  name: "InfoPanel",
  props: {
    marker: { type: Object, default: null, required: false }
  },
  computed: {
    markerModel () {
        // TODO: controlar tipo de marker, para crear unas secciones u otras
        return {
            Informacion : [
                {key: 'Longitud', value: this.marker.longitud.toFixed(2) + ' O'  }, 
                {key: 'Latitud', value: this.marker.latitud.toFixed(2) + ' N' }, 
                {key: 'Código modelo', value: this.marker.codigoModelo},
                {key: 'Verificación', value: this.marker.mareografo}
             ],
            BancoDatos: []
        }
    },
    imgUrl () {
        //"https://maps.googleapis.com/maps/api/staticmap?zoom=5&size=160x140&maptype=satellite&markers=color:red%7Clabel:%7C" + this.marker.latitud + "," + this.marker.latitud + "&sensor=false&key=" + GOOGLE_API_KEY;
        return require('@/assets/markers/markerImg.png');
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped>

  .infoPanelClass {
    font-size: 12px; 
  }

</style>
