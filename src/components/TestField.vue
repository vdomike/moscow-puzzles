<template>
  <v-stage
    ref="stage"
    :config="stageSize"
  >
    <v-layer>
      <v-rect
        ref="test"
        @click="onClick"
        :config="testConfig"
      ></v-rect>
    </v-layer>

  </v-stage>
</template>

<script>
import Konva from "konva"
export default {
  data() {
    return {
      stageSize: {
        width: 600,
        height: 600
      },
      testConfig: {
        x: 200,
        y: 200,
        width: 200,
        height: 200,
        fill: 'red'
      },
      tr: null,
      toggle: false
    }
  },

  mounted() {
    this.testConfig.fill = 'green'
    console.log(this.$refs.test.getNode().attrs, this.$refs.test.getNode().getFill())
    this.tr = new Konva.Tween({
      node: this.$refs.test.getNode(),
      fill: 'yellow',
      easing: Konva.Easings.EaseInOut,
      duration: 0.5,
    })
  },

  methods: {
    onClick() {
      !this.toggle ? this.tr.play() : this.tr.reverse()
      this.toggle = !this.toggle
      console.log(this.$refs.test.getNode().attrs, this.$refs.test.getNode().getFill())
      // if (e.target.getFill() === 'green') {
      //   e.target.setFill('yellow')
      //   console.log('testConfig', this.testConfig, this.$refs.test.getNode())
      // } else {
      //   e.target.setFill('green')
      //   console.log('testConfig', this.testConfig, this.$refs.test.getNode())
      // }
    }
  }
}
</script>

<style scoped></style>