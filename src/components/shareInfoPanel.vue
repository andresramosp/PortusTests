 <template>
  <div @mouseover="$emit('shareinfo-mouseover')" @mouseout="$emit('shareinfo-mouseout')" class="shareInfoPanel">

    <label class="alertText" style="float: left: display: inline; margin-right:3px" for="urlLink">URL</label>
    <img :src='require("@/assets/icons/openLink.png")' width="11" class="shareImg" @click="openLink">
    <b-form-input id="specialContent" 
                class="shareInput"
                size="sm" 
                :value="widgetUrl"
                v-model="widgetUrl" 
                type="text">
    </b-form-input>
    <br />
    <br />
    <label class="alertText" style="float: left; clear: left; display: inline; margin-right:6px">Widget:</label>
    <b-form-textarea id="specialContent" class="shareInput" v-model="iFrameCode" placeholder="Enter something" :rows="4" :max-rows="6"></b-form-textarea>

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
  watch: {
    routeData: function() {
      if (this.routeData)
        this.widgetUrl = window.location.origin + '/' + this.routeData.href;
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

.shareImg {
  cursor: pointer;
  margin-left: 4px;
  margin-right: 5px;
  margin-top: -6px;
 
}

.shareInput {
  width: 87%;
  display: inline;
  border-radius: 0px;
  border: 0px;
  font-size: 12px;
}

.shareInfoPanel {
    color: white;
    z-index: 5;
    width: 100%;
    padding: 10px;
    font-size: 11px;
    border-radius: 0px;
    height: 151px;
}

</style>