const logDiv = document.getElementById('log');

function speak(text) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ja-JP';
  synth.speak(utter);
}

function startRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'ja-JP';
  recognition.start();

  recognition.onresult = async function(event) {
    const transcript = event.results[0][0].transcript;
    logDiv.innerHTML = "<b>あなた:</b> " + transcript;

    const zundamonReply = await fetchZundamonStyle(transcript);
    logDiv.innerHTML += "<br><b>ずんだもん:</b> " + zundamonReply;

    speak(zundamonReply);
  };
}

async function fetchZundamonStyle(userText) {
  const systemPrompt = "あなたはずんだもんです。語尾に「〜なのだ」「〜のだよ」などをつけて、かわいく優しい返事をしてください。ずんだ餅が大好きです。";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
