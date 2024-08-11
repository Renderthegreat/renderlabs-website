<template>
  <div id="content" class="pixelify">
    <h1>{{ lang?.content?.long_content?.how_does_captcha_work[0] }}</h1>
    <p>{{ lang?.content?.long_content?.how_does_captcha_work[1] }}</p>
    <h2>{{ lang?.content?.long_content?.how_does_captcha_work[2] }}</h2>
    <p>{{ lang?.content?.long_content?.how_does_captcha_work[3] }}</p>
    <h2>{{ lang?.content?.long_content?.how_does_captcha_work[4] }}</h2>
    <p>{{ lang?.content?.long_content?.how_does_captcha_work[5] }}</p>
    <NuxtLink to="/test-out/captcha">{{ lang?.content?.long_content?.how_does_captcha_work[6] }}</NuxtLink>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        lang: {},
      }
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
  #content {
    padding: 20px;
  }
</style>