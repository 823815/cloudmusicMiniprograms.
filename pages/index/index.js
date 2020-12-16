// pages/index/index.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[], //轮播图数据
    personalizedList: [],//推荐歌曲请求
    topList: [],// 排行榜请求
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // banner轮播图请求
    let bannerListData = await request('/banner', { type: 2 })
    this.setData({
      bannerList: bannerListData.banners
    })
    //推荐歌曲请求
    let personalizedListData = await request('/personalized', { limit: 10 }) 
    this.setData({
      personalizedList: personalizedListData.result
    })
    // 排行榜请求
    let index = 0
    let resultArr = []
    while (index < 5) {
      let topListDate = await request('/top/list', { idx: index++ })
      let topListItem = { id: topListDate.playlist.id, name: topListDate.playlist.name, tracks: topListDate.playlist.tracks.slice(0, 3)}
      resultArr.push(topListItem)
      this.setData({
        topList: resultArr
      })
    }
    this.setData({
      bannerList: bannerListData.banners,
      personalizedList: personalizedListData.result,
    })
  },

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