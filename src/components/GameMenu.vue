<template>
  <div
    class="menu"
    :class="{ active: active }"
  >
    <div
      class="menu-toggle"
      @click="active = !active"
    >Меню</div>
    <ul>
      <li
        class="menu-item"
        @click="onMenuClick(() => $emit('changeLocation', 'moscow-city'))"
      >Локация «Москва-Сити»</li>
      <li
        class="menu-item"
        @click="onMenuClick(() => $emit('toggleMode'))"
      >{{ this.hardMode ? 'Упростить' : 'Усложнить' }}</li>
      <li
        class="menu-item"
        @click="onMenuClick(() => $emit('changeLocation', 'vdnkh'))"
      >Локация «ВДНХ»</li>
      <li
        class="menu-item"
        @click="onMenuClick(() => $emit('refresh'))"
      >Разбросать пазл</li>
      <li
        class="menu-item"
        @click="onMenuClick(() => $emit('toggleTip'))"
      >{{ this.showTip ? 'Убрать подсказку' : 'Показать подсказку' }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
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
      active: false
    }
  },
  methods: {
    onMenuClick(actionFn) {
      // this.active = !this.active
      actionFn()
    }
  }
}
</script>

<style scoped>
.menu {
  position: absolute;
  top: -185px;
  right: 300px;
  transform: translateY(0) translateX(-50%);
  transition: transform 0.2s ease 0.2s, top 0.5s ease-in 0.4s;
  z-index: 1;
  text-transform: uppercase;
  font-weight: 700;
}

.menu.active {
  top: 0;
  transform: translateY(-20px) translateX(-50%);
  transition: transform 0.2s ease, top 0.5s ease-in 0.2s;
}

.menu-toggle {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 60px;
  height: 200px;
  padding: 10px;
  color: white;
  background-color: #ff9201;
  cursor: pointer;
  z-index: 1;
  box-shadow: 0 0 15px 1px #222;
  border: solid 5px #c87100;
  border-radius: 5px;
}

.menu-item {
  display: block;
  background-color: #0c67ae;
  height: 30px;
  line-height: 30px;
  width: 0;
  border: solid 5px #074b80;
  border-radius: 5px;
  font-size: 12px;
  overflow: hidden;
  position: absolute;
  color: transparent;
  transition: 0.2s width ease-out, 0s color ease 0.2s;
  z-index: -1;
  cursor: pointer;
}

.menu-item:nth-child(odd) {
  padding: 0 10px 0 0;
  text-align: right;
  right: 0;
}

.menu-item:nth-child(even) {
  padding: 0 0 0 10px;
  text-align: left;
  left: 0
}

.menu-item:nth-child(1) {
  bottom: 62px;
  transform: translateX(90%);
}

.menu-item:nth-child(2) {
  bottom: 62px;
  transform: translateX(-90%);
}

.menu-item:nth-child(3) {
  bottom: 112px;
  transform: translateX(90%);
}

.menu-item:nth-child(4) {
  bottom: 112px;
  transform: translateX(-90%);
}

.menu-item:nth-child(5) {
  padding: 0 0 0 10px;
  text-align: left;
  left: 0;
  bottom: 162px;
  transform: translateX(-90%);
}

.menu-item:hover {
  background-color: #1170b9;
}

.menu.active .menu-item {
  color: white;
  box-shadow: 0 0 15px 1px #222;
  transition: 0.2s width ease-in 0.9s, 0s color ease 0.9s;
}

.menu.active .menu-item:nth-child(1),
.menu.active .menu-item:nth-child(3) {
  width: 200px;
}

.menu.active .menu-item:nth-child(2),
.menu.active .menu-item:nth-child(4),
.menu.active .menu-item:nth-child(5) {
  width: 170px;
}
</style>