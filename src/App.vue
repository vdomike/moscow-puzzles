<template>
  <header>
    <img
      alt="Moscow puzzles logo"
      class="logo"
      src="./assets/logo.png"
    />
  </header>

  <main>
    <div class="actions">
      <button @click="showTip = !showTip">{{ tipBtnLabel }}</button>
      <button @click="toggleMode">{{ modeBtnLabel }}</button>
      <button @click="refresh">Разбросать пазл</button>
    </div>

    <GameField
      :key="fieldKey"
      :showTip="showTip"
      :hardMode="hardMode"
      @win="showCongrats = true"
    />
  </main>
  <div id="modal"></div>

  <Modal
    v-model="showCongrats"
    :close="() => { showCongrats = false }"
  >
    <div class="modal">
      <CongratsPuzzle1 />
    </div>
  </Modal>
</template>

<script>
import GameField from '@/components/GameField.vue'
import CongratsPuzzle1 from '@/components/congrats/CongratsPuzzle1.vue'
export default {
  components: { GameField, CongratsPuzzle1 },
  data() {
    return {
      showTip: false,
      hardMode: false,
      fieldKey: 0,
      showCongrats: false
    }
  },

  created() {
    document.oncontextmenu = this.disableСontextMenu
  },

  computed: {
    tipBtnLabel() {
      return this.showTip ? 'Убрать подсказку' : 'Показать подсказку'
    },
    modeBtnLabel() {
      return this.hardMode ? 'Упростить' : 'Усложнить'
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

button {
  width: 210px;
  background-color: #0c67ae;
  color: white;
  font-weight: 700;
  padding: 10px;
  border-color: #0c67ae;
  border-radius: 5px;
  border-style: none;
  transition: ease 0.3s opacity;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
}

button:hover {
  cursor: pointer;
  opacity: 0.9;
}

button:disabled:hover {
  cursor: default;
}

button:disabled {
  opacity: 0.8;
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
