<template>
  <div class="chat-container pixelify">
    <div class="messages" ref="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <md :markdown="message"></md>
      </div>
    </div>
    <input id="input" v-model="input" @keyup.enter="sendMessage" placeholder="Type your message..."/>
  </div>
</template>

<script>
  import { textAI } from "~/public/assets/js/aiStream.js";
  export default {
    data() {
      return {
        input: '',
        messages: [],
        chat: [
          {
            user: "system",
            content: "You are an VLC AI used for most renderlabs applications. Messages are in order so do not repeat yourself.",
          },
        ],
        ai: textAI("vlc")
      };
    },
    mounted() {
      
    },
    methods: {
      sendMessage() {
        if (this.input.trim() === '') return;
        this.chat.push({
          user: "user",
          content: this.input,
        })
        this.messages.push(this.input);
        this.toggleInputBox();
        const response = this.ai.send(this.chat);
        const audiocontext = new AudioContext();
        this.messages.push("");
        
        const reader = setInterval(() => {
          const res = response().next().value
          if (res[1] === 88) {
            clearInterval(reader);
            //window.Analyst.Event("vlc-ai-stream-ended");
            const reread = response().next().value;
            //console.warn(reread)
            const content = reread.map(item => item.response).join("");
            //console.log(content)
            
            //this.messages[this.messages.length - 1] = content;
            this.chat.push({
              user: "ai",
              content: this.messages[this.messages.length - 1],
            });
            return
          }
          if (res[1] === 90) {
            window.Analyst.Warn("vlc-ai-token-error");
            return
          }
          if (res[1] === 91) {
            window.Analyst.Error("vlc-ai-http-error");
            return
          }
          if (res[1] === 92) {
            window.Analyst.Error("vlc-ai-http-error");
            return
          }
          const content = res.map(item => item.response).join("");
          
          if (content!==this.messages[this.messages.length - 1]) {
            const oscillator = audiocontext.createOscillator();
            oscillator.type = "sine";
            oscillator.frequency.value = 880;
            oscillator.connect(audiocontext.destination);
            oscillator.start();
            oscillator.stop(audiocontext.currentTime + 0.5);
          }
          
          this.messages[this.messages.length - 1] = content;
        }, 100)
     
      this.input = '';
      this.toggleInputBox();
      },
      toggleInputBox() {
        const inputBox = document.getElementById("input");
        inputBox.disabled = !inputBox.disabled;
      }
    },
  };
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ddd;
}

.message {
  padding: 5px;
  margin-bottom: 5px;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-top: none;
}
</style>