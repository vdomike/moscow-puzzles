const CELL_WIDTH = 120
const CELL_HEIGHT = 120

export default {
  methods: {
    ondragstart(e) {
      e.target.attrs.startX = e.target.getX()
      e.target.attrs.startY = e.target.getY()
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
      if (this.shapeIsCell(shape)) {
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
      }
      this.previousShape = null;
      e.target.moveTo(this.$refs.mainLayer.getNode());
    },
    ondragenter(e) {
      if (!this.showTip) {
        e.target.opacity(0.5)
      }
    },
    ondragleave(e) {
      e.target.opacity(1)
    },
    ondrop(e) {
      e.droppedShape.setX(e.target.attrs.x)
      e.droppedShape.setY(e.target.attrs.y)
    },
    omImageDragMove(e) {
      if (e.target.getX() < 0) {
        e.target.setX(0)
      } else if (e.target.getX() > this.stageSize.width - CELL_WIDTH) {
        e.target.setX(this.stageSize.width - CELL_WIDTH)
      }
      if (e.target.getY() < 0) {
        e.target.setY(0)
      } else if (e.target.getY() > this.stageSize.height - CELL_HEIGHT) {
        e.target.setY(this.stageSize.height - CELL_HEIGHT)
      }
    }
  }
}