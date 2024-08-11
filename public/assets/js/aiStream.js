const systemToken = String.fromCodePoint(0xE001);
const userToken = String.fromCodePoint(0xE002);
const aiToken = String.fromCodePoint(0xE003);

function streamAIResponse(ai, prompt, handle) {
  const jsonPattern = /data: ({.*?})/g;
  const encodedPrompt = encodeURIComponent(prompt); // Encode prompt to handle special characters

  fetch(`https://progapi.renderlabs.cloud/api/ai?body={"stream":true,"prompt":"${encodedPrompt}","AI":"${ai}"}`, {
    method: 'GET',
  })
    .then(response => {
      if (response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedData = '';

        const processStream = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              handle(2);
              break;
            }
            accumulatedData += decoder.decode(value, { stream: true });

            let match;
            while ((match = jsonPattern.exec(accumulatedData)) !== null) {
              try {
                const jsonString = match[1];
                const jsonData = JSON.parse(jsonString);
                handle(1, jsonData);

                accumulatedData = accumulatedData.slice(match.index + match[0].length);
              } catch (error) {
                handle(3); // Handle JSON parsing error
              }
            }
          }
        };

        processStream();
      } else {
        handle(4); // Handle HTTP response error
      }
    })
    .catch(error => {
      handle(5); // Handle fetch error
    });
}

function textBuffer(message, ai, user) {
  let token = user === "system" ? systemToken : user === "user" ? userToken : aiToken;
  message = token + message;

  return {
    stream: function(handle) {
      streamAIResponse(ai, message, handle);
    },
    combine: function(message2, user2) {
      return textBuffer(message + message2, ai, user2);
    },
    message: message,
    user: user
  };
}

export function textAI(ai) {
  return {
    send: function(messages) {
      const slinky = [];
      let newestSlink = null;
      let i = 0;
      for (let message of messages) {
        let { user, content } = message;
        slinky.push(textBuffer(content, ai, user));
        i++;
      }
      for (let slink of slinky) {
        if (!newestSlink) {
          newestSlink = slink;
        } else {
          newestSlink = newestSlink.combine(slink.message, slink.user);
        }
      }
      for (let j = 0; j < i - 1; j++) {
        newestSlink.message = newestSlink.message.replace(newestSlink.message[0], "")
      }
      let response = [];
      function handle (type, data) {
        if (type === 1) {
          response.push(data);
        }
        if (type === 2) {
          response = 0
        }
        if (type === 3) {
          response.push('[! Token Error]')
        }
        if (type === 4) {
          response = 2
        }
        if (type === 5) {
          response = 3
        }
      }
      newestSlink.stream(handle);
      return function *() {
        while (true) {
          if (response === 0) {
            return 88;
          }
          if (response === 1) {
            return 90;
          }
          if (response === 2) {
            return 91;
          }
          if (response === 3) {
            return 92;
          }
          yield response;
        }
      }
    }
  };
};