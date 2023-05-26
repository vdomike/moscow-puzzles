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
        v-show="showTip"
        ref="tip"
        :config="tipConfig"
      ></v-image>
      <v-rect
        v-for="ind of cellCount"
        :key="ind"
        :config="cellsConfigs[ind - 1]"
      ></v-rect>
      <v-image
        v-for="ind of cellCount"
        :key="ind"
        :ref="`image-${ind}`"
        :config="imagesConfigs[ind - 1]"
        @dragmove="omImageDragMove"
        @click="onImageClick"
      />
    </v-layer>
    <v-layer ref="tempLayer"></v-layer>
  </v-stage>
</template>

<script>
import eventHandlers from '@/mixins/eventHandlers'
import effects from '@/mixins/effects'
import {
  NUM_ROWS,
  NUM_COLS,
  CELL_WIDTH,
  CELL_HEIGHT,
  BOARD_BORDER_WIDTH,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  ROTATIONS,
  CELL_OFFSET_X,
  CELL_OFFSET_Y,
  PRIMARY_COLOR,
  SECONDARY_COLOR
} from '@/helpers/constants'


export default {
  mixins: [eventHandlers, effects],
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
      cellCount: NUM_COLS * NUM_ROWS,
      stageSize: {
        width: window.innerWidth - 100,
        height: 600
      },
      boardConfig: {
        x: 0,
        y: 10,
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        stroke: PRIMARY_COLOR,
        fill: SECONDARY_COLOR,
        strokeWidth: BOARD_BORDER_WIDTH,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: { x: 2, y: 2 },
        shadowBlur: 5,
        cornerRadius: 3
      },
      tipConfig: {
        y: 10,
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        opacity: 0
      },
      cellConfig: {
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        stroke: PRIMARY_COLOR,
        strokeWidth: 1
      },
      textConfig: {
        text: 'УРА! ПОБЕДА!', fontSize: 40, fill: 'white'
      },
      gameState: {},
      cellsConfigs: {},
      imagesConfigs: {},
      previousShape: null,
      boardX: 0, // величина, на которую много завязано
    }
  },
  watch: {
    showTip(val) {
      if (val) {
        this.tipOpacityTransition.play()
      } else {
        this.tipOpacityTransition.reverse()
      }
    }
  },
  mounted() {
    this.boardX = (this.stageSize.width) / 2 - BOARD_WIDTH / 2
    this.boardConfig.x = this.boardX
    // временное решение с текстом
    this.textConfig.x = this.boardX + 100
    this.textConfig.y = this.boardConfig.y + BOARD_WIDTH / 2
    this.generateCells()
    this.generateImages()
    this.generateTip()
  },
  methods: {
    generateCells() {
      for (let i = 0; i < this.cellCount; i++) {
        const cellColInd = i % NUM_COLS
        const cellRowInd = Math.floor(i / NUM_ROWS)
        const cellId = `cell-${i + 1}`

        this.cellsConfigs[i] = {
          ...this.cellConfig,
          id: cellId,
          x: this.boardConfig.x + BOARD_BORDER_WIDTH / 2 + cellColInd * CELL_WIDTH,
          y: this.boardConfig.y + BOARD_BORDER_WIDTH / 2 + cellRowInd * CELL_HEIGHT
        }
      }
    },
    async generateImages() {
      const arr = [...Array(16).keys()].map(i => `${i + 1}`)
      const imgOrderArr = arr.sort(() => Math.random() - 0.5)
      // придумать алгоритм вычисления позиций
      const matrix = [[285 - CELL_OFFSET_X, 0 + CELL_OFFSET_Y], [145 - CELL_OFFSET_X, 0 + CELL_OFFSET_Y], [285 - CELL_OFFSET_X, 140 + CELL_OFFSET_Y], [145 - CELL_OFFSET_X, 140 + CELL_OFFSET_Y], [285 - CELL_OFFSET_X, 280 + CELL_OFFSET_Y], [145 - CELL_OFFSET_X, 280 + CELL_OFFSET_Y], [285 - CELL_OFFSET_X, 420 + CELL_OFFSET_Y], [145 - CELL_OFFSET_X, 420 + CELL_OFFSET_Y], [25 + CELL_OFFSET_X, 0 + CELL_OFFSET_Y], [165 + CELL_OFFSET_X, 0 + CELL_OFFSET_Y], [25 + CELL_OFFSET_X, 140 + CELL_OFFSET_Y], [165 + CELL_OFFSET_X, 140 + CELL_OFFSET_Y], [25 + CELL_OFFSET_X, 280 + CELL_OFFSET_Y], [165 + CELL_OFFSET_X, 280 + CELL_OFFSET_Y], [25 + CELL_OFFSET_X, 420 + CELL_OFFSET_Y], [165 + CELL_OFFSET_X, 420 + CELL_OFFSET_Y]]

      for (let i = 0; i < this.cellCount; i++) {
        const image = new window.Image()
        const imgNum = imgOrderArr.shift()
        const imgUrl = new URL(`/public/puzzle/${this.location}/${imgNum}.jpg`, import.meta.url).href
        image.src = imgUrl

        const imageId = `image-${imgNum}`

        image.onload = () => {
          const rotationChoice = Math.floor(Math.random() * ROTATIONS.length)
          const rotation = ROTATIONS[rotationChoice]

          this.imagesConfigs[i] = {
            id: imageId,
            // условие i <= this.cellCount / 2 распределяет картинки по обе стороны доски
            x: i < this.cellCount / 2
              ? this.boardX - matrix[i][0]
              : this.boardX + BOARD_WIDTH + matrix[i][0],
            y: matrix[i][1],
            image,
            rotation: this.hardMode ? rotation : 0,
            shadowColor: 'black',
            shadowOpacity: 0.5,
            shadowOffset: { x: 1, y: 1 },
            shadowBlur: 3,
            offset: {
              x: CELL_OFFSET_X,
              y: CELL_OFFSET_Y,
            },
            draggable: true
          }
          this.gameState[imageId] = {
            cellId: `cell-${imgNum}`,
            image: this.imagesConfigs[i],
            cellGuessed: false,
            rotationGuessed: !this.hardMode || rotation % 360 === 0
          }
        }
      }
    },
    generateTip() {
      const image = new window.Image()
      const imgUrl = new URL(`/public/puzzle/${this.location}/tip.jpg`, import.meta.url).href
      image.src = imgUrl
      image.onload = () => {
        this.tipConfig = {
          ...this.tipConfig,
          x: this.boardX,
          image
        }
      }
    },
    getCellId(ind) {
      const cellColInd = ind % NUM_COLS
      const cellRowInd = Math.floor(ind / NUM_ROWS)
      return `cell-${cellColInd}-${cellRowInd}`
    },
    shapeIsCell(shape) {
      return shape?.attrs.id?.includes('cell')
    },
    shapeIsImage(shape) {
      return shape?.attrs.id?.includes('image')
    },
    checkIsWin() {
      const isWin = Object.values(this.gameState).every(({ cellGuessed, rotationGuessed }) => cellGuessed && rotationGuessed)

      if (isWin) {
        Object.values(this.imagesConfigs).forEach(config => config.draggable = false)
        this.playSound('/public/sounds/win.wav')
        this.$emit('win')
      }
    },
    playSound(url) {
      const audio = new Audio(url);
      audio.play();
    }
  }
}
</script>

<style lang="scss" scoped></style>