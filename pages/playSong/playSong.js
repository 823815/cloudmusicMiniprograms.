// pages/playSong/playSong.js
import pubSub from 'pubsub-js'
import request from '../../utils/request.js'
let appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    song: [],
    songId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSongDetail(options.songId)
    this.setData({
      songId: options.songId
    })
    if (appInstance.globalData.mucisPlaying && appInstance.globalData.musicId === options.songId){
      this.setData({
        isPlay: true
      })
    }
    this.backgroundManager = wx.getBackgroundAudioManager()
    this.backgroundManager.onPlay(() => {
      this.changePlayState(true)
      appInstance.globalData.musicId = options.songId
    })
    this.backgroundManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundManager.onStop(() => {
      this.changePlayState(false)
    })
  },
  changePlayState (isPlay){
    this.setData({
      isPlay
    })
    appInstance.globalData.mucisPlaying = isPlay
  },
  handlePlay() {
    let isPlay = !this.data.isPlay
    // this.setData({
    //   isPlay
    // })
    let id = this.data.songId
    this.musicControl(isPlay, id)
  },
  async getSongDetail(id) {
    let result =await request('/song/detail',{ids:id})
    // console.log(result)
    this.setData({
      song: result.songs[0]
    })
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },
  // 音乐控制
  async musicControl(isPlay,id) {
    if (isPlay) {
      // console.log('1111')
      let musicUrl =await request('/song/url',{id})
      // console.log(musicUrl.data[0].url)
      this.backgroundManager.src = musicUrl.data[0].url
      this.backgroundManager.title = this.data.song.name
    }else {
      this.backgroundManager.pause()
    }
  },
  // 点击切歌的回掉
  handleSwitch(e) {
    let type = e.currentTarget.id
    pubSub.publish('switchType', type)
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