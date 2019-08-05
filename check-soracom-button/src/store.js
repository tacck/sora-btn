import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentPosition: {
      latitude: 0,
      longitude: 0
    },
    currentPositionUpdateCallback: {
      callback: () => {}
    },
    buttonPosition: {
      latitude: 0,
      longitude: 0,
      insertId: 0
    },
    buttonPositionUpdateCallback: {
      callback: () => {}
    },
    distance: {
      value: 0
    }
  },
  mutations: {
    setCurrenctPosition (state, payload) {
      console.log('store setCurrenctPosition:' + JSON.stringify(payload))
      state.currentPosition.latitude = payload.latitude
      state.currentPosition.longitude = payload.longitude
      state.currentPositionUpdateCallback.callback()
    },
    currentPositionUpdateCallback (state, callback) {
      if (callback) {
        state.currentPositionUpdateCallback.callback = callback
      }
    },
    setButtonPosition (state, payload) {
      console.log('store setButtonPosition:' + JSON.stringify(payload))
      state.buttonPosition.latitude = payload.latitude
      state.buttonPosition.longitude = payload.longitude
      state.buttonPosition.insertId = payload.insertId
      state.buttonPositionUpdateCallback.callback()
    },
    setButtonPositionUpdateCallback (state, callback) {
      if (callback) {
        state.buttonPositionUpdateCallback.callback = callback
      }
    },
    setDistance (state, payload) {
      console.log('store setDistance:' + JSON.stringify(payload))
      console.log(payload)
      state.distance.value = payload.distance
    }
  },
  actions: {

  }
})
