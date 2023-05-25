<template>
  <header>
    <img
      alt="Moscow puzzles logo"
      class="logo"
      src="./assets/logo.png"
    />
  </header>

  <main>
    <button @click="showTip = !showTip">{{ btnLabel }}</button>
    <GameField :showTip="showTip" />
  </main>
</template>

<script>
import GameField from '@/components/GameField.vue'
export default {
  components: { GameField },
  data() {
    return {
      showTip: false
    }
  },

  computed: {
    btnLabel() {
      return this.showTip ? 'Убрать подсказку' : 'Показать подсказку'
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

button {
  background-color: #0c67ae;
  color: white;
  font-weight: 700;
  padding: 10px;
  border-color: #0c67ae;
  border-radius: 5px;
  border-style: none;
  margin-bottom: 20px;
}

button:hover {
  cursor: pointer;
}
</style>
