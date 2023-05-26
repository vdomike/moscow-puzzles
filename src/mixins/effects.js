import Konva from "konva"

export default {
  data() {
    return {
      tipOpacityTransition: null,
      imageRotateTransitions: {}
    }
  },
  mounted() {
    this.tipOpacityTransition = this.addTipOpacityTransition()
    // for (let i = 0; i < this.cellCount; i++) {
    //   const id = `image-${i + 1}`
    //   this.imageRotateTransitions[id] = this.addImageRotateTransition(this.refs[id])
    // }
  },
  methods: {
    addTipOpacityTransition() {
      return new Konva.Tween({
        node: this.$refs.tip.getNode(),
        opacity: 0.3,
        easing: Konva.Easings.EaseInOut,
        duration: 0.5,
      })
    },
    // addImageRotateTransition(node) {
    //   return new Konva.Tween({
    //     node,
    //     opacity: 0.3,
    //     easing: Konva.Easings.EaseInOut,
    //     duration: 0.5,
    //   })
    // }
  }
}