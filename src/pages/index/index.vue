<template>
  <div class="container">
    <i-swipeout
    :actions="actions"
    v-for="(value, index) in noramlList"
    :key="index"
    @change="clickToggle($event, index)"
    >
      <div slot="content" class="cell_wrap">
        <div class="flag_box">
          <i :class="'icon-flag '+value.flag" style="background-image: url(/static/images/icon-flag.png)"></i>
          <span class="unit_eg">{{value.currency_short}}</span>
          <span @click="currencyChart(value.flag, value.currency_short)" v-if="index > 0"><i-icon type="dynamic" size="20" color="#6e6e6e" /></span>
        </div>
        <div class="cell_item">
          <div class="currency">
            <input :value="resultList[index]" placeholder="0" type="digit" maxlength="15" @input="change($event, index)"/>
          </div>
          <p class="unit">{{value.country_en}}</p>
        </div>
      </div>  
    </i-swipeout>
    <i-modal
      :visible="visible"
      ok-text="Sure"
      cancel-text="Cancel"
      @ok="deleteItem"
      @cancel="visible = false"
    >
        <view>Delete this item ?</view>
    </i-modal>
    <div class="add">
      <a href="/pages/list/main">Add Currency</a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      number: Number,
      base: '',
      rateList: [],
      resultList: [],
      noramlList: [],
      actions: [
        {
          color: '#fff',
          fontsize: '26',
          width: 75,
          icon: 'enterinto',
          background: '#fa7686'
        },
        {
          width: 75,
          color: '#fff',
          fontsize: '26',
          icon: 'trash',
          background: '#e2162e'
        }
      ]
    }
  },
  onShow () {
    Object.assign(this.$data, this.$options.data())
    this.getCountry()
  },
  methods: {
    currencyChart (flag, currencyShort) {
      this.$router.push({ path: '/pages/chart/main',
        query: {
          flagTo: flag,
          currencyTo: currencyShort,
          flagFrom: this.noramlList[0].flag,
          currencyFrom: this.noramlList[0].currency_short
        }
      })
    },
    deleteItem () {
      this.noramlList.splice(this.number, 1)
      this.rateList.splice(this.number, 1)
      this.resultList.splice(this.number, 1)
      wx.setStorage({
        key: 'currency',
        data: this.noramlList
      })
      this.visible = false
    },
    clickToggle (ev, index) {
      const which = ev.target.index
      this.number = index
      if (which === 1) this.visible = true
      else this.$router.push({ path: '/pages/list/main', query: { position: index } })
    },
    change (ev, index) {
      const rate = this.rateList[index]

      let worth = ev.target.value
      if (worth === '') {
        this.base = ''
      } else {
        worth = parseFloat(worth)
        this.base = worth / rate
      }
      let resultList = this.rateList.map(x => {
        let result = parseFloat(this.base) * x
        if (result.toString().indexOf('.') !== -1) {
          if (result.toString().split('.')[1].length > 4) {
            result = result.toFixed(4)
          }
        }
        if (result.toString().length > 14) {
          result = result.toString().slice(0, 14)
        }
        return result
      })
      this.resultList = resultList
    },
    getCountry () {
      const list = [
        {
          'flag': 'icon-flag-cn',
          'currency_short': 'CNY',
          'country_en': 'Renminbi Yuan'
        },
        {
          'flag': 'icon-flag-us',
          'currency_short': 'USD',
          'country_en': 'U.S.Dollar'
        },
        {
          'flag': 'icon-flag-jp',
          'currency_short': 'JPY',
          'country_en': 'Japanese Yen'
        },
        {
          'flag': 'icon-flag-gb',
          'currency_short': 'GBP',
          'country_en': 'Pound Sterling'
        }
      ]

      wx.getStorage({
        key: 'currency',
        success: (res) => {
          this.noramlList = res.data
          this.getBase()
        },
        fail: () => {
          wx.setStorage({
            key: 'currency',
            data: list,
            success: () => {
              this.noramlList = list
              this.getBase()
            }
          })
        }
      })
    },
    getBase () {
      const currencyConverter = this.noramlList.map(x => {
        return `${this.noramlList[0].currency_short}_${x.currency_short}`
      })
      this.$api.fly.all(currencyConverter.map(x => this.$api.currency(x))).then(this.$api.fly.spread((...arr) => {
        let rateList = []

        for (let [key, value] of currencyConverter.entries()) {
          rateList.push(arr[key].data[value].val)
        }
        this.rateList = rateList
        // console.log(this.rateList)
      }))
    }
  }
}
</script>

<style scoped lang="stylus">
.cell_wrap
  display flex
  align-items center
  justify-content space-between
.flag_box
  display flex
  align-items center
.currency
  text-align right
  color $fontColor
  font-weight 900
  fontSize(18px)
.unit
  text-align right
  color #666
  fontSize(12px)
.unit_eg
  color $fontColor
  fontSize(14px)
  margin 0 10px
.add
  display flex
  fontSize(16px)
  color $fontColor
  height 74px
  border-bottom 0.5px solid #dddee1
.add a
  display flex
  center()
  width 100%
  height 100%
</style>
