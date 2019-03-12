<template>
<div id="app" >
  <router-view></router-view>
</div>
</template>

<script>
  export default {
    name: "app"
  };
</script>

<style>
  #app { height: 100%;}
  @import './assets/styles/portus.css';
  @import './assets/styles/darkTheme.css';
  @import './assets/styles/ocasoTheme.css';
</style>


