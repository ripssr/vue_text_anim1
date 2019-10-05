'use strict';

const store = new Vuex.Store({
  state: {
    tweenedNumber: 0,
    color: {
      red: 0,
      green: 0,
      blue: 0,
      alpha: 1
    }
  },
  mutations: {
    newTweened: (state, payload) => {
      TweenLite.to(state, 0.5, { tweenedNumber: payload.tweened });
    },
    newColor: (state, payload) => state.color = new net.brehaut.Color(payload.query).toRGB(),
  },
  getters: {
    animatedNumber: state => {
      return state.tweenedNumber.toFixed(0);
    }
  }
})

const component1 = {
  template: `
  <div>
    <input v-model.number="number" type="number" step="20" />
    <p>{{ animatedNumber }}</p>
  </div>`,
  computed: Object.assign({}, Vuex.mapState({
    tweenedNumber: state => state.tweenedNumber,
  }), Vuex.mapGetters([
    'animatedNumber'
  ])),
  watch: {
    number: function(newValue) {
      store.commit('newTweened', { tweened: newValue });
    }
  },
  data() {
    return {
      number: 0
    };
  }
}

const component2 = {
  template: `
  <div>
    <input v-model="colorQuery" @keyup.enter="updateColor"
      placeholder="Input your color" />
    <button @click="updateColor">Update!</button>
    <p>Prelook:</p>
    <span :style="{ backgroundColor: tweenedCSSColor }"
      class="exaple-color-preview"></span>
    <p>{{ tweenedCSSColor }}</p>
  </div>`,
  data() {
    return {
      colorQuery: '',
      tweenedColor: {}
    }
  },
  computed: Object.assign({}, Vuex.mapState({
    color: state => state.color,
  }), {
    tweenedCSSColor: function() {
      return new net.brehaut.Color({
        red: this.tweenedColor.red,
        green: this.tweenedColor.green,
        blue: this.tweenedColor.blue,
        alpha: this.tweenedColor.alpha
      }).toCSS();
    },
  }),
  methods: {
    updateColor: function() {
      store.commit('newColor', { query: this.colorQuery });
      this.colorQuery = '';
    }
  },
  created: function() {
    this.tweenedColor = Object.assign({}, this.color);
  },
  watch: {
    color: function() {
      function animate() {
        if (TWEEN.update()) requestAnimationFrame(animate);
      }

      new TWEEN.Tween(this.tweenedColor)
        .to(this.color, 750)
        .start();

      animate();
    }
  }
}

const component3 = {
  template: `
  <div>
    <svg width="200" height="200">
      <polygon :points="points"></polygon>
      <circle cx="100" cy="100" r="90"></circle>
    </svg>
    <label>Sides: {{ sides }}</label>
    <input type="range" min="3" max="500" v-model.number="sides" />
    <label>Minimum Radius: {{ minRadius }}%</label>
    <input type="range" min="0" max="90" v-model.number="minRadius" />
    <label>Update Interval: {{ updateInterval }} milliseconds</label>
    <input type="range" min="10" max="2000" v-model.number="updateInterval" />
  </div>`,
  data () {
    let defaultSides = 10;
    let stats = Array.apply(null, { length: defaultSides })
      .map(function() { return 100 })
    return {
      stats: stats,
      points: this.generatePoints(stats),
      sides: defaultSides,
      minRadius: 50,
      interval: null,
      updateInterval: 500
    }
  },
  watch: {
    sides: function(newSides, oldSides) {
      let sidesDifferrence = newSides - oldSides;
        if (sidesDifferrence > 0) for (let i = 1; i - sidesDifferrence; i++) this.stats.push(this.newRandomValue());
        else for(let i = 1; i + sidesDifferrence; i++) this.stats.shift();
    },
    stats: function(newStats) {
      TweenLite.to(this.$data, this.updateInterval / 1000, {
        points: this.generatePoints(newStats)
      })
    },
    updateInterval: function() {
      this.resetInterval();
    }
  },
  mounted: function() {
    this.resetInterval();
  },
  methods: {
    randomizeStats: function() {
      let vm = this;
      this.stats = this.stats.map(function() {
        return vm.newRandomValue();
      })
    },
    newRandomValue: function() {
      return Math.ceil(this.minRadius + Math.random() * (100 - this.minRadius));
    },
    resetInterval: function() {
      let vm = this;
      clearInterval(this.interval);
      this.randomizeStats();
      this.interval = setInterval(function() {
        vm.randomizeStats();
      }, this.updateInterval);
    },
    generatePoints: function(stats) {
      let total = stats.length;
      let vm = this;
      return stats.map(function(stat, index) {
        let point = vm.valueToPoint(stat, index, total);
        return point.x + ', ' + point.y;
      }).join(' ');
    },
    valueToPoint: function(value, index, total) {
      let x = 0;
      let y = -value * 0.9;
      let angle = Math.PI * 2 / total * index;
      let cos = Math.cos(angle);
      let sin = Math.sin(angle);
      let tx = x * cos - y * sin + 100;
      let ty = x * sin + y * cos + 100;
      return {
        x: tx,
        y: ty
      }
    }
  }
}

Vue.component('animated-integer', {
  template: '<span>{{ tweeningValue }}</span>',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      tweeningValue: 0
    };
  },
  watch: {
    value: function(newValue, oldValue) {
      this.tween(oldValue, newValue);
    }
  },
  mounted: function() {
    this.tween(0, this.value);
  },
  methods: {
    tween: function(startValue, endValue) {
      let vm = this;
      function animate() {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }

      new TWEEN.Tween({ tweeningValue: startValue })
        .to({ tweeningValue: endValue }, 500)
        .onUpdate(function() {
          vm.tweeningValue = this.tweeningValue.toFixed(0);
        })
        .start();

      animate();
    }
  }
})

const component4 = {
  template: `
  <div>
    <input v-model.number="firstNumber" type="number" step="20" /> + 
    <input v-model.number="secondNumber" type="number" step="20" /> = 
    {{ result }}
    <p>
      <animated-integer :value="firstNumber"></animated-integer> + 
      <animated-integer :value="secondNumber"></animated-integer> = 
      <animated-integer :value="result"></animated-integer>
    </p>
  </div>`,
  data() {
    return {
      firstNumber: 20,
      secondNumber: 40
    }
  },
  computed: {
    result: function() {
      return this.firstNumber + this.secondNumber;
    }
  }
}

const animation = new Vue({
  el: '#animation',
  store,
  components: {
    firstComponent: component1,
    secondComponent: component2,
    thirdComponent: component3,
    fourthComponent: component4
  },
  template: `
  <div>
    <first-component></first-component>
    <second-component></second-component>
    <third-component></third-component>
    <fourth-component></fourth-component>
  </div>`
})
