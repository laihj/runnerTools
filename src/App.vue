<template>
  <h1>Hanson Marathon Method Pace Chart</h1>
  <h3 class="hint">Generate Training Plan Based on Your Marathon Goal</h3>
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
}
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

.hint {
  color: #4b4f53;
}
</style>
