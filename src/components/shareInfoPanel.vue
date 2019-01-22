 <template>
  <div @mouseover="$emit('shareinfo-mouseover')" @mouseout="$emit('shareinfo-mouseout')" class="infoPanel">
    <b-row class="my-1">
      <b-col sm="2">
        <label for="urlLink">URL</label>
         <img
          :src='require("@/assets/icons/openLink.png")'
          width="12"
          style="position: absolute; margin-left: 5px; cursor: pointer"
          @click="openLink"
        >
      </b-col>
      <b-col sm="10">
        <b-form-input size="sm" id="urlLink" v-model="widgetUrl" type="text"></b-form-input>
      </b-col>
    </b-row>
     <b-row class="my-1">
      <b-col sm="2">
        <label for="iFrameCode">Widget:</label>
      </b-col>
      <b-col sm="10">
        <b-form-textarea size="sm" id="iFrameCode" v-model="iFrameCode" placeholder="Enter something" :rows="4" :max-rows="6"></b-form-textarea>
      </b-col>
    </b-row>

  </div>
</template>

<script>
export default {
  name: "ShareInfoPanel",
  components: {},
  data() {
    return {
      widgetUrl: ''
    };
  },
  props: {
    routeData: { type: Object, default: null },
    iFrameWidth: { type: Number, default: 430 },
    iFrameHeight: { type: Number, default: 239 },
  },
  computed: {
    iFrameCode() {
      return (
        "<iframe width='" + this.iFrameWidth +  "' height='" + this.iFrameHeight +  "' src='" +
        this.widgetUrl +
        "' frameborder='0' />"
      );
    }
  },
  created() {
    this.widgetUrl = window.location.origin + '/' + this.routeData.href;
  },
  mounted() {},
  methods: {
    openLink() {
      window.open(this.routeData.href, "_blank");
    },
    cerrar() {}
  }
};
</script>

<style scoped>

</style>