const systemToken = String.fromCodePoint(0xE001);
const userToken = String.fromCodePoint(0xE002);
const aiToken = String.fromCodePoint(0xE003)

function streamAIResponse(ai, prompt, handle) {
  const jsonPattern = /data: ({.*?})/g;
  let encodedPrompt = prompt; // Encode prompt to handle special characters
  encodedPrompt = JSON.stringify(encodedPrompt);
  encodedPrompt = encodedPrompt.replace(/(?<!\\)"/g, '');
  encodedPrompt = encodeURIComponent(encodedPrompt);
  let url = `https://progapi.renderlabs.cloud/api/ai?body={"stream":true,"prompt":"${encodedPrompt}","AI":"${ai}"}`

  fetch(url, {
    method: 'GET',
  })
    .then(response => {
      if (response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedData = '';
        let xt = '';

        const processStream = async () => {
          while (true) {
            const { done, value } = await reader.read();
            let match;
            if (done) {
              let jf = [];
              let i = 0;
              //console.log(xt)
              while (xt.split('data:')[i]) {
                try {
                  //const jsonString = xt.split('\n')[i];
                  //const jsonData = JSON.parse(jsonString);
                  jf.push(JSON.parse(xt.split('data:')[i]));
                } catch (error) {
                  
                }
                i++;
              }
              handle(2, jf);
              break;
            }
            accumulatedData += decoder.decode(value, { stream: true });
            
            while ((match = jsonPattern.exec(accumulatedData)) !== null) {
              try {
                const jsonString = match[1];
                const jsonData = JSON.parse(jsonString);
                handle(1, jsonData);

                accumulatedData = accumulatedData.slice(match.index + match[0].length);
                xt += accumulatedData;
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

function textBuffer(message, ai, user, extra) {
  let token = user === "system" ? systemToken : user === "user" ? userToken : aiToken;
  if (!extra)
    message = token + message;
  else 
    message = message

  return {
    stream: function(handle) {
      streamAIResponse(ai, message, handle);
    },
    combine: function(message2, user2) {
      return textBuffer(message + message2, ai, user2, true);
    },
    message: message,
    user: user
  };
}

export function textAI(ai) {
  let fixed = null;
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
      let responseStatus = 0;
      let end = false;
      function handle (type, data) {
        if (type === 1) {
          response.push(data);
        }
        if (type === 2) {
          responseStatus = 1;
          fixed = data;
        }
        if (type === 3) {
          responseStatus = 2;
          response.push('[! Token Error]')
        }
        if (type === 4) {
          responseStatus = 3;
          response.push('[! HTTP Error]')
        }
        if (type === 5) {
          responseStatus = 4;
        }
      }
      newestSlink.stream(handle);
      return function *() {
        while (true) {
          if (responseStatus === 1 && !end) {
            end = true;
            yield [response, 88];
          }
          if (end) {
            yield fixed;
          }
          if (responseStatus === 3) {
            return [response, 92];
          }
          yield response;
        }
      }
    }
  };
};