// pages/recommendSong/recommendSong.js
import pubSub from 'pubsub-js'
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendSongList: [],
    index: 0, //歌曲下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登陆
    let userInfo = wx.getStorageInfoSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        success:() => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }

    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth()+1
    })
    this.getRecommendSongList()

    // 订阅来自playSong页面的消息
    pubSub.subscribe('switchType', (msg, data) => {
      let { recommendSongList, index} = this.data
      // console.log(data)
      if (data === 'last') {
        (index === 0) && (index = recommendSongList.length)
        index -= 1
      }else {
       ( index === recommendSongList.length - 1) && (index = -1)
        index += 1
        // console.log(recommendSongList.length,'1111')
      }
      this.setData({
        index
      })
      let musicId = recommendSongList[index].id
      pubSub.publish('musicId',musicId)
    })
  },

  // 获取每日数据
  async getRecommendSongList() {
    let result = await request('/recommend/songs')
    // console.log(result)
    this.setData({
      recommendSongList: result.recommend
    })
  },
  toPlaySong(e) {
    let {index, song} = e.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/playSong/playSong?songId=' + song.id,
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