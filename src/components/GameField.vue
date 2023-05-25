<template>
  <v-stage
    ref="stage"
    :config="stageSize"
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
        :config="boardConfig"
      ></v-rect>
      <v-image
        v-if="showTip"
        :config="tipConfig"
      ></v-image>
      <v-rect
        v-for="ind of cellCount"
        :key="ind"
        :config="generateCell(ind - 1)"
      ></v-rect>
      <v-image
        v-for="ind = 1 of cellCount"
        :key="ind"
        :config="imagesConfigs[ind]"
        @dragmove="omImageDragMove"
      />
    </v-layer>
    <v-layer ref="tempLayer"></v-layer>
  </v-stage>
</template>

<script>
import eventHandlers from '@/mixins/eventHandlers'

const NUM_ROWS = 4
const NUM_COLS = 4
const CELL_WIDTH = 120
const CELL_HEIGHT = 120
const BOARD_BORDER_WIDTH = 10
const BOARD_WIDTH = CELL_WIDTH * NUM_COLS + BOARD_BORDER_WIDTH
const BOARD_HEIGHT = CELL_HEIGHT * NUM_ROWS + BOARD_BORDER_WIDTH


export default {
  mixins: [eventHandlers],
  props: {
    showTip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cellCount: NUM_COLS * NUM_ROWS,
      stageSize: {
        width: window.innerWidth - 100,
        height: 700
      },
      boardConfig: {
        x: 0,
        y: 10,
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        stroke: '#0c67ae',
        fill: 'lightblue',
        strokeWidth: BOARD_BORDER_WIDTH
      },
      tipConfig: {
        y: 10,
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        opacity: 0.3
      },
      cellConfig: {
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        stroke: '#0c67ae',
        strokeWidth: 1
      },
      imageConfig: {
        image: null,
        draggable: true
      },
      imagesConfigs: {},
      previousShape: null,
      boardX: 0 // величина, на которую много завязано
    }
  },
  mounted() {
    this.boardX = (this.stageSize.width) / 2 - BOARD_WIDTH / 2
    this.boardConfig.x = this.boardX
    this.generateImages()
    this.generateTip()
  },
  methods: {
    async generateImages() {
      const arr = [...Array(16).keys()].map(i => `${i + 1}`)
      const imgOrderArr = arr.sort(() => Math.random() - 0.5)
      // придумать алгоритм вычисления позиций
      const matrix = [[285, 0], [145, 0], [285, 140], [145, 140], [285, 280], [145, 280], [285, 420], [145, 420], [25, 0], [165, 0], [25, 140], [165, 140], [25, 280], [165, 280], [25, 420], [165, 420]]

      for (let i = 1; i <= this.cellCount; i++) {
        const image = new window.Image()
        const imgNum = imgOrderArr.shift()
        const imgUrl = new URL(`/public/puzzle/${imgNum}.jpg`, import.meta.url).href
        image.src = imgUrl

        image.onload = () => {
          this.imagesConfigs[i] = {
            id: `image-${i}`,
            // условие i <= this.cellCount / 2 распределяет картинки по обе стороны доски
            x: i <= this.cellCount / 2
              ? this.boardX - matrix[i - 1][0]
              : this.boardX + BOARD_WIDTH + matrix[i - 1][0],
            y: matrix[i - 1][1],
            image,
            draggable: true
          }
        }
      }
    },
    generateTip() {
      const image = new window.Image()
      const imgUrl = new URL('/public/puzzle/17.jpg', import.meta.url).href
      image.src = imgUrl
      image.onload = () => {
        this.tipConfig = {
          ...this.tipConfig,
          x: this.boardX,
          image
        }
      }
    },
    generateCell(cellInd) {
      const cellColInd = cellInd % NUM_COLS
      const cellRowInd = Math.floor(cellInd / NUM_ROWS)
      return {
        ...this.cellConfig,
        id: `cell-${cellColInd}-${cellRowInd}`,
        x: this.boardConfig.x + BOARD_BORDER_WIDTH / 2 + cellColInd * CELL_WIDTH,
        y: this.boardConfig.y + BOARD_BORDER_WIDTH / 2 + cellRowInd * CELL_HEIGHT
      }
    },
    shapeIsCell(shape) {
      return shape?.attrs.id?.includes('cell')
    },
    shapeIsImage(shape) {
      return shape?.attrs.id?.includes('image')
    }
  }
}
</script>

<style lang="scss" scoped></style>