import Konva from "konva"

import {
  CELL_WIDTH,
  CELL_HEIGHT,
  BOARD_BORDER_WIDTH,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  ROTATIONS,
  CELL_OFFSET_X,
  CELL_OFFSET_Y,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  PUZZLES_POS_MATRIX
} from '@/helpers/constants'

const boardY = 10 // временная константа для хранения позиции y доски, нужна для синхронизации с этой же позицией у картинки с подсказкой

class BaseShape {
  constructor(config = {}, nodeRef) {
    this.config = {
      ...config,
      class: this.constructor.name
    }
    this.setNode(nodeRef)
  }

  setNode(ref) {
    this.node = ref?.getNode()
  }

  generateImage(url) {
    return new Promise(resolve => {
      const image = new window.Image()
      const imgUrl = new URL(url, import.meta.url).href
      image.src = imgUrl
      image.onload = () => {
        resolve(image)
      }
    })
  }

  getRandomImageOrderArr(numCols, numRows) {
    const arr = [...Array(numCols * numRows).keys()].map(i => `${i + 1}`)
    const randomOrderArr = arr.sort(() => Math.random() - 0.5)
    return randomOrderArr
  }
}

export class Stage extends BaseShape {
  constructor(numCols, numRows, location, hardMode) {
    super({
      width: window.innerWidth - 100,
      height: 600
    })
    this.numCols = numCols
    this.numRows = numRows
    this.location = location
    this.hardMode = hardMode

    this.board = {}
    this.cells = []
    this.puzzles = []
    this.tip = {}
  }

  generateBoard(ref) {
    this.board = new Board(this.getBoardX(), ref)
    return this.board
  }

  generateCells() {
    for (let i = 0; i < this.numCols * this.numRows; i++) {
      const cellColInd = i % this.numCols
      const cellRowInd = Math.floor(i / this.numRows)
      const cellId = `cell-${i + 1}` // нумерация с 1, чтобы соответствовали id картинок

      this.cells[i] = new Cell({
        id: cellId,
        x: this.getBoardX() + BOARD_BORDER_WIDTH / 2 + cellColInd * CELL_WIDTH,
        y: this.board.config.y + BOARD_BORDER_WIDTH / 2 + cellRowInd * CELL_HEIGHT
      })
    }
    return this.cells
  }

  async generatePuzzles() {
    const randomOrderArr = this.getRandomImageOrderArr(this.numCols, this.numRows)
    const imageLoadPromises = []

    for (let i = 0; i < this.numCols * this.numRows; i++) {
      const imgNum = randomOrderArr.shift()
      const imageId = `image-${imgNum}`
      const rotationChoice = Math.floor(Math.random() * ROTATIONS.length)
      const rotation = ROTATIONS[rotationChoice]

      const config = {
        id: imageId,
        index: i,
        x: i < this.numCols * this.numRows / 2
            ? this.getBoardX() - PUZZLES_POS_MATRIX[i][0]
            : this.getBoardX() + BOARD_WIDTH + PUZZLES_POS_MATRIX[i][0],
        y: PUZZLES_POS_MATRIX[i][1],
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

      this.puzzles[i] = new Puzzle(config)

      imageLoadPromises[i] = this.generateImage(`/public/puzzle/${this.location}/${imgNum}.jpg`)
        .then(image => {
          this.puzzles[i].config.image = image
      })

      this.puzzles[i].setState({
        cellId: `cell-${imgNum}`,
        cellGuessed: false,
        rotationGuessed: !this.hardMode || rotation % 360 === 0
      })
    }
    return this.puzzles
  }

  async generateTip(ref) {
    const image = await this.generateImage(`/public/puzzle/${this.location}/tip.jpg`)
    this.tip = new Tip({ image, x: this.board.config.x }, ref)
    return this.tip
  }

  getBoardX() {
    return (this.config.width) / 2 - BOARD_WIDTH / 2
  }
}

export class Board extends BaseShape {
  constructor(x, ref) {
    super({
      x,
      y: boardY,
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
    }, ref)
    this.cells = []
    this.puzzles = []
    this.tip = {}
  }
}

class Cell extends BaseShape {
  constructor(config) {
    super({
      width: CELL_WIDTH,
      height: CELL_HEIGHT,
      stroke: PRIMARY_COLOR,
      strokeWidth: 1,
      class: 'Cell',
      ...config
    })
  }
}

class Puzzle extends BaseShape {
  constructor(config, ref) {
    super({
      ...config
    }, ref)
    this.state = {}
    this.transition = null
  }

  setState(state) {
    this.state = state
  }

  // setTransition() {
  //   const nodeCreated = this.node?.getImage()
  //   if (nodeCreated && !this.transition) {
  //     console.log('rotation', this.node.getRotation())
  //     this.transition = new Konva.Tween({
  //       node: this.node,
  //       rotation: this.node.getRotation() + 90,
  //       easing: Konva.Easings.EaseInOut,
  //       onUpdate: () => console.log('node attrs updated', this.node.getRotation()),
  //       duration: 0.5
  //     })
  //   }    
  // }
}

class Tip extends BaseShape {
  constructor(config, ref) {
    super({
      y: boardY,
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      ...config
    }, ref)

    this.node.setOpacity(0)

    this.transition = new Konva.Tween({
      node: this.node,
      opacity: 0.3,
      easing: Konva.Easings.EaseInOut,
      duration: 0.5,
    })
  }
}