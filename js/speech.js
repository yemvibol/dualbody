SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
const recognition = new SpeechRecognition();
if (!'SpeechRecognition' in window) {
	alert('Web Speech API is not supported on this browser.');
}

recognition.interimResults = true;
recognition.continuous = false;


const textList = document.getElementById('result_text');
const textBox = document.getElementById("listTalk");
const text = document.getElementById('getresult');
const lang = document.getElementById('lang');
const voiceRec = document.getElementById('voiceRec');
const tsend = document.getElementById('textSend');

window.onload = function() {
	recognition.lang = lang.value;
	recognition.start();
    
    
};

recognition.onresult = function(e){
    text.innerText = '';
    for (let i = e.resultIndex; i < e.results.length; i++){
        let result = e.results[i][0].transcript;
        if(e.results[i].isFinal){
            textList.innerHTML += '<div>'+tsend.innerHTML+'</div>';
	    tsend.innerHTML = result;
	    sendSpData();
        } else {
            text.innerText += result;
	    textBox.scrollTop = textBox.scrollHeight;
        }
    }
};

recognition.onend = function(){ 
	recognition.lang = lang.value;
    recognition.start();     
};

voiceRec.addEventListener('click' , function() {
	text.innerText = 'Voice Recognition'
	recognition.lang = lang.value;
    recognition.start(); 
});

lang.addEventListener('change', (event) => {
	recognition.stop();
	text.innerText = event.target.value;
	recognition.lang = lang.value;
    recognition.start();
});

