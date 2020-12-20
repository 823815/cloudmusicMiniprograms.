// pages/search/search.js
import require from '../../utils/request.js'
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showKeyword: '',
    hotList: [],
    keywords: '',
    searchList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchDefault()
    this.getHotDetail()
  },
  // 默认搜索
  async getSearchDefault() {
    let {data: res} =await require('/search/default')
    this.setData({
      showKeyword: res.showKeyword
    })
  },

  async getHotDetail() {
    let { data: res } = await require('/search/hot/detail')
    this.setData({
      hotList: res
    })
  },
  inputchange (e) {
    let keywords = e.detail.value
    this.setData({
      keywords
    })
    if (isSend){
      return
    }
    isSend = true
    // this.throttle(this.getSearch(), 3000)
    this.getSearch()
    setTimeout(() => {
      isSend = false
    },300)
  },
  async getSearch() {
    if (!this.data.keywords) {
      return
    }
    let { result: res } = await require('/search', {keywords: this.data.keywords, limit: 10 })
    // console.log(res)
    this.setData({
      searchList: res.songs
    })
  },
  // 节流
  // throttle: function(callback, time){
	// 	let start = 0
	// 	return function () {
  //     let currentDate = Date.now()
  //     if (currentDate - start > time) {
  //       callback(this, arguments)
  //       start = currentDate
  //     }
  //   }
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})