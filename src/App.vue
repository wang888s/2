<template>
  <div id="app">
    <div class="container">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
          <!-- 这里是会被缓存的视图组件 -->
        </router-view>
      </keep-alive>

      <router-view v-if="!$route.meta.keepAlive">
        <!-- 这里是不会被缓存的视图组件 -->
      </router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {}
  },
  mounted() {
  }
}
</script>

<style>
html {
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: 100vh;
  /*min-width: 1600px;*/
  overflow: auto;
}

.container {
  /*min-width: 1600px;*/
  margin: 0 auto;
}

#nprogress .bar {
  /* background: #08D829 !important; */
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 6px;
  box-shadow: inset 0 0 4px #66ffff;
  background: unset;
}

::-webkit-scrollbar {
  width: 10px;
  background: unset;
  height: 20px;
}

::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 4px rgba(0, 144, 255, 0.5);
  border-radius: 6px;
  background: unset;
}
</style>
