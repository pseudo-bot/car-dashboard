// sidebar

const sidebarBtns = document.querySelectorAll('.side-btn');
const nav = document.querySelector('.nav');
const wrapper = document.querySelector('.wrapper');
sidebarBtns.forEach((btn, index) => {
	btn.addEventListener('click', () => {
		nav.style.transform = `translateY(${index * 10.7}rem)`;
		wrapper.style.transform = `translateY(-${index * 20}%`;
	});
});

// mapbox

mapboxgl.accessToken =
	'pk.eyJ1IjoicHNldWRvYm90IiwiYSI6ImNrcjBlajloMDFyMWsycHFwYjhueXVkb3QifQ.ZGVjk7dzAa74UqAmbKQgsQ';
let map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [85, 22.5],
	zoom: 6,
});

map.addControl(
	new mapboxgl.GeolocateControl({
		positionOptions: {
			enableHighAccuracy: true,
		},
		trackUserLocation: true,
	}),
	'top-left'
);

map.addControl(
	new MapboxDirections({
		accessToken: mapboxgl.accessToken,
	}),
	'top-right'
);

map.addControl(new mapboxgl.NavigationControl(), 'top-left');

// display time

let time = document.querySelector('.time');

let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getTime() {
	let d = new Date();
	let m = d.getMinutes();
	let h = d.getHours();
	let s = d.getSeconds();
	let day = days[d.getDay()];

	time.textContent =
		day +
		' ' +
		(h < 10 ? '0' + h : h) +
		':' +
		(m < 10 ? '0' + m : m) +
		':' +
		(s < 10 ? '0' + s : s);
}

setInterval(getTime, 500);

// speed animation

let speed = document.querySelector('.speed-num');

let speedVal = 0;
let animationTime = 100;

let speedAnimation = () => {
	animationTime -= 0.5;
	speed.textContent = speedVal;
	speedVal++;
	if (speedVal == 262) {
		let speedInfo = document.querySelector('.speed-info');
		speedInfo.textContent = `Max Speed`;
		speedInfo.classList.remove('speed-flicker');
		return;
	}
	setTimeout(speedAnimation, animationTime);
};

setTimeout(speedAnimation, animationTime);

// Music player

let playBtn = document.querySelector('.play-btn');
let pauseBtn = document.querySelector('.pause-btn');
let imageRotate = document.querySelectorAll('.song-img');
let audio = document.querySelector('audio');
let progress = document.querySelector('.progress');
let progressContainer = document.querySelector('.progress-container');

let addFiles = document.querySelector('.add-file');
let musicInput = document.querySelector('#music-input');
let musicList = document.querySelector('.song-list');

let musicFiles = [];
let musicNames = [];
let musicQueue = [];
let queuedSongs = [];
let currentPlaying = 0;
let counter = 0;

let validFiles = /(\.mp3|\.m4a|\.3gp|\.webm)$/i;

let flag = 1;

playBtn.addEventListener('click', () => {
	if (musicQueue.length === 0) return;
	playBtn.classList.remove('current-btn');
	pauseBtn.classList.add('current-btn');
	imageRotate.forEach((element) => element.classList.remove('img-rotate'));
	if (flag) {
		document.querySelector('.song-name').textContent = musicNames[0];
		document.querySelector(
			'.song-name-hood'
		).textContent = `Playing ${musicNames[0]}`;
		flag = 0;
	}
	audio.play();
});

pauseBtn.addEventListener('click', () => {
	if (musicQueue.length === 0) return;
	playBtn.classList.add('current-btn');
	pauseBtn.classList.remove('current-btn');
	imageRotate.forEach((element) => element.classList.add('img-rotate'));
	audio.pause();
});

addFiles.addEventListener('click', () => musicInput.click());

musicInput.addEventListener('change', () => {
	let inputfiles = musicInput.files;
	for (let i = 0; i < inputfiles.length; i++) {
		if (!validFiles.exec(inputfiles[i].name)) {
			alert('Unknown file-type detected. Please input valid media files!');
			return;
		}
		musicNames.push(inputfiles[i].name);
		musicFiles.push(inputfiles[i]);
	}

	updateList();
});

function updateList() {
	musicFiles.forEach((song, index) => {
		if (queuedSongs.includes(musicNames[index])) return;

		let div = document.createElement('div');
		div.textContent = `${musicNames[index]}`;
		div.setAttribute('class', 'songs');
		if (counter % 2 == 0) div.setAttribute('class', 'songs songs--dark');
		musicList.appendChild(div);

		counter++;
		queuedSongs.push(musicNames[index]);
	});

	musicQueue = document.querySelectorAll('.songs');
	if (!audio.hasAttribute('src')) {
		audio.setAttribute('src', URL.createObjectURL(musicFiles[0]));
		audio.load();
	}

	musicQueue.forEach((music, index) => {
		music.addEventListener('click', () => {
			currentPlaying = index;
			audio.setAttribute('src', URL.createObjectURL(musicFiles[index]));
			audio.load();
			document.querySelector('.song-name').textContent = musicNames[index];
			document.querySelector(
				'.song-name-hood'
			).textContent = `Playing ${musicNames[index]}`;
			audio.play();
			playBtn.click();
		});
	});
}

let next = document.querySelector('.next-btn');
let prev = document.querySelector('.prev-btn');

next.addEventListener('click', () => {
	if (musicQueue.length === 0) return;
	currentPlaying++;
	if (currentPlaying > musicQueue.length - 1) currentPlaying = 0;
	musicQueue[currentPlaying].click();
});

prev.addEventListener('click', () => {
	if (musicQueue.length === 0) return;
	currentPlaying--;
	if (currentPlaying < 0) currentPlaying = musicQueue.length - 1;
	musicQueue[currentPlaying].click();
});

audio.addEventListener('ended', () => {
	if (!audio.hasAttribute('src')) return;
	next.click();
});

audio.addEventListener('timeupdate', () => {
	const { duration, currentTime } = audio;
	let progressWidth = (currentTime / duration) * 100;
	progress.style.width = `${progressWidth}%`;
});

progressContainer.addEventListener('click', (e) => {
	if (!audio.hasAttribute('src')) return;
	const width = progressContainer.clientWidth;
	const clickX = e.offsetX;
	const duration = audio.duration;
	audio.currentTime = (clickX / width) * duration;
});

const muteBtn = document.querySelector('.mute-btn');
const unmuteBtn = document.querySelector('.unmute-btn');

muteBtn.addEventListener('click', () => {
	audio.muted = true;
	muteBtn.classList.remove('sound');
	unmuteBtn.classList.add('sound');
});

unmuteBtn.addEventListener('click', () => {
	audio.muted = false;
	unmuteBtn.classList.remove('sound');
	muteBtn.classList.add('sound');
});
