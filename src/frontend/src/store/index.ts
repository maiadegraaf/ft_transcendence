import Vuex from 'vuex';

export default new Vuex.Store({
    state: {
        selectedUser: null,
    },
    mutations: {
        setSelectedUser(state, user) {
            state.selectedUser = user;
        },
    },
    actions: {
        storeSelectedUser({ commit }, user) {
            commit('setSelectedUser', user);
        },
    },
});
