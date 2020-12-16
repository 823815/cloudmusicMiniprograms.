// pages/personal/personal.js
import request from '../../utils/request.js'
let startY = 0;
let moveY = 0;
let moveDistanc = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTrandform: "translateY(0rpx)",
    coverTransition: '',
    uesrInfo: '',
    recentPlayList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let uesrInfo = wx.getStorageSync('userInfo')
    if (uesrInfo){
      this.setData({
        userInfo: JSON.parse(uesrInfo)
      })
        this.getUserRecentPlayList(this.data.userInfo.userId)
    }
  },
  async getUserRecentPlayList(id){
    let result = await request('/user/record', { uid: id, type: 0 })
    let index = 0
    let recentPlayList = result.allData.splice(0, 10).map((item)=>{
      item.id = index++
      return item
    })
    this.setData({
      recentPlayList
    })
  },
  handleStart(e){
    startY = e.touches[0].clientY
    // console.log(startY)
    this.setData({
      coverTransition: ''
    })
  },
  handleMove(e){
    moveY = e.touches[0].clientY
    moveDistanc = moveY - startY
    if (moveDistanc <= 0){
      return
    } 
    if (moveDistanc >= 80){
      moveDistanc = 80
    }
    this.setData({
      coverTrandform: `translateY(${moveDistanc}rpx)`
    })

    // console.log(moveY)
  },
  handleEnd(){
    this.setData({
      coverTrandform: 'translateY(0rpx)',
      coverTransition: 'transform 1s linear'
    })
  },
  login(){
    wx.navigateTo({
      url: '/pages/login/login',
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