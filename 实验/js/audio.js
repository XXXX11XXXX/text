
var body = document.getElementById('body');

var audio = document.getElementById('audioTag');


var musicTitle = document.getElementById('music-title');

var recordImg = document.getElementById('record-img');

var author = document.getElementById('author-name');


var progress = document.getElementById('progress');

var progressTotal = document.getElementById('progress-total');


var playedTime = document.getElementById('playedTime');

var audioTime = document.getElementById('audioTime');

var mode = document.getElementById('playMode');

var skipForward = document.getElementById('skipForward');

var pause = document.getElementById('playPause');

var skipBackward = document.getElementById('skipBackward');

var volume = document.getElementById('volume');
var volumeTogger = document.getElementById('volumn-togger');

var list = document.getElementById('list');
var speed = document.getElementById('speed');
var MV = document.getElementById('MV');
var closeList = document.getElementById('close-list');
var musicList = document.getElementById('music-list');
pause.onclick = function (e) {
    if (audio.paused) {
        audio.play();
        rotateRecord();
        pause.classList.remove('icon-play');
        pause.classList.add('icon-pause');
    } else {
        audio.pause();
        rotateRecordStop();
        pause.classList.remove('icon-pause');
        pause.classList.add('icon-play');
    }
}


audio.addEventListener('timeupdate', updateProgress); 
function updateProgress() {
    var value = audio.currentTime / audio.duration;
    progress.style.width = value * 100 + '%';
    playedTime.innerText = transTime(audio.currentTime);
}

function transTime(value) {
    var time = "";
    var h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (h > 0) {
        time = formatTime(h + ":" + m + ":" + s);
    } else {
        time = formatTime(m + ":" + s);
    }

    return time;
}

function formatTime(value) {
    var time = "";
    var s = value.split(':');
    var i = 0;
    for (; i < s.length - 1; i++) {
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];
        time += ":";
    }
    time += s[i].length == 1 ? ("0" + s[i]) : s[i];

    return time;
}

progressTotal.addEventListener('mousedown', function (event) {

    if (!audio.paused || audio.currentTime != 0) {
        var pgsWidth = parseFloat(window.getComputedStyle(progressTotal, null).width.replace('px', ''));
        var rate = event.offsetX / pgsWidth;
        audio.currentTime = audio.duration * rate;
        updateProgress(audio);
    }
});


list.addEventListener('click', function (event) {
    musicList.classList.remove("list-card-hide");
    musicList.classList.add("list-card-show");
    musicList.style.display = "flex";
    closeList.style.display = "flex";
    closeList.addEventListener('click', closeListBoard);
});


function closeListBoard() {
    musicList.classList.remove("list-card-show");
    musicList.classList.add("list-card-hide");
    closeList.style.display = "none";
}


var musicId = 0;


let musicData = [['洛春赋', '云汐'], ['Yesterday', 'Alok/Sofi Tukker'], ['江南烟雨色', '杨树人'], ['Vision pt.II', 'Vicetone']];

function initMusic() {
    audio.src = "mp3/music" + musicId.toString() + ".mp3";
    audio.load();
    recordImg.classList.remove('rotate-play');
    audio.ondurationchange = function () {
        musicTitle.innerText = musicData[musicId][0];
        author.innerText = musicData[musicId][1];
        recordImg.style.backgroundImage = "url('img/record"+musicId.toString()+".jpg')";
        body.style.backgroundImage = "url('img/bg"+musicId.toString()+".png')";
        audioTime.innerText = transTime(audio.duration);
        audio.currentTime = 0;
        updateProgress();
        refreshRotate();
    }
}
initMusic();

function initAndPlay() {
    initMusic();
    pause.classList.remove('icon-play');
    pause.classList.add('icon-pause');
    audio.play();
    rotateRecord();
}

var modeId = 1;
mode.addEventListener('click', function (event) {
    modeId = modeId + 1;
    if (modeId > 3) {
        modeId = 1;
    }
    mode.style.backgroundImage = "url('img/mode" + modeId.toString() + ".png')";
});

audio.onended = function () {
    if (modeId == 2) {
        musicId = (musicId + 1) % 4;
    }
    else if (modeId == 3) {
        var oldId = musicId;
        while (true) {
            musicId = Math.floor(Math.random() * 3) + 0;
            if (musicId != oldId) { break; }
        }
    }
    initAndPlay();
}

skipForward.addEventListener('click', function (event) {
    musicId = musicId - 1;
    if (musicId < 0) {
        musicId = 3;
    }
    initAndPlay();
});
skipBackward.addEventListener('click', function (event) {
    musicId = musicId + 1;
    if (musicId > 3) {
        musicId = 0;
    }
    initAndPlay();
});

speed.addEventListener('click', function (event) {
    var speedText = speed.innerText;
    if (speedText == "1.0X") {
        speed.innerText = "1.5X";
        audio.playbackRate = 1.5;
    }
    else if (speedText == "1.5X") {
        speed.innerText = "2.0X";
        audio.playbackRate = 2.0;
    }
    else if (speedText == "2.0X") {
        speed.innerText = "0.5X";
        audio.playbackRate = 0.5;
    }
    else if (speedText == "0.5X") {
        speed.innerText = "1.0X";
        audio.playbackRate = 1.0;
    }
});


MV.addEventListener('click', function (event) {
    
    var storage_list = window.sessionStorage;
    storage_list['musicId'] = musicId;
    window.open("video.html");
});
document.getElementById("music0").addEventListener('click', function (event) {
    musicId = 0;
    initAndPlay();
});
document.getElementById("music1").addEventListener('click', function (event) {
    musicId = 1;
    initAndPlay();
});
document.getElementById("music2").addEventListener('click', function (event) {
    musicId = 2;
    initAndPlay();
});
document.getElementById("music3").addEventListener('click', function (event) {
    musicId = 3;
    initAndPlay();
});

function refreshRotate() {
    recordImg.classList.add('rotate-play');
}

function rotateRecord() {
    recordImg.style.animationPlayState = "running"
}

function rotateRecordStop() {
    recordImg.style.animationPlayState = "paused"
}

var lastVolumn = 70

audio.addEventListener('timeupdate', updateVolumn);
function updateVolumn() {
    audio.volume = volumeTogger.value / 70;
}

volume.addEventListener('click', setNoVolumn);
function setNoVolumn() {
    if (volumeTogger.value == 0) {
        if (lastVolumn == 0) {
            lastVolumn = 70;
        }
        volumeTogger.value = lastVolumn;
        volume.style.backgroundImage = "url('img/音量.png')";
    }
    else {
        lastVolumn = volumeTogger.value;
        volumeTogger.value = 0;
        volume.style.backgroundImage = "url('img/静音.png')";
    }
}
