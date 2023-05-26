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
      // TODO: переместить сохранение позиций в this.gameState
      e.target.attrs.startX = e.target.getX()
      e.target.attrs.startY = e.target.getY()
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
      const draggedImageId = e.target.id()
      if (this.shapeIsCell(shape)) {
        // сохраняем последнюю ячейку, где была картинка
        // this.gameState[draggedImageId].previousCell = shape.id()       

        // если id ячейки совпадает с id правильной ячейки для переносимой картинки, выставляем на эту картинку флаг угаданности, в противном случае флаг снимаем
        if (this.gameState[draggedImageId]?.cellId === shape.id()) {
          this.gameState[draggedImageId].cellGuessed = true
        } else {
          this.gameState[draggedImageId].cellGuessed = false
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
        e.target.setX(e.target.attrs.startX)
        e.target.setY(e.target.attrs.startY)
      } else {
        // если переносим картинку не на ячейку и не на другую картинку, флаг угаданности снимаем и последнюю посещенную ячейку обнуляем
        this.gameState[draggedImageId].cellGuessed = false
      }
      this.previousShape = null;
      e.target.moveTo(this.$refs.mainLayer.getNode());
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
      this.playSound('/public/sounds/drop.wav')

      // при каждом размещении картинок в ячейках, проверяем, собрали ли мы пазл
      this.checkIsWin()
    },
    omImageDragMove(e) {
      // выставляем границы перемещения картинок
      if (e.target.getX() - CELL_OFFSET_X < 0) {
        e.target.setX(CELL_OFFSET_X)
      } else if (e.target.getX() > this.stageSize.width - CELL_WIDTH + CELL_OFFSET_X) {
        e.target.setX(this.stageSize.width - CELL_WIDTH + CELL_OFFSET_X)
      }
      if (e.target.getY() - CELL_OFFSET_Y < 0) {
        e.target.setY(CELL_OFFSET_Y)
      } else if (e.target.getY() > this.stageSize.height - CELL_HEIGHT + CELL_OFFSET_Y) {
        e.target.setY(this.stageSize.height - CELL_HEIGHT + CELL_OFFSET_Y)
      }
    },
    onImageClick(e) {
      if (this.hardMode && e.evt.button === 2) {
        e.target.rotate(90)
        this.gameState[e.target.id()].rotationGuessed = e.target.rotation() % 360 === 0

        // при каждом перевороте картинки проверяем, собрали ли мы пазл
        this.checkIsWin()
      }
    }
  }
}