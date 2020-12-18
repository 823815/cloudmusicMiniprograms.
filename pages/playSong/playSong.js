// pages/playSong/playSong.js
import pubSub from 'pubsub-js'
import request from '../../utils/request.js'
import moment from 'moment'
let appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    song: [],
    songId: '',
    musicUrl: '',
    currentTime:'00:00',
    durationTime: '00:00',
    progressMovePercent: 0
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
    this.backgroundManager.onEnded(() => {
      pubSub.publish('switchType', 'next')
      this.setData({
        currentTime: '00:00',
        progressMovePercent: 0
      })
    })
    //监听音乐实时播放时间
    this.backgroundManager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundManager.currentTime*1000).format('mm:ss')
      let progressMovePercent = this.backgroundManager.currentTime / this.backgroundManager.duration*450
      // console.log(progressMovePercent)
      this.setData({
        currentTime,
        progressMovePercent
      })
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
    let { songId, musicUrl} = this.data
    this.musicControl(isPlay, songId, musicUrl)
  },
  async getSongDetail(id) {  
    let result =await request('/song/detail',{ids:id})
    // console.log(result)
    this.setData({
      song: result.songs[0],
      durationTime: moment(result.songs[0].dt).format('mm:ss')
    })
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },
  // 音乐控制
  async musicControl(isPlay, id, musicUrl) {
    if (isPlay) {
      // console.log('1111')
      if(!musicUrl) {
        let musicData = await request('/song/url', { id })
        musicUrl = musicData.data[0].url
        this.setData({
          musicUrl
        })
      }
      // console.log(musicUrl.data[0].url)
      this.backgroundManager.src = musicUrl
      this.backgroundManager.title = this.data.song.name
    }else {
      this.backgroundManager.pause()
    }
  },
  // 点击切歌的回掉
  handleSwitch(e) {
    let type = e.currentTarget.id
    // console.log(type)
    pubSub.subscribe('musicId', (msg, data) => {
      // console.log(data)
      this.setData({
        songId: data
      })
      this.backgroundManager.stop()
      this.getSongDetail(data)
      this.musicControl(true, data)
      pubSub.unsubscribe('musicId')
    })
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