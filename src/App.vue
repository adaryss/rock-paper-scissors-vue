<template>
  <Layout>
    <Content />
  </Layout>
</template>

<script>
import Layout from './components/Layout.vue'
import Content from './components/Content.vue'
import 'reset-css';

export default {
  name: 'App',
  components: { Layout, Content }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
