<template>
<div>
  
 
  <div class='layersPanel' :class="{ 'leftAlign': align == 'left', 'rightAlign': align == 'right' }">
      <b-card header="Predicciones" class="text-center" style="background-color: rgba(0, 123, 255, 0.5); margin-top: 12px; border-radius: 8px;">
        
        <b-container>
           <b-row >
          
               <b-col cols="6" class="form-check text-left" v-if="mapOption.group == 'predicciones'" v-for="mapOption in mapOptions" :key="mapOption.id">
              <label class="form-check-label">
                <input class="form-check-input" type="checkbox" v-model="mapOption.active" @change="mapOptionChanged(mapOption)" />
                {{ mapOption.name }}
              </label>
            </b-col> 
 
        </b-row>
        </b-container>
       
       
         
      </b-card>
        <b-card header="Tiempo Real" class="text-center" style="background-color: rgba(0, 123, 255, 0.5); margin-top: 12px; border-radius: 8px;">
        
        <b-container>
           <b-row >
          
               <b-col cols="6" class="form-check text-left" v-if="mapOption.group == 'tiempo_real'" v-for="mapOption in mapOptions" :key="mapOption.id">
              <label class="form-check-label">
                <input class="form-check-input" type="checkbox" v-model="mapOption.active" @change="mapOptionChanged(mapOption)" />
                {{ mapOption.name }}
              </label>
            </b-col> 
 
        </b-row>
        </b-container>
       
       
         
      </b-card>
      <!-- <b-card header="Histórico" class="text-center" style="background-color: rgba(0, 123, 255, 0.5); padding: 10px;">
          <div class="form-check text-left" v-for="mapOption in mapOptions" :key="mapOption.id">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox" v-model="mapOption.active" @change="mapOptionChanged(mapOption)" />
            {{ mapOption.name }}
          </label>
        </div> 
      </b-card> -->
  </div>


</div>


  
</template>

 <!-- <b-form-checkbox  v-for="mapOption in mapOptions" :key="mapOption.id"
                     v-model="mapOption.active"
                     value="true"
                     unchecked-value="false"
                     @change="mapOptionChanged(mapOption)">
      {{ mapOption.name }}
    </b-form-checkbox> -->
    <!-- <b-form-checkbox-group id="checkboxes1" name="flavour1" v-model="active" :options="mapOptions"  @change="mapOptionChanged(mapOption)">
      </b-form-checkbox-group> -->

<script>
import ApiService from "@/services/api.service";

export default {
  name: "LayersPanel",
  data() {
    return {
      align: PC.options_panel_align
    };
  },
  props: {
    mapOptions: { type: Array, default: [], required: false }
  },
  mounted() {},
  methods: {
    mapOptionChanged: function(mapOption) {
      this.$emit("option-click", mapOption);
    }
  }
};
</script>

<style scoped>
.leftAlign {
  left: 9px;
  top: 130px;
}

.rightAlign {
  right: 9px;
  top: 9px;
}

.layersPanel {
  position: absolute;
  z-index: 2;
  width: 320px;
  /* background-color: rgba(0, 123, 255, 0.5);
  padding: 10px; */
  border-radius: 8px;
  color: white;
  font-size: 14px;
}

input[type="checkbox"] {
  width: 1.1em;
  height: 1.1em;
  padding-right: 3px;
}

.form-check {
  padding-top: 5px;
}

.form-check-input {
  margin-right: 5px;
}

.card-header{
  background-color: #091c3259;
  font-size: 19px
}

</style>