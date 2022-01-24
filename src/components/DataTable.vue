<template>
  <div id="plan" v-if="!showAll">
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
            <span v-html="discriptionOfWeekDay(scope.row, 0)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="easyslow" label="周二" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 1)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="easyfast" label="周三" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 2)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="lsd" label="周四" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 3)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="tempo" label="周五" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 4)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="strenght" label="周六" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 5)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="10k" label="周日" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 6)"></span>
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
      </el-table-column>
      <el-table-column prop="half" label="半马目标" />
      <el-table-column prop="recovery" label="恢复" />
      <el-table-column prop="easyslow" label="轻松跑慢" />
      <el-table-column prop="easyfast" label="轻松跑快" />
      <el-table-column prop="lsd" label="LSD" />
      <el-table-column prop="tempo" label="马拉松配速" />
      <el-table-column prop="strenght" label="力量跑" />
      <el-table-column prop="ten" label="10公里" />
      <el-table-column prop="five" label="5公里" />
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
      selectedDataRow: "abc",
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
        // this.$options.data.selectedDataRow = "abc"
        this.selectedDataRow = row
        this.showAll = false
        
      } else {
        this.tableData = this.data
        this.selectedDataRow = null
        // this.selectedRow = null
        this.showAll = true 
      }
    },
    exciseDiscriptionOfDay(week,day) {
      return week.schedule[day].excisedesc;
    },
    discriptionOfWeekDay(week,day) {
      var description = week.schedule[day].desc
      var exciseDesc = this.$options.methods.exciseDiscriptionOfDay(week,day)
      if(exciseDesc != undefined) {
        description = description + '<br />' + exciseDesc
      }
      var distance = this.$options.methods.distanceOfDay(week,day)
      if(distance > 0) {
        description = description + '<br />' + distance + ' 公里'
      }
      var duration = this.$options.methods.durationOfDay(this,week,day,this.selectedDataRow)
      if(duration.length > 0) {
        description = description + '<br />' + duration
      }
      // var seconds = secondOfString('12:13')
      // console.log(seconds)
      return description;
    },
    distanceOfDay(week, day) {
      var runSchedule = week.schedule[day]
      var distance = 0
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
      return distance.toFixed(1)
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
      return distance.toFixed(1);
    },
    secondOfString(time) {
      let timeArray = time.split(':')
      return parseInt(timeArray[0]) * 60 + parseInt(timeArray[1])
    },
    durationOfDay(that,week,day,row) {
      var runSchedule = week.schedule[day]
      if(row == undefined) {
        return ""
      } else {
        var slowDuration = 0
        var fastDuration = 0
        for (var i in runSchedule.excise) {
          var runDistance = runSchedule.excise[i]
          var distance = runDistance.distance
          var type = runDistance.paceType
          var slowSecond = 0
          var fastSecond = 0
          if(type == 'speed') {
            fastSecond = that.$options.methods.secondOfString(row.five)
            slowSecond = that.$options.methods.secondOfString(row.ten)
          } else if(type == 'easy') {
            slowSecond = that.$options.methods.secondOfString(row.easyslow)
            fastSecond = that.$options.methods.secondOfString(row.easyfast)
          } else if(type == 'recover') {
            slowSecond = that.$options.methods.secondOfString(row.recovery)
            fastSecond = that.$options.methods.secondOfString(row.recovery)
          } else if(type == 'lsd') {
            slowSecond = that.$options.methods.secondOfString(row.lsd)
            fastSecond = that.$options.methods.secondOfString(row.lsd)
          } else if(type == 'strenght') {
            slowSecond = that.$options.methods.secondOfString(row.strenght)
            fastSecond = that.$options.methods.secondOfString(row.strenght)
          } else if(type == 'tempo') {
            slowSecond = that.$options.methods.secondOfString(row.tempo)
            fastSecond = that.$options.methods.secondOfString(row.tempo)
          }
          slowDuration += distance * slowSecond
          fastDuration += distance * fastSecond
        }
        console.log(slowDuration)
        console.log(fastDuration)
        if(fastDuration == 0) {
          return ""
        }

        if(slowDuration == fastDuration) {
          return "预计: "+that.$options.methods.stringOfSecond(fastDuration)
        } else {
          return "预计: "+that.$options.methods.stringOfSecond(fastDuration) + "-" + that.$options.methods.stringOfSecond(slowDuration)
        }
      }      
    },
    stringOfSecond(second) {
      let hour = Math.floor(second / 3600)
      let minite = Math.floor((second - hour * 3600) / 60)
      let se = Math.round(second % 60)
      return hour.toString().padStart(2,"0") + ":" + minite.toString().padStart(2,"0") + ":" + se.toString().padStart(2, "0")
    }
  },
  setup() {
    
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