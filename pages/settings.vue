<template>
  <div id="settings" class="pixelify">
    <div id="settings-sidebar">
      <ul id="settings-sidebar-list">
        <button class="settings-sidebar-list-item" @click="update(1)">Appearance</button>
        <button class="settings-sidebar-list-item" @click="update(2)">Account</button>
        <button class="settings-sidebar-list-item" @click="update(3)">Help</button>
      </ul>
    </div>
    <div id="settings-content">
      <div id="settings-content-appearance" v-if="selection==1">
        <h1>{{ lang?.content?.settings?.appearance?.title}}</h1>
        <h2>{{ lang?.content?.settings?.appearance?.theme }}</h2>
        {{ lang?.content?.settings?.appearance?.option?.theme }}: <button id="settings-content-appearance-toggle" @click="update('theme')">{{ translatedColor }}</button>
      </div>
      <div id="settings-content-account" v-if="selection==2">
        <h1>{{ lang?.content?.settings?.account?.title }}</h1>
        <h2>...</h2>
      </div>
      <div id="settings-content-help" v-if="selection==3">
        <h1>{{ lang?.content?.settings?.help?.title }}</h1>
        <h2>...</h2>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Settings",
    data() {
      return {
        selection: 1,
        localStorage: {},
        lang: {},
        currentColor: "Not Initiated",
        oppositeColor: "Not Initiated",
        translatedColor: "Not Initiated"
      };
    },
    methods: {
      load: 
        function() {
          if (window.localStorage) {
            this.localStorage = window.localStorage;
            this.currentColor = window.localStorage.getItem("theme");
            if (this.currentColor == "light") {
              this.translatedColor = window.lang?.things?.theme?.light;
            }
            else {
              this.translatedColor = window.lang?.things?.theme?.dark;
            }
          }
          this.lang = window.lang;
        },
      changeColor:
        function() {
          if (this.currentColor === "light") {
            this.currentColor = "dark";
            this.oppositeColor = "light";
            this.translatedColor = this.lang?.things?.theme?.dark;
          } else {
            this.currentColor = "light";
            this.oppositeColor = "dark";
            this.translatedColor = this.lang?.things?.theme?.light;
          }
          window.updateTheme(this.currentColor);
        },
      update:
        function(selection) {
          if (typeof selection == 'number') {
            this.selection = selection;
          } else {
            if (selection == 'theme') {
              this.changeColor();
            }
          }
        }
    },
    mounted() {
      const checker = setInterval(() => {
        if (window.Analyst) {
          this.load();
          clearInterval(checker);
        }
      }, 100);
    }
  };
</script>

<style scoped>
  #settings {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    background-color: var(--current-color-main);
    color: var(--opposite-color-main);
  }

  #settings-content {
    position: absolute;
    display: flex;
    left: 45%;
    height: 100%;
    flex-direction: column;
    overflow-y: hidden;
    background-color: var(--current-color-main);
    color: var(--opposite-color-main);
  }

  #settings-content-appearance-toggle {
    scale: 0.7;
  }

  #settings-sidebar {
    position: absolute;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 40%;
    font-size: 2vw;
    overflow: hidden;
    left: 0px;
    background-color: var(--opposite-color-main);
    color: var(--current-color-secondary);
  }

  #settings-sidebar-list {
    display: flex;
    flex-direction: column;
    left: 0px;
    height: 100%;
    width: 100%;
    gap: 20px;
    overflow: hidden;
  }

  .settings-sidebar-list-item {
    display: flex;
    flex-direction: row;
    height: 4rem;
    width: 100%;
    left: 0px;
    justify-content: flex-start;
    align-items: center;
    padding-left: 10px;
    cursor: pointer;
  }
  
  .settings-sidebar-list-item:hover {
    background-color: var(--opposite-color-secondary);
  }
</style>