<template>
  <input type="text" v-model="wout" />
  <canvas id="WUT">
  </canvas>
</template>

<script>
  import { wut } from './public/assets/js/wut.js';
  export default {
    name: 'WUT',
    data() {
      return {
        wout: '',
      };
    },
    mounted() {
      const canvas = document.getElementById("WUT");
      const WUT = wut(canvas);
      
      app = () => {
        let store = [];
        return new WUT.Window(
          "app",
          [40, 40, 100, 100],
          false,
          (cmx, d, win) => {
            cmx.fillStyle = "royalBlue";
            cmx.fillRect(d.x, d.y, d.fx, d.fy);
            eval(this.wout);
          }
        )
      }
      WUT.Create(app);
      WUT.Init();
    }
  }
</script>

<style scoped>
  #WUT {
    top: 0;
    left: 0;
    z-index: var(--top-z);
    width: 100%;
    height: 100vh;
  }
</style>