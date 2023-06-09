import {
  CELL_WIDTH,
  CELL_HEIGHT,
  CELL_OFFSET_X,
  CELL_OFFSET_Y,
  HIGHLIGHT_COLOR
} from '@/helpers/constants'

export default {
  methods: {
    ondragstart(e) {
      // сохраняем начальные координаты перетаскиваемой картинки для того, чтобы вернуть ее обратно при неправильном перемещении     
      e.target.setAttr('startX', e.target.getX())
      e.target.setAttr('startY', e.target.getY())

      // перемещаем перетаскиваемую картинку на временный слой, чтобы засекать пересечения
      e.target.moveTo(this.$refs.tempLayer.getNode())
    },

    ondragmove(e) {
      const pos = e.currentTarget.getPointerPosition()
      const shape = this.$refs.mainLayer.getNode().getIntersection(pos)

      if (this.previousShape && this.shapeIsCell(shape)) {
        if (this.previousShape !== shape) {
          this.previousShape.fire(
            'dragleave',
            {
              evt: e.evt,
            },
            true
          );
          shape.fire(
            'dragenter',
            {
              evt: e.evt,
            },
            true
          );
          this.previousShape = shape;
        }
      } else if (!this.previousShape && this.shapeIsCell(shape)) {
        this.previousShape = shape
        shape.fire(
          'dragenter',
          {
            evt: e.evt,
          },
          true
        )
      } else if (this.previousShape && !this.shapeIsCell(shape)) {
        this.previousShape.fire(
          'dragleave',
          {
            evt: e.evt,
          },
          true
        );
        this.previousShape = null
      }
    },
    ondragend(e) {
      const pos = e.currentTarget.getPointerPosition()
      const shape = this.$refs.mainLayer.getNode().getIntersection(pos)

      const draggedImageState = this.puzzles[e.target.getAttr('index')].state

      if (this.shapeIsCell(shape)) {
        // если id ячейки совпадает с id правильной ячейки для переносимой картинки, выставляем на эту картинку флаг угаданности, в противном случае флаг снимаем
        if (draggedImageState.cellId === shape.id()) {
          draggedImageState.cellGuessed = true
        } else {
          draggedImageState.cellGuessed = false
        }
        this.previousShape.fire(
          'drop',
          {
            evt: e.evt,
            droppedShape: e.target
          },
          true
        )
      } else if (this.shapeIsImage(shape)) {
        e.target.setX(e.getAttr('startX'))
        e.target.setY(e.getAttr('startY'))
      } else {
        // если переносим картинку не на ячейку и не на другую картинку, флаг угаданности снимаем и последнюю посещенную ячейку обнуляем
        draggedImageState.cellGuessed = false
      }
      this.previousShape = null;
      e.target.moveTo(this.$refs.mainLayer.getNode())
    },
    ondragenter(e) {
      e.target.fill(HIGHLIGHT_COLOR)
    },
    ondragleave(e) {
      e.target.fill('transparent')
    },
    ondrop(e) {
      e.droppedShape.setX(e.target.attrs.x + CELL_OFFSET_X)
      e.droppedShape.setY(e.target.attrs.y + CELL_OFFSET_Y)
      this.playSound('/sounds/drop.mp3')

      // при каждом размещении картинок в ячейках, проверяем, собрали ли мы пазл
      this.checkIsWin()
    },
    omImageDragMove(e) {
      // выставляем границы перемещения картинок
      if (e.target.getX() - CELL_OFFSET_X < 0) {
        e.target.setX(CELL_OFFSET_X)
      } else if (e.target.getX() > this.stage.config.width - CELL_WIDTH + CELL_OFFSET_X) {
        e.target.setX(this.stage.config.width - CELL_WIDTH + CELL_OFFSET_X)
      }
      if (e.target.getY() - CELL_OFFSET_Y < 0) {
        e.target.setY(CELL_OFFSET_Y)
      } else if (e.target.getY() > this.stage.config.height - CELL_HEIGHT + CELL_OFFSET_Y) {
        e.target.setY(this.stage.config.height - CELL_HEIGHT + CELL_OFFSET_Y)
      }
    },
    onImageClick(e) {
      if (this.hardMode && e.evt.button === 2) {
        e.target.rotate(90)
        const draggedImageState = this.puzzles[e.target.getAttr('index')].state
        draggedImageState.rotationGuessed = e.target.rotation() % 360 === 0
        this.puzzles[e.target.getAttr('index')].transition.rotation = 400
        this.puzzles[e.target.getAttr('index')].transition.play()

        // при каждом перевороте картинки проверяем, собрали ли мы пазл
        this.checkIsWin()
      }
    }
  }
}