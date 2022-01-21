<template>
  <div id="plan" v-if="showAll">
    <h3>plan</h3>
    <div id="planOperation">
      <h3>操作区</h3>
    </div>
    <div id="planTable">
      <el-table
        :data="selectedPlanData"
        border
        stripe
        :header-cell-style="{ 'text-align': 'center', background: '#42b983', color: '#fff', 'font-size': '1.3em' }"
        :cell-style="{ 'text-align': 'center', 'font-size': '1.2em' }"
        :header-row-style="{ background: '#555' }"
      >
        <el-table-column prop="week" label="周数" />
        <el-table-column prop="recovery" label="周一" >
          <template #default="scope">
            <span>{{ discriptionOfWeekDay(scope.row, 0) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="easyslow" label="周二" >
          <template #default="scope">
            <span>{{ discriptionOfWeekDay(scope.row, 1) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="easyfast" label="周三" >
          <template #default="scope">
            <span>{{ discriptionOfWeekDay(scope.row, 2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lsd" label="周四" >
          <template #default="scope">
            <span>{{ discriptionOfWeekDay(scope.row, 3) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tempo" label="周五" >
          <template #default="scope">
            <span>{{ discriptionOfWeekDay(scope.row, 4) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="strenght" label="周六" >
          <template #default="scope">
            <span>{{ discriptionOfWeekDay(scope.row, 5) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="10k" label="周日" >
          <template #default="scope">
            <span>{{ discriptionOfWeekDay(scope.row, 6) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="5k" label="周跑量" >
          <template #default="scope">
            <span>{{ distanceOfWeek(scope.row) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div id="pace">
    <el-table
      :data="tableData"
      border
      stripe
      :header-cell-style="{ 'text-align': 'center', background: '#42b983', color: '#fff', 'font-size': '1.3em' }"
      :cell-style="{ 'text-align': 'center', 'font-size': '1.2em' }"
      :header-row-style="{ background: '#555' }"
      @row-click="rowClick"
    >
      <el-table-column prop="full" label="全马目标">
        <template #default="scope">
          <span>{{ dataOfRow(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="half" label="半马目标" />
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

import basicPlan from '../assets/basicPlan.json'

export default {
  name: 'DataTable',
  props: {
    data: Array
  },
  data: function () {
    return {
      tableData: this.data,
      showAll: true,
      selectedRow: this.data[0],
      basicPlanData: basicPlan,
      selectedPlanData: basicPlan
    }
  },
  components: {
  },
  methods: {
    rowClick(row) {
      // this.tableData = [row]
      // alert(row.full)
      if (this.showAll) {
        this.tableData = [row]
        this.showAll = false
        this.selectedRow = row
      } else {
        this.tableData = this.data
        this.showAll = true
        this.selectedRow = ""
      }
    },
    dataOfRow(row) {
      return row.lsd
    },
    discriptionOfWeekDay(week,day) {
      return week.schedule[day].desc
    },
    distanceOfWeek(week) {
      var distance = 0
      for(var i in week.schedule) {
        var runSchedule = week.schedule[i]
        if(runSchedule.warm) {
          distance += 0
        }
        if(runSchedule.cold) {
          distance += 0
        }
        for (var runi in runSchedule.excise) {
          var runDistance = runSchedule.excise[runi]
          distance += runDistance.distance
        }
      }
      return distance;
    }
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
</style>