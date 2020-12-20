// pages/video/video.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    selectItemId: null,
    videoGroup: [],
    oldId: '',
    videoPlayTime: [],
    isRefresh: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupData()
  },
  async getVideoGroupData(){
    let result =await request('/video/group/list')
    this.setData({
      videoGroupList: result.data.slice(0, 10),
      selectItemId: result.data[0].id
    })
    this.getVideoData(this.data.selectItemId)
  },
  // 获取视频列表
  async getVideoData(id){
    let result = await request('/video/group',{id})
    let index = 0
    let videoGroup = result.datas.map(item => {
      item.index = index++
      return item
    })
    this.setData({
      videoGroup,
      isRefresh: false
    })
    wx.hideLoading()
  },
  handleHasClass(e){
    this.setData({
      selectItemId: e.currentTarget.id * 1,
      videoGroup: ''
    })
    wx.showLoading({
      title: '正在加载...',
    })
    this.getVideoData(this.data.selectItemId)
  },
  // 视频播放触发
  handlePlay(e){
    // let videoContext
    // if (!this.data.oldId){
    //   this.setData({
    //     oldId:e.currentTarget.id
    //   })
    // } else if (this.data.oldId === e.currentTarget.id){
    //   return
    // }else
    // {
    //   videoContext = wx.createVideoContext(this.data.oldId)
    //   videoContext.stop()
    //   this.setData({
    //     oldId: e.currentTarget.id
    //   }) 
    // }
    this.setData({
      oldId: e.currentTarget.id
    }) 
    let videoContext = wx.createVideoContext(this.data.oldId)
    let { videoPlayTime } = this.data
    let videoPlayTimeItem = videoPlayTime.find(item => item.id === e.currentTarget.id)
    if (videoPlayTimeItem) {
      videoContext.seek(videoPlayTimeItem.playTime)
    }
  },
  //视频播放进度变化时触发
  handleTime(e) {
    // console.log(e)
    let videoPlayTimeObj = { id: e.currentTarget.id, playTime: e.detail.currentTime}
    let { videoPlayTime } = this.data
    let videoPlayTimeItem = videoPlayTime.find(item => item.id === videoPlayTimeObj.id )
    if (videoPlayTimeItem) {
      // console.log(e.detail.currentTime)
      videoPlayTimeItem.playTime = e.detail.currentTime
    }else{
      videoPlayTime.push(videoPlayTimeObj)
    }
    this.setData({
      videoPlayTime
    })
  },
  //视频播放结束
  handlend (e) {
    let { videoPlayTime} = this.data
    videoPlayTime.findIndex(item => item.id === e.currentTarget.id)
    videoPlayTime.splice(videoPlayTime.findIndex(item => item.id === e.currentTarget.id), 1)
    this.setData({
      videoPlayTime
    })
  },
  //下拉加载刷新
  handleRefresh (){
    this.getVideoData(this.data.selectItemId)
  },
  //拉到底部加载
  handleToLower() {

  },
  shearch (){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  /**
                                                                       9 '* 生命周期函数--监听页面初次渲染完成
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
  onShareAppMessage: function (from) {
    // console.log(arguments)
  }
})