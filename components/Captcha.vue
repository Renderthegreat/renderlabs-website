<template>
  <div id="captcha">
    <p>{{ lang?.content?.captcha?.status[status] }}</p>
    <div id="captcha-container">
      <div id="captcha-container-image">
        <img id="captcha-image"/>
      </div>
      <div id="captcha-input-container">
        <input
          id="captcha-input"
          type="text"
          :placeholder="lang?.content?.captcha?.placeholder"
          v-model="captchaInput"
        />
      </div>
      <button id="start-button" @click="makeCaptcha();" type="button">{{ lang?.content?.captcha?.button?.start }}</button>
      <button id="check-button" disabled @click="checkCaptcha();" type="button">{{ lang?.content?.captcha?.button?.check }}</button>
      <pre><code>{{ error }}</code></pre>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        lang: {},
        error: "",
        id: "",
        captchaInput: "",
        status: "not-complete"
      }
    },
    methods: {
      load:
        function () {
          this.lang = window.lang;
        },
      makeCaptcha:
        async function () {
          this.error = "";
          const { id, data } = await this.generateCaptcha();
          const image = data.image;
          
          if (this.error) {
            const button = document.getElementById('start-button');
            button.text = error;
            return 1;
          }
          const img = document.getElementById('captcha-image');
          img.src = `data:image/png;base64,${image}`;
          this.id = id;
          const startButton = document.getElementById('start-button');
          startButton.style.display = "none";
          const checkButton = document.getElementById('check-button');
          checkButton.disabled = false;
        },
      checkCaptcha:
        async function () {
          this.error = "";
          const SHA256 = await this.getSHA256(this.captchaInput);
          let res = await fetch("https://progapi.renderlabs.cloud/api/test-keypair", {
            method: "POST",
            body: JSON.stringify({
              captchaID: this.id,
              captchaSolution: SHA256,
            })
          }).catch(err => {
            window.Analyst.Event("captcha-error", err)
            this.error = lang?.error_codes["-1"];
            return 1;
          })
          if (this.error != "") return 1;
          const data = await res.json();
          
          if (data.error) {
            window.Analyst.Event("captcha-fail", data);
            this.error = this.lang?.error_codes[data.error];
            return 1;
          }
          window.Analyst.Event("captcha-success", data);
          this.status = "complete";
          const checkButton = document.getElementById('check-button');
          checkButton.disabled = true;
          window.shared.completedCaptcha = true;
          window.shared.captchaID = this.id;
          window.shared.captchaSolution = SHA256;
        },
      getSHA256:
        async function(text) {
          const encoder = new TextEncoder();
          const data = encoder.encode(text);
          const hashBuffer = await crypto.subtle.digest("SHA-256", data)
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("");
          return hashHex;
        },
      generateCaptcha:
        async function () {
          const res = await fetch("https://progapi.renderlabs.cloud/api/generate-keypair").catch(err => {
            window.Analyst.Error("captcha-error", err);
          })
          const dataf = await res.json();
          if (dataf.error) {
            this.error = this.lang?.error_codes[1800];
            return 1;
          }
          const { id, data } = dataf;
  
          return { id, data };
        }
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
  #captcha {
    scale: 0.8;
  }

  #captcha-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }

  #captcha-image {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    border-radius: 10px;
  }
</style>