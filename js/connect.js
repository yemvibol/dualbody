const options = Ayame.defaultOptions;
options.clientId = clientId ? clientId : options.clientId;
if (signalingKey) {
    options.signalingKey = signalingKey;
}



let conn;
const disconnect = () => {
	if (conn) {
		conn.disconnect();
	}
}
let dataChannel = null;
const label = 'dataChannel';
const startConn = async () => {
	
	//canvas.width = video.videoWidth;
	//canvas.height = video.videoHeight
	
	options.video.codec = videoCodec;
	
	conn = Ayame.connection(signalingUrl, roomId, options, true);
    conn.on('open', async (e) => {
        dataChannel = await conn.createDataChannel(label);
        if (dataChannel) {
            dataChannel.onmessage = onMessage;
        }
    });
    conn.on('datachannel', (channel) => {
		if (!dataChannel) {
            dataChannel = channel;
            dataChannel.onmessage = onMessage;
        }
    });
    conn.on('disconnect', (e) => {
        console.log(e);
        dataChannel = null;
    });
	const mediaStream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
    await conn.connect(mediaStream, null);
	
	conn.on('open', ({authzMetadata}) => console.log(authzMetadata));
    conn.on('addstream', (e) => {
        document.querySelector('#remote-video').srcObject = e.stream;
    });

	
};
<!-- const sendData = () => { -->
function sendSpData() {
    const data = document.getElementById('textSend').innerHTML +'\n';	 	
	console.log(data);
    if (dataChannel && dataChannel.readyState === 'open') {
        dataChannel.send(data);
    }
}
document.querySelector("#roomIdInput").value = roomId;
document.querySelector("#clientIdInput").value = options.clientId;

function onMessage(e) {
	var enc = new TextDecoder("utf-8");
    const messages = document.querySelector("#messages").value;
	<!-- console.log(enc.decode(e.data)) -->
	let mess = enc.decode(e.data)
	obj = mess.split(';')
	//console.log(obj.length)
	var ch = obj[0].split(',');
	//console.log(ch[0]);
	numObj = obj.length - 1;
	if (ch[0] == "no"){
		numObj = - 1;
	}
	//for(var i=0; i<obj.length-1; i++) {
	//	console.log(obj[i]);
	//}
    document.querySelector("#messages").value = enc.decode(e.data);
	//canvas.width = video.videoWidth;
	//canvas.height = video.videoHeight;
	//console.log(canvas.width);
	//console.log(canvas.height);
};

const video = document.querySelector('#remote-video');
const canvas = window.canvas = document.querySelector('canvas');
let numObj = 0
let obj =""
//var canvas = document.getElementById("mycanvas");
canvas.width = 1280;//1280x720
canvas.height = 720;
canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
// コンテキストを取得する
canvasCtx = canvas.getContext('2d');

// video要素の映像をcanvasに描画する
_canvasUpdate();

function _canvasUpdate() {
  canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
  if(numObj > 0){  
	for (var i = 0; i < numObj; i++){
		var pos = obj[i].split(',');
		var x1 = Number(pos[1]) * 1280 / 3840;
		var x2 = Number(pos[2]) * 1280/ 3840;
		var y1 = Number(pos[3]) * 720 / 1920;
		var y2 = Number(pos[4]) * 720 / 1920;
		canvasCtx.lineWidth = 3;
		canvasCtx.strokeStyle = 'rgb(0,' + Math.floor(255-2*i) + ',' + 
                         Math.floor(255-5*i) + ')';
		canvasCtx.fillStyle = 'rgb(0,' + Math.floor(255-2*i) + ',' + 
                         Math.floor(255-5*i) + ')';
		//左から20上から20の位置に幅50高さ50の輪郭の四角形を描く
		//canvasCtx.strokeRect(20,20,50,50);
		canvasCtx.strokeRect(x1,y1,x2-x1,y2-y1);
		
		canvasCtx.font = "16px serif";
		canvasCtx.fillText(pos[0], x1, y1 - 5)
		//canvasCtx.fillRect(x1, y1, x2-x1, y2-y1);
		//新しいパスを開始する
		//canvasCtx.beginPath();
		//パスの開始座標を指定する
		//canvasCtx.moveTo(x1,y1);
		//座標を指定してラインを引いていく
		//canvasCtx.lineTo(x2,y1);
		//canvasCtx.lineTo(x2,y2);
		//canvasCtx.lineTo(x1,y2);
		//console.log(x1 + "," + y1 + "," + x2 + "," + y2);
		//パスを閉じる（最後の座標から開始座標に向けてラインを引く）
		//canvasCtx.closePath();
		//現在のパスを輪郭表示する
		//canvasCtx.stroke();
	}
  }
  requestAnimationFrame(_canvasUpdate);
};
