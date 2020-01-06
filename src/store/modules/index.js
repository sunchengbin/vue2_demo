const adopt = {
  state: {
    songInfo: {}
  },
  mutations: {
    SAVE_GM_SONGINFO (state, songInfo) {
      state.songInfo = songInfo || ''
    }
  }
}

export default adopt
