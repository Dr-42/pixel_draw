const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

let dim = Math.min(window.innerHeight, window.innerWidth) - 200;
let height = dim;
let width = dim;

canvas.width = width;
canvas.height = height;

let res_dropdown = document.getElementById('res') as HTMLSelectElement;
res_dropdown.value = '1';

let cellSize = width / 8;

let res = 1;


//Canvas grid
const checkerLight = '#303030';
const checkerDark = '#202020';
const empty = 'empty';

let numRow = Math.floor(width / cellSize);
let numCol = Math.floor(height / cellSize);

let cellColor = new Array(numRow);
for (let i = 0; i < numRow; i++) {
	cellColor[i] = new Array(numCol);
	for (let j = 0; j < numCol; j++) {
		cellColor[i][j] = empty;
	}
}

function renderGrid() {
	for (let i = 0; i < numRow; i++) {
		for (let j = 0; j < numCol; j++) {
			if (cellColor[i][j] === empty) {
				if ((i + j) % 2 === 0) {
					ctx.fillStyle = checkerLight;
					ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
				} else {
					ctx.fillStyle = checkerDark;
					ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
				}
			} else {
				ctx.fillStyle = cellColor[i][j];
				ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
			}
		}
	}
}

let channel = document.getElementById('channel') as HTMLInputElement;
channel.value = '1';
let channelValue = channel.value;

let colors: Array<string> = [];

let selectedColor = document.getElementById('color') as HTMLInputElement;
selectedColor.value = '#3355aa';
let foreground = selectedColor.value;

let clearing = document.getElementById('clear') as HTMLButtonElement;
let drawing = document.getElementById('draw') as HTMLButtonElement;

channel.addEventListener('change', () => {
	channelValue = channel.value;
	if (colors[channelValue] === undefined) {
		colors[channelValue] = '#3355aa';
	}
	foreground = colors[channelValue];
	selectedColor.value = foreground;
});

selectedColor.addEventListener('change', () => {
	foreground = selectedColor.value;
	channelValue = channel.value;
	colors[channelValue] = foreground;
});

clearing.addEventListener('click', () => {
	foreground = empty;
});

drawing.addEventListener('click', () => {
	foreground = selectedColor.value;
});

canvas.addEventListener('click', (e) => {
	const x = e.offsetX;
	const y = e.offsetY;
	const col = Math.floor(x / cellSize);
	const row = Math.floor(y / cellSize);
	cellColor[col][row] = foreground;
	renderGrid();
});

document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		for (let i = 0; i < numRow; i++) {
			for (let j = 0; j < numCol; j++) {
				cellColor[i][j] = empty;
			}
		}
		renderGrid();
	}
});

res_dropdown.addEventListener('change', () => {
	switch (res_dropdown.value) {
		case '1':
			cellSize = width / 8;
			res = 1;
		break;
		case '2':
			cellSize = width / 16;
			res = 2;
		break;
		case '3':
			cellSize = width / 32;
			res = 3;
		break;
		case '4':
			cellSize = width / 64;
			res = 4;
		break;
	}
	numRow = Math.floor(width / cellSize);
	numCol = Math.floor(height / cellSize);
	cellColor = new Array(numRow);
	for (let i = 0; i < numRow; i++) {
		cellColor[i] = new Array(numCol);
		for (let j = 0; j < numCol; j++) {
			cellColor[i][j] = empty;
		}
	}
	renderGrid();
});

canvas.addEventListener('mousemove', (e) => {
	const x = e.offsetX;
	const y = e.offsetY;
	const col = Math.floor(x / cellSize);
	const row = Math.floor(y / cellSize);
	if (e.buttons === 1) {
		cellColor[col][row] = foreground;
	}
	renderGrid();
});

let save = document.getElementById('save') as HTMLButtonElement;
save.addEventListener('click', () => {

	//Save image to png without checkerboard background
	let temp = new Array(numRow);
	for (let i = 0; i < numRow; i++) {
		temp[i] = new Array(numCol);
		for (let j = 0; j < numCol; j++) {
			temp[i][j] = cellColor[i][j];
			if (temp[i][j] === checkerLight || temp[i][j] === checkerDark) {
				temp[i][j] = empty;
			}
		}
	}
	let canv = document.createElement('canvas');
	canv.width = numRow;
	canv.height = numCol;
	let ct = canv.getContext('2d');
	let imgData = ct.getImageData(0, 0, width, height);
	for (let i = 0; i < numRow; i++) {
		for (let j = 0; j < numCol; j++) {
			let index = (i + j * imgData.width) * 4;
			let color = temp[i][j];
			if (color === empty) {
				imgData.data[index + 0] = 0;
				imgData.data[index + 1] = 0;
				imgData.data[index + 2] = 0;
				imgData.data[index + 3] = 0;
			} else {
				imgData.data[index + 0] = parseInt(color.substring(1, 3), 16);
				imgData.data[index + 1] = parseInt(color.substring(3, 5), 16);
				imgData.data[index + 2] = parseInt(color.substring(5, 7), 16);
				imgData.data[index + 3] = 255;
			}
		}
	}
	ct.putImageData(imgData, 0, 0);
	var link = document.createElement('a');
	link.download = 'image.png';
	link.href = canv.toDataURL();
	link.click();
});
renderGrid();
