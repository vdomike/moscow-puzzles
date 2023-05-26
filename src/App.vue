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
      <button @click="showTip = !showTip">{{ btnLabel }}</button>
      <button
        :disabled="hardMode"
        @click="makeItHarder"
      >Усложнить</button>
      <button @click="refresh">Разбросать заново</button>
    </div>

    <GameField
      :key="fieldKey"
      :showTip="showTip"
      :hardMode="hardMode"
    />
  </main>
</template>

<script>
import GameField from '@/components/GameField.vue'
export default {
  components: { GameField },
  data() {
    return {
      showTip: false,
      hardMode: false,
      fieldKey: 0
    }
  },

  created() {
    document.oncontextmenu = this.disableСontextMenu
  },

  computed: {
    btnLabel() {
      return this.showTip ? 'Убрать подсказку' : 'Показать подсказку'
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
    makeItHarder() {
      this.hardMode = true
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
</style>
