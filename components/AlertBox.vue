<template>
  <div v-if="isVisible" class="alert-box pixelify">
    <div class="alert-content">
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>
      <div class="alert-buttons">
        <button v-for="(button, index) in buttons" :key="index" @click="handleClick(button.handler)">
          {{ button.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AlertBox',
    data() {
      return {
        isVisible: false,
      }
    },
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      buttons: {
        type: Array,
        required: true
      }
    },
    methods: {
      handleClick(handler) {
        if (typeof handler === 'function') {
          handler();
          this.destroy();
        }
      },
      destroy() {
        this.isVisible = false;
      }
    },
    mounted() {
      this.isVisible = this.visible;
    }
  }
</script>

<style scoped>
  .alert-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
  }
  .alert-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
  }
  .alert-buttons {
    margin-top: 10px;
  }
  .alert-buttons button {
    margin-right: 10px;
  }
</style>