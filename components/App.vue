<template>
  <div id="main" class="remove-duplicates">
    <div id="header">
      <div id="header-left">
        <div id="header-left-logo">
          <img id="header-left-logo-img" src="/assets/images/logo.png" alt="Renderlabs" />
        </div>
        <div id="header-left-title">
          <NuxtLink id="header-left-title-renderlabs-link" class="pixelify" to="/">{{ lang?.header?.title }}</NuxtLink>
        </div>
      </div>
      <div id="header-right">
        <div id="header-right-menu">
          <button id="header-right-menu-button" class="unclick menu-button pixelify">{{ lang?.header?.menu?.button }}</button>
          <div id="header-right-menu-dropdown_container">
            <div id="header-right-menu-dropdown_container-dropdown_items" class="pixelify">
              <!-- Dropdown Items -->
              <NuxtLink to="/sign-up" v-if="!loggedIn">{{ lang?.header?.menu?.signup }}</NuxtLink>
              <NuxtLink to="/settings">{{ lang?.header?.menu?.settings }}</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="content">
      <!-- Page Router -->
      <NuxtPage></NuxtPage>
    </div>
    <div id="footer">
     
    </div>
    <div id="debug_menu">
      <h1>Debug Mode</h1>
      <div id="debug_menu-container">
        <button id="debug_menu-button_debug_borders" @click="elementBorders()">Element Borders</button>
      </div>
    </div>
  </div>
  <Renderlabs-Analyst/>
</template>

<script>
  import { createVNode, render } from 'vue';
  import AlertBox from './AlertBox.vue';
  const RenderlabsAnalyst = {
    Upload: 
      function (file) {
        return new Promise((resolve, reject) => {
          fetch('https://analyst.renderlabs.cloud/api/upload', {
            method: 'POST',
            body: JSON.stringify({
              file: file
            })
          })
          .then(response => response.json())
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            window.location.reload();
          });
        });
      },
    Parse:
      function (info, warning, error, death, data) {
        return new Promise((resolve, reject) => {
          let finfo, fwarning, ferror, fdeath, fdata;
          finfo = info.join('\0');
          fwarning = warning.join('\0');
          ferror = error.join('\0');
          fdeath = death.join('\0');
          fdata = data.join('\0');
          let reader = [...finfo, ...fwarning, ...ferror, ...fdeath, fdata]
          console.log(reader.join(''));
          return reader.join('');
        });
      }
  };
  
  export default {
    name: 'App',
    data() {
      return {
        localStorage: null,
        sessionStorage: null,
        indexedDB: null,
        menuDropdown: false,
        lang: { },
        loggedIn: false,
        alerts: [ ],
        requiredNames:[
          
        ],
        Analyst: {
          info:         [0],
          warning:      [0],
          error:        [0],
          death:        [0],
          data:         [0],
          ErrorF:
            class extends Error {
              constructor(message) {
                super(message);
                this.name = 'Analyst-Error';
              }
            },
          Event:
            function (event, dataf) {
              this.info.push(event);
              if (dataf) {
                this.info.push(this.data.length);
                this.data.push(JSON.stringify(dataf));
              }
              console.clear();
              if (window.getMyDataPlease)
              window.getMyDataPlease();
              return 0;
            },
          Warning:
            function (warning, dataf) {
              this.warning.push(warning);
              if (dataf)
              this.warning.push(this.data.length);
              this.data.push(JSON.stringify(dataf));
              console.clear();
              if (window.getMyDataPlease)
              window.getMyDataPlease();
              return 0;
            },
          Error:
            function (error, dataf) {
              this.error.push(error);
              if (dataf)
              this.error.push(this.data.length);
              this.data.push(JSON.stringify(dataf));
              console.clear();
              if (window.getMyDataPlease)
              window.getMyDataPlease();
              return 0;
            },
          Death:
            function (event, dataf) {
              this.death.push(event);
              if (dataf)
              this.info.push(this.data.length);
              this.data.push(JSON.stringify(dataf));
              console.clear();
              if (window.getMyDataPlease)
              window.getMyDataPlease();
              window.alertBox(lang?.things?.alertBox.error, lang?.things?.death, [{
                label: lang?.things?.alertBox?.no,
                handler: () => {
                  window.location.reload();
                }
              }, {
                label: lang?.things?.alertBox?.yes,
                handler: async () => {
                  const data = RenderlabsAnalyst.Parse(this.info, this.warning, this.error, this.death, this.data);
                  await RenderlabsAnalyst.Upload(data);
                  window.location.reload();
                }
              }])
            }
        },
      }
    },
    methods: {
      toggleMenuDropdown: 
        function () {
          let menuDropdown = document.getElementById("header-right-menu-dropdown_container");
          menuDropdown.classList.toggle("header-right-menu-dropdown_container-dropdown_items-dropdown_items");
          menuDropdown.style.display = "block";
          this.menuDropdown = !this.menuDropdown;
          for (let i = 0; i < menuDropdown.children.length; i++) {
            menuDropdown.children[i].style.display = this.menuDropdown ? "block": "none";
            menuDropdown.children[i].style.animation = "magic-display-menus ";
          }
          return this.Analyst.Event("Menu-Dropdown-Toggle");
        },
      updateTheme: 
        function (theme) {
          if (!theme && this.localStorage) {
            theme = this.localStorage.getItem("theme") || "light";
          }

          if (theme === "light" || theme === "dark") {
            const themePrefix = theme === "light" ? "light" : "dark";
            const oppositePrefix = theme === "light" ? "dark" : "light";

            let style = getComputedStyle(document.documentElement);
            document.documentElement.style.setProperty('--current-color-main', style.getPropertyValue(`--${themePrefix}-color-main`));
            document.documentElement.style.setProperty('--current-color-secondary', style.getPropertyValue(`--${themePrefix}-color-secondary`));
            document.documentElement.style.setProperty('--current-color-tertiary', style.getPropertyValue(`--${themePrefix}-color-tertiary`));
            document.documentElement.style.setProperty('--opposite-color-main', style.getPropertyValue(`--${oppositePrefix}-color-main`));
            document.documentElement.style.setProperty('--opposite-color-secondary', style.getPropertyValue(`--${oppositePrefix}-color-secondary`));
            document.documentElement.style.setProperty('--opposite-color-tertiary', style.getPropertyValue(`--${oppositePrefix}-color-tertiary`));
            document.documentElement.style.setProperty('--splitter-color', style.getPropertyValue(`--${theme}-color-splitter`));
          } else {
            this.updateTheme("light");
            this.Analyst.Warning("Theme-not-found");
          } 
          if (this.localStorage) {
            this.localStorage.setItem("theme", theme);
          }
        },
      debugMode:
        function (force) {
          if (force || this.localStorage && this.localStorage.getItem("debugMode") == "true") {
            this.Analyst.Event("Debug-Mode");
            const debugMenu = document.getElementById("debug_menu");
            debugMenu.style.display = "flex";
          }
        },
      elementBorders:
        function () {
          const elements = document.querySelectorAll("*");
          for (let i = 0; i < elements.length; i++) {
            elements[i].style.border = "1px solid var(--debug-color)";
          }
        },
      removeDuplicates:
        function () {
          const elements = [...document.getElementsByClassName("remove-duplicates")];
          
          const seen = new Set();
          for (let i = 0; i < elements.length; i++) {
            if (!seen.has(elements[i].id)) {
              seen.add(elements[i].id);
            } else {
              elements[i].remove();
            }
          }
        },
      getLanguage:
        function () {
          const lang = navigator.language || navigator.userLanguage;
          let res = fetch("/assets/lang.json");
          return new Promise((resolve, reject) => {
            res.then(response => {
              if (response.ok) {
                response.json().then(data => {
                  resolve(data[lang.replace(/-/g, "_")]);
                }).catch(err => {
                  reject(55);
                })
              } else {
                console.error("Failed to load language file.");
                reject(response.status);
              }
            })
          })
        },
      getMyDataPlease:
        function () {
          console.log("%c---# Analyst Data #---", "font-weight: bold;");
          console.log("%cNo Information is Shared without your Consent", "font-weight: bold;");
          console.log("%cInfo:      %s", "background: #64D98A; color: white; padding: 2px 4px; border-radius: 5px;", this.Analyst.info.join('\n'));
          console.log("%cWarning:   %s", "background: #DEA739; color: white; padding: 2px 4px; border-radius: 5px;", this.Analyst.warning.join('\n'));
          console.log("%cError:     %s", "background: #DC4949; color: white; padding: 2px 4px; border-radius: 5px;", this.Analyst.error.join('\n'));
          console.log("%cDeath:     %s", "background:  orange; color: white; padding: 2px 4px; border-radius: 5px;", this.Analyst.death.join('\n'));
          console.log("%cLingering: %s", "background: #64D98A; color: white; padding: 2px 4px; border-radius: 5px;", this.Analyst.data.join('\n'));
        },
      alertBox:
        function (title, message, buttons) {
          const alertContainer = document.createElement("div");
          alertContainer.id = "alert-container";
          alertContainer.style.display = "flex";
          alertContainer.style.flexDirection = "column";
          alertContainer.style.alignItems = "center";
          alertContainer.style.zIndex = "9999";
          alertContainer.style.position = "fixed";
          document.body.appendChild(alertContainer);
          const alertVNode = createVNode(AlertBox, {
            visible: true,
            title: title,
            message: message,
            buttons: buttons
          });
          render(alertVNode, alertContainer);
        }
    },
    mounted() {
      this.Analyst.Event("App-Mounted");
      if (!window) {
        this.Analyst.Death("Window-Not-Defined");
        return 1;
      }
      for (let i = 0; i < this.requiredNames.length; i++) {
        if (!window[this.requiredNames[i]]) {
          this.Analyst.Death("Required-Name-Not-Defined");
          return 1;
        }
      }

      document.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
          this.Analyst.Event(`Click`, event.target.id);
        }
      });

      if (window.localStorage) {
        this.Analyst.Event("Local-Storage-Available");
        this.localStorage = window.localStorage;
        if (this.localStorage.getItem("userToken")) {
          this.loggedIn = true;
        }
      }

      if (window.sessionStorage) {
        this.Analyst.Event("Session-Storage-Available");
        this.sessionStorage = window.sessionStorage;
      }

      if (window.indexedDB) {
        this.Analyst.Event("Indexed-DB-Available");
        this.indexedDB = window.indexedDB;
      }

      this.updateTheme();
      this.debugMode(false); // Set to false on production
      this.removeDuplicates();

      window.updateTheme = this.updateTheme;
      window.Analyst = this.Analyst;
      window.debugMode = this.debugMode;
      window.getMyDataPlease = this.getMyDataPlease;
      window.shared = {};
      window.user = {};
      window.alertBox = this.alertBox;
      
      this.getLanguage().then(data => {
        this.lang = data;
        window.lang = data;
      });

      const headerRightMenuButton = document.getElementById('header-right-menu-button');

      headerRightMenuButton.addEventListener('click', () => {
        headerRightMenuButton.classList.toggle('click');
        headerRightMenuButton.classList.toggle('unclick');
        this.toggleMenuDropdown();
      })
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap');

  #main {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: var(--current-color-main);
    color: var(--opposite-color-main);
  }

  #content {
    display: flex;
    overflow: auto;
    z-index: var(--content-z);
    margin-top: 4rem;
    margin-bottom: 2rem;
    height: 100%;
    width: 100%;
  }

  #debug_menu {
    display: none;
    width: 100vw;
    margin-top: 5rem;
  }

  #footer {
    position: absolute;
    top: 100%;
    height: 20%;
    width: 100%;
    background-color: var(--current-color-secondary);
    color: var(--opposite-color-secondary);
    font-size: 0.8rem;
    font-weight: 400;
    font-style: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--splitter-color);
  }

  #header {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    flex-direction: row;
    height: 4rem;
    width: 100%;
    background-color: var(--dark-color-main);
    color: var(--light-color-secondary);
    border-bottom: 5px solid var(--splitter-color);
    margin-bottom: 2rem;
  }

  #header-left {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 50%;
    justify-content: flex-start;
    align-items: center;
    padding-left: 10px;
  }

  #header-left-logo {
    height: 100%;
    width: auto;
    align-items: center;
    align-content: center;
    align-self: center;
    margin-right: 10px;
  }

  #header-left-logo-img {
    height: 60%;
    width: auto;
    align-self: center;
  }

  #header-left-title {
    height: 100%;
    width: auto;
    align-items: center;
    align-content: center;
    align-self: center;
  }

  #header-left-title-renderlabs-link {
    height: 60%;
    width: auto;
    font-size: 1.8rem;
    font-weight: normal;
    text-decoration: none;
    color: var(--light-color-main);
    align-self: center;
  }


  #header-right {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 50%;
    justify-content: flex-end;
    align-items: center;
    padding-right: 10px;
  }

  #header-right-menu {
    z-index: var(--top-z);
    display: block;
    height: 100%;
    width: auto;
    align-self: center;
  }

  #header-right-menu-button {
    height: 50%;
    margin-top: 15px;
    margin-right: 25px;
    aspect-ratio: 1 / 1;
    cursor: pointer;
  }

  #header-right-menu-dropdown_container {
    display: none;
    width: auto;
    align-self: center;
    position: relative;
  }

  #header-right-menu-dropdown_container-dropdown_items {
    display: none;
    height: 200%;
    width: 300%;
    align-items: top;
    align-self: center;
    position: absolute;
    right: 0px;
    box-shadow: 0px 0px 10px var(--splitter-color);
  }

  #header-right-menu-dropdown_container-dropdown_items * {
    display: block;
    text-decoration: none;
    color: var(--opposite-color-main);
    background-color: var(--current-color-main);
    border-bottom: 1px solid var(--splitter-color);
  }

  @keyframes magic-display-menus {
    from {
      width: 0%;
      margin-left: 50%;
      text-opactity: 0;
    }
    to {
      width: 100%;
      margin-left: 0%;
    }
  }
</style>