<template>
  <div class="hello">
    <el-table :data="data" border stripe 
    :header-cell-style="{'text-align':'center', background:'#42b983',color:'#fff','font-size':'1.3em'}" 
    :cell-style="{'text-align':'center','font-size':'1.2em'}" 
    :header-row-style="{background: '#555'}" >
      <el-table-column prop="full" label="全马目标"  />
      <el-table-column prop="half" label="半马目标"  />
      <el-table-column prop="recovery" label="恢复" />
      <el-table-column prop="easyslow" label="轻松跑慢" />
      <el-table-column prop="easyfast" label="轻松跑快" />
      <el-table-column prop="lsd" label="LSD" />
      <el-table-column prop="tempo" label="马拉松配速" />
      <el-table-column prop="strenght" label="力量跑" />
      <el-table-column prop="10k" label="10公里" />
      <el-table-column prop="5k" label="5公里" />
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'DataTable',
  props: {
    data: Array
  },
  components: {
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.hello {
  margin: 0 auto;

}

.el-table {
    width: 90%;
    border-collapse: collapse;
    border-color: #acd7c3;
    margin: 0 auto;
}


.el-table-column {
  text-align: center;
}

/* table tr:nth-child(odd) {
    background: #ccc;
} */
</style>