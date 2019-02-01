<template>
  <div>
    <i-index height="100%" @change="onChange($event)">
      <i-index-item
        v-for="(item, index) in typeList"
        :key="index"
        :name="item.key">
        <div
          class="content"
          v-for="(it, index1) in item.list"
          :key="index1"
          @click="isAdd(it)"
        >
          <span>{{it.country_en}}</span><span>{{it.currency_short}}</span>
        </div>
      </i-index-item>
    </i-index>
  </div>
</template>

<script>
import CountryData from '../../assets/js/data.js'

export default {
  data () {
    return {
      position: Number,
      arrList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'Y', 'Z'],
      typeList: []
    }
  },
  created () {
    this.getList()
  },
  mounted () {
    this.getPosition()
  },
  methods: {
    getPosition () {
      const query = this.$route.query
      const length = Object.keys(query).length
      if (length === 1) this.position = query.position
    },
    isAdd (it) {
      if (this.position >= 0) this.changeItem(it)
      else this.addItem(it)
    },
    addItem (it) {
      wx.getStorage({
        key: 'currency',
        success: res => {
          let result = res.data
          const hasItem = res.data.map(x => {
            return x.currency_short
          }).includes(it.currency_short)

          if (hasItem) {
            wx.showToast({
              title: 'This currency was already in the list !',
              icon: 'none',
              duration: 2000
            })
          } else {
            result.push(it)
            wx.setStorage({
              key: 'currency',
              data: result,
              success: () => {
                wx.showToast({
                  title: 'Add success !',
                  icon: 'none',
                  duration: 2000
                })
                this.$router.back()
              }
            })
          }
        }
      })
    },
    changeItem (it) {
      const index = parseInt(this.position)
      wx.getStorage({
        key: 'currency',
        success: res => {
          let result = res.data
          if (result[index].currency_short === it.currency_short) {
            wx.showToast({
              title: 'This currency was already in the list !',
              icon: 'none',
              duration: 2000
            })
          } else {
            result[index] = it
            wx.setStorage({
              key: 'currency',
              data: result,
              success: () => {
                wx.showToast({
                  title: 'Add success !',
                  icon: 'none',
                  duration: 2000
                })
                this.$router.back()
              }
            })
          }
        }
      })
    },
    onChange (event) {
      console.log(event.detail, 'click right menu callback data')
    },
    getList () {
      this.arrList.forEach((item, index) => {
        this.typeList[index] = {
          key: item,
          list: this.getOne(item)
        }
      })
      // console.log(this.typeList)
    },
    getOne (type) {
      let one = CountryData.filter(x => {
        return x.country_en.charAt(0) === type
      }).map(x => {
        return {'flag': x.flag_class, 'currency_short': x.currency_short, 'country_en': x.country_en}
      })
      return one
    }
  }
}
</script>

<style scoped lang="stylus">
.content
  display flex
  align-items center
  height 45px
  fontSize(14px)
  color $fontColor
  border-bottom 0.5px solid #dddee1
  & span
    padding 0 10px
.content:last-child
  border-bottom none
</style>
