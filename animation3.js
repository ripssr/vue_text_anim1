'use strict';

const store = new Vuex.Store({
  state: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10,
    cells: Array.apply(null, { length: 81} )
      .map(function (_, index) {
        return {
          id: index,
          number: index % 9 + 1
        }
      }),
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Lee' },
      { msg: 'Kung Furie' }
    ]
  },
  mutations: {
    shuffleSudoku: state => state.cells = _.shuffle(state.cells),
    shuffleItems: state => state.items = _.shuffle(state.items),
    addItem: state => state.items.splice(~~(Math.random() * state.items.length), 0, state.nextNum++),
    removeItem: state => state.items.splice(~~(Math.random() * state.items.length), 1)
  },
  actions: {

  }
});


const component1 = {
  template: `
  <div>
    <button @click="shuffle">Shuffle!</button>
    <button @click="add">Add!</button>
    <button @click="remove">Remove</button>
    <transition-group name="flip-list" tag="ul">
      <li v-for="item in items" :key="item"
        class="flip-list-item">
        {{ item }}
      </li>
    </transition-group>
  </div>
  `,
  computed: Vuex.mapState({
    items: state => state.items,
  }),
  methods: Vuex.mapMutations({
    shuffle: 'shuffleItems',
    add: 'addItem',
    remove: 'removeItem'
  })
};


const component2 = {
  template: `
  <div>
    <h1>Lazy Sudoku</h1>
    <p>Keep hitting the shuffle button untill you win!</p>
    <button @click="shuffle">Shuffle!</button>
    <transition-group name="cell" tag="div" class="container">
      <div v-for="cell in cells" :key="cell.id" class="cell">
        {{ cell.number }}
      </div>
    </transition-group>
  </div>`,
  methods: Vuex.mapMutations({
    shuffle: 'shuffleSudoku'
  }),
  computed: Vuex.mapState({
    cells: state => state.cells
  })
};


const component3 = {
  data () {
    return { query: '', }
  },
  template: `
  <div>
    <input v-model="query" />
    <transition-group name="straggered-fade" tag="ul" :css="false"
      @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <li v-for="(item, index) in computedList" :key="item.msg"
        :data-index="index">
        {{ item.msg }}
      </li>
    </transition-group>
  </div>`,
  computed: Object.assign({}, Vuex.mapState({
    list: state => state.list
    }), {
    computedList: function() {
      let vm = this; 
      return vm.list.filter(function(item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1;
      });
    }
  }),
  methods: {
    beforeEnter: function(el) {
      el.style.opacity = el.style.height = 0;
    },
    enter: function(el, done) {
      let delay = el.dataset.index * 150;
      setTimeout(function() {
        Velocity(el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function(el, done) {
      let delay = el.dataset.index * 150;
      setTimeout(function() {
        Velocity(el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
}


const component4 = {
  template: `
  <div>
    Fade In: <input type="range" v-model="fadeInDuration"
              min="0" :max="maxFadeDuration" />
    Fade Out: <input type="range" v-model="fadeOutDuration"
               min="0" :max="maxFadeDuration" />
    <transition :css="false" @before-enter="beforeEnter"
      @enter="enter" @leave="leave">
      <p v-if="show">Hello Vue!</p>
    </transition>
    <button v-if="stop" @click="stop = false; show = false">
      Run Animation!
    </button>
    <button v-else @click = "stop = true">
      Stop Animation
    </button>
  </div>`,
  data() {
    return {
      show: true,
      fadeInDuration: 1000,
      fadeOutDuration: 1000,
      maxFadeDuration: 1500,
      stop: true
    };
  },
  mounted: function() {
    this.show = false;
  },
  methods: {
    beforeEnter: function(el) {
      el.style.opacity = 0;
    },
    enter: function(el, done) {
      let vm = this;
      Velocity(el,
        { opacity: 1 },
        {
          duration: this.fadeInDuration,
          complete: function() {
            done();
            if (!vm.stop) vm.show = false;
          }
        }
      )
    },
    leave: function(el, done) {
      let vm = this;
      Velocity(el,
        { opacity: 0 },
        {
          duration: this.fadeOutDuration,
          complete: function() {
            done();
            vm.show = true;
          }
        }
      )
    }
  }
}


const anim1 = new Vue({
  el: '#anim-pr1',
  store,
  components: {
    groupComp: component1,
    lazySudoku: component2,
    straggeredList: component3,
    dynamicFade: component4
  },
  template: `
  <div>
    <group-comp></group-comp>
    <lazy-sudoku></lazy-sudoku>
    <straggered-list></straggered-list>
    <dynamic-fade></dynamic-fade>
  </div>`
});
