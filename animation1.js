'use strict';


const store = new Vuex.Store({
    state: {
        show: true
    },
    mutations: {
        toggleShow: state => state.show = !state.show,
    }
});

const componentAn = {
    props: {
        name: String
    },
    data() {
        return {show: true,}
    },
    methods: {
        toggle: function() { this.show = !this.show }
    },
    template: `
    <div>
      <button @click="toggle">Toggle!</button>
      <transition :name="name">
        <p v-if="show"><slot>Hello, Vue animation!</slot></p>
      </transition>
    </div>
    `
}


const animation1 = new Vue({
    el: '#animation1',
    store,
    components: {componentAn},
    methods: Object.assign({}, {
        beforeEnter: function(el) {
            el.style.opacity = 0;
        },
        enter: function(el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em'}, { duration: 300 });
            Velocity(el, { fontSize: '1em' }, {complete: done})
        },
        leave: function(el, done) {
            Velocity(el, {translateX: '15x', rotateZ: '50deg'}, {duration: 600});
            Velocity(el, {rotateZ: '100deg'}, {loop: 2});
            Velocity(el, { roteteZ: '45deg', translateY: '30px', translateX: '30px', opacity: 0}, {complete: done})
        }
    },
    Vuex.mapMutations({
        toggle: 'toggleShow'
    })),
    computed: Vuex.mapState({
        show: state => state.show,
    }),
    template: `
    <div>
        <component-an name="fade"></component-an>
        <component-an name="slide-fade"></component-an>
        <component-an name="bounce">Clouds in Camarilla, life dance so unreal, now I hearing stories that they told me</component-an>
      <button @click="toggle">Toggle!</button>
      <transition name="custom-classes-transition"
        enter-active-class="animated tada"
        leave-active-class="animated bounceOutRight"
        >
        <p v-if="show">Hello, Vue animation!</p>
      </transition>
      <transition @before-enter="beforeEnter" @enter="enter"
        @leave="leave" :css="false">
        <p v-if="show">Demo Vue + js animation</p>
      </transition>
    </div>
    `
})


const chooseCity = () => {
    let cities = ['Ангало', 'Aттар']
}
