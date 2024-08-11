<template>
  <div class="pixelify">
    <div class="chat-container">
      <div class="messages" ref="messages">
        <div v-for="(message, index) in messages" :key="index" class="message">
          {{ message }}
        </div>
      </div>
      <input id="input" v-model="input" @keyup.enter="sendMessage" placeholder="Type your message..."/>
    </div>
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
            content: "You are an VLC AI used for most renderlabs applications",
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
        toggleInputBox()
        this.chat.push({
          user: "user",
          content: this.input,
        })
        this.messages.push(this.input);
        this.lockInput();
        const response = this.ai.send(this.chat);
        let end = ''
        this.messages.push("")
        const reader = setInterval(() => {
          const res = response().next().value
          if (res === 88) {
            clearInterval(reader);
            this.chat.push({
              user: "ai",
              content: end,
            })
            // debug
            //this.chat = []
            //console.log(this.chat)
            return
          }
          if (res === 90) {
            this.messages[this.message.length - 1] = '[!]'
            return
          }
          if (res === 91) {
            clearInterval(reader);
            this.messages[this.message.length - 1] = '[?]'
            return
          }
          if (res === 92) {
            clearInterval(reader);
            this.messages[this.message.length - 1] = '[.]'
            return
          }
          const content = res.map(item => item.response).join("");
          end = content;
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();

          const oscillator = audioContext.createOscillator();

          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          oscillator.connect(audioContext.destination);
          oscillator.start();

          oscillator.stop(audioContext.currentTime + 0.1);
          this.messages[this.messages.length - 1] = content;
        }, 100)
        this.input = '';
        toggleInputBox();
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