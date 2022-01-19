<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <DataTable :data="paceArray" />

</template>

<script>
import DataTable from './components/DataTable.vue'
import json from './assets/pace.json'

export default {
  name: 'App',
  components: {
    DataTable
  },
  setup() {
     return {
      paceArray : json
    }
   }
};

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; 
}
</style>
