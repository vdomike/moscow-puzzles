export const NUM_ROWS = 4
export const NUM_COLS = 4
export const CELL_WIDTH = 120
export const CELL_HEIGHT = 120
export const BOARD_BORDER_WIDTH = 10
export const BOARD_WIDTH = CELL_WIDTH * NUM_COLS + BOARD_BORDER_WIDTH
export const BOARD_HEIGHT = CELL_HEIGHT * NUM_ROWS + BOARD_BORDER_WIDTH
export const ROTATIONS = [0, 90, 180, 360]
export const CELL_OFFSET_X = CELL_WIDTH / 2
export const CELL_OFFSET_Y = CELL_HEIGHT / 2

export const PRIMARY_COLOR = '#0c67ae'
export const SECONDARY_COLOR = 'lightblue'
export const HIGHLIGHT_COLOR = '#cce2ea'

export const LOCATIONS = [
  {
    name: 'vdnkh',
    congratsComponent: 'CongratsVdnkh'
  },
  {
    name: 'moscow-city',
    congratsComponent: 'CongratsMoscowCity'
  }
]

export const PUZZLES_POS_MATRIX = [[285 - CELL_OFFSET_X, 0 + CELL_OFFSET_Y], [145 - CELL_OFFSET_X, 0 + CELL_OFFSET_Y], [285 - CELL_OFFSET_X, 140 + CELL_OFFSET_Y], [145 - CELL_OFFSET_X, 140 + CELL_OFFSET_Y], [285 - CELL_OFFSET_X, 280 + CELL_OFFSET_Y], [145 - CELL_OFFSET_X, 280 + CELL_OFFSET_Y], [285 - CELL_OFFSET_X, 420 + CELL_OFFSET_Y], [145 - CELL_OFFSET_X, 420 + CELL_OFFSET_Y], [25 + CELL_OFFSET_X, 0 + CELL_OFFSET_Y], [165 + CELL_OFFSET_X, 0 + CELL_OFFSET_Y], [25 + CELL_OFFSET_X, 140 + CELL_OFFSET_Y], [165 + CELL_OFFSET_X, 140 + CELL_OFFSET_Y], [25 + CELL_OFFSET_X, 280 + CELL_OFFSET_Y], [165 + CELL_OFFSET_X, 280 + CELL_OFFSET_Y], [25 + CELL_OFFSET_X, 420 + CELL_OFFSET_Y], [165 + CELL_OFFSET_X, 420 + CELL_OFFSET_Y]]