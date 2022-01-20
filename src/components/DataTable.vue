<template>
  <div class="hello">
      <table border="1">
    <tr>
        <th>全马目标</th>
        <th>半马目标</th>
        <th>恢复</th>
        <th>轻松跑A</th>
        <th>轻松跑B</th>
        <th>LSD</th>
        <th>马拉松配速</th>
        <th>力量跑</th>
        <th>速度跑A</th>
        <th>速度跑B</th>
    </tr>
    <DataRow v-for="datarow in data"
    :key="datarow[0]"
    :rowdata="datarow" />
</table>

  </div>
</template>

<script>
import DataRow from './DataRow.vue'

export default {
  name: 'DataTable',
  props: {
    data: Array
  },
  components: {
    DataRow,
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

table {
    width: 90%;
    border-collapse: collapse;
    border-color: #acd7c3;
    margin: 0 auto;

}

th {
    color: white;
    background: #42b983;
    padding: 10px;
}

td {
    padding: 10px;
}

/* table tr:nth-child(odd) {
    background: #ccc;
} */

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>