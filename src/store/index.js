import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex);

let state = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}
}

let actions = {}

const store = new Vuex.Store({
    state,
    mutations: {
        updateUserInfo (state, payload) {
            console.log(state, payload)
            localStorage.setItem('userInfo', JSON.stringify(payload))
            state.userInfo = Object.assign({}, state.userInfo, payload)
        },
        getUserInfo (state) {

        }
    },
    actions
})

export default store
