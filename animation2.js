'use strict';

const store = new Vuex.Store({
  state: {
    docState: 'saved',
    buttonMessage: 'Edit',
    view: 'trans-button',
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    nextNum: 10
  },
  mutations: {
    changeDocState: (state, payload) => {
      state.docState = payload.button;
    },
    changeButtonMessage: state => {
      switch (state.docState) {
        case 'saved': {
          state.buttonMessage = 'Edit';
          return;
        } case 'edited': {
          state.buttonMessage = 'Save';
          return;
        } case 'editing': {
          state.buttonMessage = 'Cancel';
          return;
        }
      }
    },
    changeView: state => state.view = state.view === 'trans-button' ? 'gash-comp' : 'trans-button',
    changeItem: (state, payload) => {
      let random = function() {
        return ~~(Math.random() * state.items.length);
      }
      if (payload.mode !== 'add') state.items.splice(random(), 1);
      else state.items.splice(random(), 0, state.nextNum++);
    }
  }
})


const component1 = {
  computed: Vuex.mapState({
    buttonMessage: state => state.buttonMessage,
    docState: state => state.docState
  }),
  methods: {
    change: function() {
      let button = ['edited', 'saved', 'editing'][~~(Math.random() * 2.99)];
      store.commit('changeDocState', { button: button });
      store.commit('changeButtonMessage');
    }
  },
  template: `
  <transition name="fade" mode="out-in">
    <button :key="docState" @click="change">
      {{ buttonMessage }}
    </button>
  </transition>
  `
}

const component2 = {
  template: `
  <div>
    <h2>Tash pash sash</h2>
    <p>Ugagagash</p>
  </div>
  `
}


const anim1 = new Vue({
  el: '#anim-app',
  store,
  computed: Vuex.mapState({
    view: state => state.view
  }),
  components: {
    transButton: component1,
    gashComp: component2
  },
  methods: Vuex.mapMutations({
    change: 'changeView'
  }),
  template: `
  <div>
    <button @click="change">Change!</button>
    <transition name="fade" mode="out-in">
      <component :is="view"></component>
    </transition>
  </div>
  `
});

const anim2 = new Vue({
  el: '#anim2-app',
  store,
  computed: Vuex.mapState({
    items: state => state.items
  }),
  methods: Vuex.mapMutations({
    add: {
      type: 'changeItem',
      mode: 'add'
    },
    remove: 'changeItem'
  }),
  template: `
  <div>
    <button @click="add">Add!</button>
    <button @click="remove">Delete</button>
    <transition-group name="list" tag="p">
      <span v-for="item in items" :key="item" class="list-item">
        {{ item }}
      </span>
    </transition-group>
  </div>
  `
})
