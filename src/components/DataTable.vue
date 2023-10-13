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
      <el-table-column prop="full" label="Full Marathon">
      </el-table-column>
      <el-table-column prop="half" label="Half Marathon" />
      <el-table-column prop="recovery" label="Rest" />
      <el-table-column prop="easyslow" label="Easy slow" />
      <el-table-column prop="easyfast" label="Easy fast" />
      <el-table-column prop="lsd" label="LSD" />
      <el-table-column prop="tempo" label="MP" />
      <el-table-column prop="strenght" label="@MP-10" />
      <el-table-column prop="ten" label="10 KM " />
      <el-table-column prop="five" label="5 KM " />
    </el-table>
  </div>
  <br />
  <div id="plan" v-if="!showAll">
    <div class="opration">
      <el-row :gutter="20">
        <el-col :span="0.35"><div></div></el-col>
        <el-col :span="4">
          <el-select v-model="planType" placeholder="Choose Plan" size="large" @change="selectOne">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1.4"><div>Warm up</div></el-col>
        <el-col :span="3"><el-input v-model="cold" placeholder="Warm up" /></el-col>
        <el-col :span="1"><div></div></el-col>
        <el-col :span="1.4"><div>Coll down</div></el-col>
        <el-col :span="3"><el-input v-model="cold" placeholder="Cool down" /></el-col>
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
        <el-table-column prop="week" label="Week" width="100" />
        <el-table-column label="Monday" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 0)"></span>
          </template>
        </el-table-column>
        <el-table-column label="Tuesday" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 1)"></span>
          </template>
        </el-table-column>
        <el-table-column label="Wednesday" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 2)"></span>
          </template>
        </el-table-column>
        <el-table-column label="Thursday" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 3)"></span>
          </template>
        </el-table-column>
        <el-table-column label="Friday" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 4)"></span>
          </template>
        </el-table-column>
        <el-table-column label="Saturday" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 5)"></span>
          </template>
        </el-table-column>
        <el-table-column label="Sunday" >
          <template #default="scope">
            <span v-html="discriptionOfWeekDay(scope.row, 6)"></span>
          </template>
        </el-table-column>

        <el-table-column label="Weekly Mileage" width="200" >
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
  <el-button type="primary" @click="print" >Get PDF</el-button>
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
      planType: "Beginner",
      options : [
            {
              value: 'basic',
              label: 'Beginner',
            },
            {
              value: 'advance',
              label: 'Advanced',
            }]
    }
  },
  components: {
  },
  methods: {
    selectOne(event,item) {
        if(this.planType == 'Beginner') {
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
        description = description + '<br /><br />' + exciseDesc
      }
      var distance = this.$options.methods.distanceOfDayString(week,day,this.warm,this.cold)
      if(distance.length > 0) {
        description = description + '<br /><br />' + distance + '  KM '
      }
      var duration = this.$options.methods.durationOfDay(this,week,day,this.selectedDataRow,this.warm,this.cold)
      if(duration.length > 0) {
        description = description + '<br /><br />' + duration
      }
      return description;
    },
    distanceOfDayString(week, day, warm, cold) {
      var runDistance = ''
      var runSchedule = week.schedule[day]
      var distance = 0
      if(runSchedule.warm) {
        if(warm.length > 0) {
          runDistance += parseFloat(warm).toFixed(1)
          runDistance += '+'
        }
      }

      for (var runi in runSchedule.excise) {
        var singleRunDistance = runSchedule.excise[runi]
        distance += singleRunDistance.distance
      }
      if(distance > 0) {
        runDistance = runDistance + distance.toFixed(1)
      }
      

      if(runSchedule.cold) {
        if(cold.length > 0) {
          runDistance += '+'
          runDistance += parseFloat(cold).toFixed(1) 
        }
      }
      return runDistance
    },

    distanceOfDay(week, day, warm,cold) {
      var runSchedule = week.schedule[day]
      var distance = 0
      if(runSchedule.warm) {
        if(warm.length > 0) {
          distance += parseFloat(warm)
        }
      }

      for (var runi in runSchedule.excise) {
        var singleRunDistance = runSchedule.excise[runi]
        distance += singleRunDistance.distance
      }

      if(runSchedule.cold) {
        if(cold.length > 0) {
          distance += parseFloat(cold)
        }
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