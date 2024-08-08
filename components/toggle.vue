<template>
  <div @click="toggle" :class="['toggle-container', { 'active': isActive }]">
    <div class="toggle-switch"></div>
  </div>
</template>

<script>
export default {
  name: 'ToggleSwitch',
  data() {
    return {
      isActive: false
    };
  },
  methods: {
    toggle() {
      this.isActive = !this.isActive;
      this.$emit('update:data', this.isActive);
    }
  }
};
</script>

<style scoped>
.toggle-container {
  width: 60px;
  height: 30px;
  background-color: #a29bfe;
  border-radius: 15px;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.toggle-container.active {
  background-color: #6c5ce7;
}

.toggle-switch {
  width: 26px;
  height: 26px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  transition: transform 0.3s;
  transform: translateX(-13px);
}

.toggle-container.active .toggle-switch {
  transform: translateX(13px);
}
</style>
