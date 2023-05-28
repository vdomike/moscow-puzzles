<template>
  <header>
    <img
      alt="Moscow puzzles logo"
      class="logo"
      src="./assets/logo.png"
    />
  </header>
  <GameMenu
    :hardMode="hardMode"
    :showTip="showTip"
    @changeLocation="changeLocation"
    @toggleMode="toggleMode"
    @refresh="refresh"
    @toggleTip="showTip = !showTip"
  />

  <main>
    <GameField
      :key="fieldKey"
      :showTip="showTip"
      :hardMode="hardMode"
      :location="currentLocation"
      @win="win"
    />
  </main>
  <div id="modal"></div>

  <Modal
    v-model="showCongrats"
    :close="closeCongrats"
    :key="modalKey"
  >
    <div class="modal">
      <Component :is="currentCongratsComponent" />
    </div>
  </Modal>
</template>

<script>
import GameField from '@/components/GameField.vue'
import GameMenu from '@/components/GameMenu.vue'
import CongratsVdnkh from '@/components/congrats/CongratsVdnkh.vue'
import CongratsMoscowCity from '@/components/congrats/CongratsMoscowCity.vue'
import { LOCATIONS } from '@/helpers/constants'

export default {
  components: { GameField, GameMenu, CongratsVdnkh, CongratsMoscowCity },
  data() {
    return {
      showTip: false,
      hardMode: false,
      fieldKey: 0,
      showCongrats: false,
      currentLocationNum: 0,
      modalKey: 0
    }
  },

  created() {
    document.oncontextmenu = this.disableСontextMenu
  },

  computed: {
    currentLocation() {
      return LOCATIONS[this.currentLocationNum].name
    },
    currentCongratsComponent() {
      return LOCATIONS[this.currentLocationNum].congratsComponent
    }
  },

  methods: {
    disableСontextMenu(e) {
      const clickedEl = e.target.tagName
      if (clickedEl == "CANVAS") {
        return false
      }
    },
    refresh() {
      this.fieldKey++
      this.showTip = false
    },
    toggleMode() {
      this.hardMode = !this.hardMode
      this.refresh()
    },
    changeLocation(name) {
      this.currentLocationNum = LOCATIONS.findIndex(x => x.name === name)
      this.refresh()
    },
    win() {
      this.showCongrats = true
    },
    closeCongrats() {
      this.showCongrats = false
      // this.modalKey++
      // this.changeLocation()
    }
  }
}
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

header {
  text-align: center;
}

.logo {
  height: 100px;
  width: 260px;
}

.actions {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.modal {
  width: 450px;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 20px;
  text-align: center;
  border: 10px solid #0c67ae;
  color: #0c67ae;
  background-color: lightblue;
}
</style>
