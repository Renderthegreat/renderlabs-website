<template>
  <div id="index-container" class="pixelify">
    <h1>{{ lang?.content?.index?.welcome }}</h1>
    <!-- Hover Cards -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        lang: {},
      };
    },
    methods: {
      load: 
        function() {
          this.lang = window.lang;
        },
    },
    mounted() {
      const checker = setInterval(() => {
        if (window.Analyst) {
          this.load();
          clearInterval(checker);
        }
      }, 100);
    },
  }
</script>

<style scoped>
  #index-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-left: 10px;
    padding-top: 10px;
    justify-content: center;
    align-items: center;
    align-content: center;
    gap: 2rem;
    height: 100%;
    width: 100%;
  }
</style>