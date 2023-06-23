<template>
  <v-stage
    ref="stage"
    :config="stage.config"
    @dragmove="ondragmove"
    @dragstart="ondragstart"
    @dragenter="ondragenter"
    @dragleave="ondragleave"
    @dragend="ondragend"
    @drop="ondrop"
  >
    <v-layer ref="mainLayer">
      <v-rect
        ref="board"
        :config="board.config"
      ></v-rect>
      <v-image
        ref="tip"
        :config="tip.config"
      ></v-image>
      <v-rect
        v-for="(cell, ind) in cells"
        :key="ind"
        :config="cell.config"
      ></v-rect>
      <v-image
        v-for="(puzzle, ind) in puzzles"
        :key="ind"
        :ref="($event) => getRef($event, puzzle)"
        :config="puzzle.config"
        @dragmove="omImageDragMove"
        @click="onImageClick"
      />
    </v-layer>
    <v-layer ref="tempLayer"></v-layer>
  </v-stage>
</template>

<script>
import eventHandlers from '@/mixins/eventHandlers'
import { Stage } from '@/helpers/models'
import {
  NUM_ROWS,
  NUM_COLS
} from '@/helpers/constants'


export default {
  mixins: [eventHandlers],
  props: {
    location: {
      type: String,
      required: true
    },
    showTip: {
      type: Boolean,
      default: false
    },
    hardMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      stage: new Stage(NUM_COLS, NUM_ROWS, this.location, this.hardMode),
      puzzles: [],
      cells: [],
      previousShape: null,
      board: {},
      tip: {}
    }
  },
  watch: {
    showTip(val) {
      if (val) {
        this.tip.transition.play()
      } else {
        this.tip.transition.reverse()
      }
    }
  },
  async mounted() {
    this.board = this.stage.generateBoard(this.$refs.board)
    this.cells = this.stage.generateCells()
    this.puzzles = await this.stage.generatePuzzles()
    this.tip = await this.stage.generateTip(this.$refs.tip)
  },
  methods: {
    getCellId(ind) {
      const cellColInd = ind % NUM_COLS
      const cellRowInd = Math.floor(ind / NUM_ROWS)
      return `cell-${cellColInd}-${cellRowInd}`
    },
    shapeIsCell(shape) {
      return shape?.getAttr('class') === 'Cell'
    },
    shapeIsImage(shape) {
      return shape?.getAttr('class') === 'Puzzle'
    },
    checkIsWin() {
      const isWin = Object.values(this.puzzles).every(puzzle => puzzle.state.cellGuessed && puzzle.state.rotationGuessed)

      console.log('isWin', isWin, 'this.puzzles', this.puzzles)

      if (isWin) {
        Object.values(this.puzzles).forEach(config => config.draggable = false)
        this.playSound('/sounds/win.mp3')
        this.$emit('win')
      }
    },
    playSound(url) {
      const audioUrl = new URL(url, import.meta.url).href
      const audio = new Audio(audioUrl)
      audio.play()
    },
    getRef(el, puzzle) {
      puzzle.setNode(el)
      // puzzle.setTransition()
    }
  }
}
</script>

<style lang="scss" scoped></style>