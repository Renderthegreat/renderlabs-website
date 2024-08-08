<template>
  <div id="auth" class="pixelify">
    <div id="auth-container" class="pixelify">
      <div id="auth-container-signup" v-if="selection == 1">
        <h1>{{ lang?.content?.auth?.signup?.title }}</h1>
        <form id="auth-container-signup-form" @submit.prevent="signup">
          <input id="auth-container-signup-form-email" type="text" :placeholder="lang?.content?.auth?.signup?.email"><br/>
          <input id="auth-container-signup-form-username" type="text" :placeholder="lang?.content?.auth?.signup?.username"><br/>
          <input id="auth-container-signup-form-password" type="password" :placeholder="lang?.content?.auth?.signup?.password"><br/>
          <input id="auth-container-signup-form-password-confirm" type="password" :placeholder="lang?.content?.auth?.signup?.confirm"><br/>
          <Captcha></Captcha>
          <span>
            <p>{{ lang?.content?.auth?.signup?.terms.split('(::)')[0] }}&nbsp;</p>
            <a href="/terms-and-conditions">{{ lang?.content?.auth?.signup?.terms.split('(::)')[1] }}</a><p>:</p>
            <toggle id="auth-container-signup-form-terms" @update:data="termsToggle"/><br/>
          </span>
          <button id="auth-container-signup-form-submit" type="submit">{{ lang?.content?.auth?.signup?.submit }}</button><br/>
          <a href="javascript:window.shared.switchToOther();">I already have an account</a>
        </form>
      </div>
      <div id="auth-container-login" v-if="selection == 2">
        <h1>{{ lang?.content?.auth?.login?.title }}</h1>
        <form id="auth-container-login-form" @submit.prevent="login">
          <input id="auth-container-login-form-email" type="text" :placeholder="lang?.content?.auth?.login?.email"><br/>
          <input id="auth-container-login-form-password" type="password" :placeholder="lang?.content?.auth?.login?.password"><br/>
          <button id="auth-container-login-form-submit" type="submit">{{ lang?.content?.auth?.login?.submit }}</button><br/>
          <a href="javascript:window.shared.switchToOther();">I don't have an account</a>
        </form>
      </div>
      <pre><code id="auth-container-helper">{{ error }}</code></pre>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        lang: {},
        localStorage: {},
        agreed: false,
        selection: 1,
        error: "",
      };
    },
    methods: {
      load: 
        function() {
          this.lang = window.lang;
          this.localStorage = window.localStorage;
          this.auth = {};
          const submitButton = document.getElementById('auth-container-signup-form-submit');
          submitButton.setAttribute('disabled', 'true');
          const signupForm = document.getElementById('auth-container-signup-form');
          const loginForm = document.getElementById('auth-container-login-form');
          window.shared.completedCaptcha = false;
          window.shared.switchToOther = () => {
            this.selection = this.selection == 1 ? 2 : 1;
          }
        },
      login:
        async function() {
          window.Analyst.Event("login-attempt")
          this.error = "";
          const email = document.getElementById('auth-container-login-form-email').value;
          const password = document.getElementById('auth-container-login-form-password').value;
          const response = await fetch('https://progapi.renderlabs.cloud/api/login', {
            method: 'POST',
            body: JSON.stringify({
              email: email,
              password: password
            })
          });
          const data = await response.json();
          if (data.error) {
            this.error = lang?.error_codes[data.error];
            return 1;
          }
          window.user = data.user;
          this.localStorage.setItem('userToken', window.user.token);
          this.$router.push({ path: '/' });
        },
      termsToggle:
        function() {
          this.agreed = !this.agreed;
          const submitButton = document.getElementById('auth-container-signup-form-submit');
          if (this.agreed) {
            submitButton.removeAttribute('disabled');
          } else {
            submitButton.setAttribute('disabled', 'true');
          }
        },
      signup:
        async function() {
          window.Analyst.Event("signup-attempt")
          this.error = "";
          const email = document.getElementById('auth-container-signup-form-email').value;
          const username = document.getElementById('auth-container-signup-form-username').value;
          const password = document.getElementById('auth-container-signup-form-password').value;
          const passwordConfirm = document.getElementById('auth-container-signup-form-password-confirm').value;
          if (password != passwordConfirm) {
            this.error = this.lang?.content?.auth?.errors?.signup?.password?.not_match;
            return 1;
          }
          if (email.length < 5) {
            this.error = this.lang?.content?.auth?.errors?.signup?.email?.too_short;
            return 1;
          }
          if (password.length < 8) {
            this.error = this.lang?.content?.auth?.errors?.signup?.password?.too_short;
            return 1;
          }
          if (!window.shared.completedCaptcha) {
            this.error = this.lang?.content?.auth?.errors?.signup?.captcha?.not_completed;
            return 1;
          }
          const res = await fetch("https://progapi.renderlabs.cloud/api/create", {
            method: "POST",
            body: JSON.stringify({
              email: email,
              username: username,
              password: password,
              captchaID: window.shared.captchaID,
              captchaSolution: window.shared.captchaSolution,
            })
          })
          const data = await res.json();
          
          if (data.error) {
            this.error = this.lang?.error_codes[data.error];
            return 1;
          }
          window.user = data.user;
          this.localStorage.setItem('userToken', window.user.token);
          this.$router.push({ path: '/' });
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
  #auth {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: var(--current-color-main);
    color: var(--opposite-color-main);
  }

  #auth-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    border-radius: 10px;
    background-color: var(--current-color-secondary);
    align-self: center;
    align-items: center;
  }

  #auth-container-signup {
    align-items: center;
  }

  #auth-container-login {
    align-items: center;
  }

  form {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    gap: 3px;
    align-items: center;
    scale: 0.8;
  }

  button {
    padding-left: 60px;
    padding-right: 60px;
  }

  span {
    display: flex;
    white-space: nowrap;
    align-items: center;
    scale: 0.7;
  }

  #auth-container-signup-form-terms {
    scale: 0.5;
  }
</style>