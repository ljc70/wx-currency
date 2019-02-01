<template>
  <div>
    <div class="city_box">
      <i :class="'icon-flag '+flagFrom" style="background-image: url(/static/images/icon-flag.png)"></i>
      <span>{{ currencyFrom }}</span>
      <span class="exchange" @click="toggle"><i-icon type="enter" size="18" color="#6e6e6e" /></span>
      <i :class="'icon-flag '+flagTo" style="background-image: url(/static/images/icon-flag.png)"></i>
      <span>{{ currencyTo }}</span>
    </div>
    <ul class="month_list">
      <li v-for="(value, index) in monthArr" :key="index" @click="change(index)" :class="number === index ? 'active' : '' ">
        {{value}}
      </li>
    </ul>
    <div class="echarts-wrap">
      <mpvue-echarts :echarts="echarts" :onInit="initChart" canvasId="demo-canvas" />
      <div class="bottom" v-if="lineData.length > 0">
        <div class="box" id="box" ref="box" :style="{ width: boxWidth }"></div>
        <ul class="cur_list">
          <li class="fl">Lowest:{{ low }}</li>
          <li class="fl">Average:{{ average }}</li>
          <li class="fl">Highest:{{ high }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import mpvueEcharts from 'mpvue-echarts'

let chart = null

export default {
  data () {
    return {
      flagTo: '',
      currencyTo: '',
      flagFrom: '',
      currencyFrom: '',
      number: 0,
      monthArr: ['7 Days', '1 Month', '2 Months', '3 Months', 'Half Year'],
      echarts,
      high: '',
      low: '',
      average: '',
      boxWidth: '0%',
      lineData: []
    }
  },
  components: {
    mpvueEcharts
  },
  mounted () {
    this.getCurrency()
    this.change(0)
  },
  methods: {
    toggle () {
      const x = this.flagTo
      const y = this.flagFrom
      const cX = this.currencyTo
      const cY = this.currencyFrom
      this.flagTo = y
      this.flagFrom = x
      this.currencyTo = cY
      this.currencyFrom = cX
      this.change(this.number)
    },
    getCurrency () {
      const query = this.$route.query
      this.flagTo = query.flagTo
      this.currencyTo = query.currencyTo
      this.flagFrom = query.flagFrom
      this.currencyFrom = query.currencyFrom
    },
    drawChart () {
      let option = {
        grid: {
          left: -37,
          right: -37,
          top: 0,
          bottom: 100
        },
        xAxis: {
          show: false,
          type: 'category'
        },
        yAxis: {
          type: 'value',
          show: false,
          min: this.low,
          max: this.high
        },
        series: [
          {
            type: 'line',
            color: ['#4cbebd'],
            symbol: 'none',
            areaStyle: {
              color: '#c8edfc'
            },
            data: this.lineData
          }
        ]
      } // ECharts 配置项
      this.boxWidth = '100%'
      if (chart) chart.setOption(option)
    },
    initChart (canvas, width, height) {
      chart = echarts.init(canvas, 'light', {
        width: width,
        height: height
      })
      canvas.setChart(chart)
      return chart
    },
    formate (value) {
      const time = new Date(parseInt(value))
      const y = time.getFullYear()
      let m = time.getMonth() + 1
      m = m > 9 ? m : '0' + m
      let d = time.getDate()
      d = d > 9 ? d : '0' + d
      return y + '-' + m + '-' + d
    },
    change (index) {
      let now = new Date().getTime()
      let endDate = this.formate(now)
      let end
      this.number = index
      if (index === 0) {
        end = now - 7 * 24 * 3600 * 1000
      } else if (index === 1) {
        end = now - 30 * 24 * 3600 * 1000
      } else if (index === 2) {
        end = now - 60 * 24 * 3600 * 1000
      } else if (index === 3) {
        end = now - 90 * 24 * 3600 * 1000
      } else if (index === 4) {
        end = now - 180 * 24 * 3600 * 1000
      }
      const startDate = this.formate(end)
      this.fetchData(this.currencyFrom, this.currencyTo, startDate, endDate)
    },
    fetchData (baseCurrency, quoteCurrency, startDate, endDate) {
      this.$api.tendency({baseCurrency, quoteCurrency, startDate, endDate}).then(res => {
        const result = res.data.widget[0]
        const {high, average, low, data} = result
        this.high = high
        this.average = average
        this.low = low
        this.lineData = data.map(x => {
          return x[1]
        }).reverse()
        this.drawChart()
        // console.log(this.lineData)
      })
    }
  }
}
</script>
<style scoped lang="stylus">
.city_box
  display flex
  center()
  height 150px
  & span
    fontSize(14px)
    color $fontColor
    padding 0 10px
  & .exchange
    padding 0 20px

.month_list
  display flex
  align-items center
  justify-content space-around
  height 15px
  color $fontColor
  fontSize(14px)
  & li
    flex auto
    text-align center
  & li.active
    color #4cbebd

.echarts-wrap
  width 375px
  height 300px
  position fixed
  bottom 0
  left 0
.box,
.cur_list
  height 100px
  position absolute
  bottom 0 
  left 0
.box
  width 0%
  height 100px
  background #daf2fd
  transition all 1.1s linear
.cur_list
  width 100%
  display flex
  align-items center
  justify-content space-around
  & li
    fontSize(14px)
    color $fontColor
</style>