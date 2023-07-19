<template id="alldata">
<div id="printplan">
  <br />
  <br />
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
  <br />
  <br />
  <div id="plan" v-if="!showAll">
    <div class="opration">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select v-model="planType" placeholder="选择计划" size="large" @change="selectOne">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1.4"><div>热身距离</div></el-col>
        <el-col :span="3"><el-input v-model="cold" placeholder="缓和距离" /></el-col>
        <el-col :span="1"><div></div></el-col>
        <el-col :span="1.4"><div>缓和距离</div></el-col>
        <el-col :span="3"><el-input v-model="cold" placeholder="缓和距离" /></el-col>
      </el-row>
    </div>
    <br />
    <div id="planTable">
      <el-table
        v-loading="loading"
        :data="selectedPlanData"
        border
        stripe
        :header-cell-style="{ 'text-align': 'center', background: '#42b983', color: '#fff', 'font-size': '1.3em' }"
        :cell-style="{ 'text-align': 'center', 'font-size': '1.2em' }"
        :header-row-style="{ background: '#555' }"
      >
        <el-table-column prop="week" label="周数" width="100" />
        <el-table-column label="周一" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 0)"></span>
          </template>
        </el-table-column>
        <el-table-column label="周二" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 1)"></span>
          </template>
        </el-table-column>
        <el-table-column label="周三" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 2)"></span>
          </template>
        </el-table-column>
        <el-table-column label="周四" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 3)"></span>
          </template>
        </el-table-column>
        <el-table-column label="周五" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 4)"></span>
          </template>
        </el-table-column>
        <el-table-column label="周六" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 5)"></span>
          </template>
        </el-table-column>
        <el-table-column label="周日" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 6)"></span>
          </template>
        </el-table-column>

        <el-table-column label="周跑量" width="200" >
          <template #default="scope">
            <span>{{ distanceOfWeek(scope.row) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
  </div>
</div>
  <br />
  <br />
  <el-button type="primary" @click="print" >打印计划</el-button>
  <br />
  <br />
</template>

<script>
import basicPlan from '../assets/basicPlan.json'
import advancePlan from '../assets/advancePlan.json'
import html2Canvas from "html2canvas"
import JsPDF from "jspdf"
import { ElLoading } from 'element-plus'

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
      selectedPlanData: basicPlan,
      warm:"1.6",
      cold:"1.6",
      printLayout:false,
      loading:false,
      planType: "初级跑步计划",
      options : [
            {
              value: 'basic',
              label: '初级跑步计划',
            },
            {
              value: 'advance',
              label: '高级跑步计划',
            }]
    }
  },
  components: {
  },
  methods: {
    selectOne(event,item) {
        if(this.planType == '初级跑步计划') {
          this.selectedPlanData = basicPlan
        } else {
          this.selectedPlanData = advancePlan
        }
    },
    rowClick(row) {
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
      var distance = this.$options.methods.distanceOfDay(week,day,this.warm,this.cold)
      if(distance > 0) {
        description = description + '<br />' + this.warm.toFixed(1) + '+' +  distance.toFixed(1) + '+' + thie.cold.toFixed(1) + ' 公里'
      }
      var duration = this.$options.methods.durationOfDay(this,week,day,this.selectedDataRow,this.warm,this.cold)
      if(duration.length > 0) {
        description = description + '<br />' + duration
      }
      return description;
    },
    distanceOfDay(week, day, warm,cold) {
      var runSchedule = week.schedule[day]
      var distance = 0
      // if(runSchedule.warm) {
      //   if(warm.length > 0) {
      //     distance += parseFloat(warm)
      //   }
      // }
      // if(runSchedule.cold) {
      //   if(cold.length > 0) {
      //     distance += parseFloat(cold)
      //   }
      // }
      for (var runi in runSchedule.excise) {
        var runDistance = runSchedule.excise[runi]
        distance += runDistance.distance
      }
      return distance
    },

    distanceOfWeek(week) {
      var distance = 0
      for(var i in week.schedule) {
        var distanceDay = this.$options.methods.distanceOfDay(week,i,this.warm,this.cold)
        distance += distanceDay;
      }
      return distance.toFixed(1);
    },
    secondOfString(time) {
      let timeArray = time.split(':')
      return parseInt(timeArray[0]) * 60 + parseInt(timeArray[1])
    },
    durationOfDay(that,week,day,row,warm,cold) {
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
        slowSecond = that.$options.methods.secondOfString(row.easyslow)
        fastSecond = that.$options.methods.secondOfString(row.easyfast)
        if(runSchedule.warm) {
          if(warm.length > 0) {
            slowDuration += parseFloat(warm) * slowSecond
            fastDuration += parseFloat(warm) * fastSecond
          }
          
        }
        if(runSchedule.cold) {
          if(cold.length > 0) {
            slowDuration += parseFloat(cold) * slowSecond
            fastDuration += parseFloat(cold) * fastSecond
          }
        }

        if(fastDuration == 0) {
          return ""
        }

        if(slowDuration == fastDuration) {
          return that.$options.methods.stringOfSecond(fastDuration)
        } else {
          return that.$options.methods.stringOfSecond(fastDuration) + "-" + that.$options.methods.stringOfSecond(slowDuration)
        }
      }      
    },
    stringOfSecond(second) {
      let hour = Math.floor(second / 3600)
      let minite = Math.floor((second - hour * 3600) / 60)
      let se = Math.round(second % 60)
      return hour.toString().padStart(2,"0") + ":" + minite.toString().padStart(2,"0") + ":" + se.toString().padStart(2, "0")
    },
    refresh(event) {
      // `this` inside methods points to the current active instance
      alert('Hello ' + this.input + '!')
      // `event` is the native DOM event
      if (event) {
        alert(event.target.tagName)
      }
    },
    print() {
      window.pageYOffset = 100;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const loading = ElLoading.service({
        lock: true,
        text: 'PDF生成后下载',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      html2Canvas(document.querySelector(`#printplan`), {
        allowTaint: true,
        taintTest: false,
        useCORS: true,
        dpi: window.devicePixelRatio * 4,
        scale: 4,
      }).then(function(canvas) {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let pageHeight = (contentWidth / 592.28) * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        let imgWidth = 595.28;
        let imgHeight = (592.28 / contentWidth) * contentHeight;
        let pageData = new Image();
        pageData.setAttribute("crossOrigin", "Anonymous");
        pageData = canvas.toDataURL("image/jpeg", 1.0);
        let PDF = new JsPDF("", "pt", "a4");
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, "JPEG", 0, 50, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            if (leftHeight > 0) {
              PDF.addPage();
            }
          }
        }
        PDF.save("plan" + ".pdf");
        loading.close()
      });
    },
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-row {
  align-items: center;
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.hello {
  margin: 0 auto;
}
.opration {
  width: 95%;
  margin: auto;
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