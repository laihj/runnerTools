<template>
    <tr>
        <td>{{ rowdata.full }}</td>
        <td>{{ rowdata.half }}</td>
        <td>{{ rowdata[2] }}</td>
        <td>{{ rowdata[3] }}</td>
        <td>{{ rowdata[4] }}</td>
        <td>{{ rowdata[5] }}</td>
        <td>{{ rowdata[6] }}</td>
        <td>{{ rowdata[7] }}</td>
        <td>{{ rowdata[8] }}</td>
        <td>{{ rowdata[9] }}</td>
    </tr>
</template>

<script>
export default {
  name: 'DataRow',
  props: {
    rowdata: Array
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

td {
    padding: 10px;
}

table tr:nth-child(odd) {
    background: rgba(196, 199, 195, 0.859);
}

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