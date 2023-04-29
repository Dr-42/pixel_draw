var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var dim = Math.min(window.innerHeight, window.innerWidth) - 200;
var height = dim;
var width = dim;
canvas.width = width;
canvas.height = height;
var res_dropdown = document.getElementById('res');
res_dropdown.value = '1';
var cellSize = width / 8;
var res = 1;
//Canvas grid
var checkerLight = '#303030';
var checkerDark = '#202020';
var empty = 'empty';
var numRow = Math.floor(width / cellSize);
var numCol = Math.floor(height / cellSize);
var cellColor = new Array(numRow);
for (var i = 0; i < numRow; i++) {
    cellColor[i] = new Array(numCol);
    for (var j = 0; j < numCol; j++) {
        cellColor[i][j] = empty;
    }
}
function renderGrid() {
    for (var i = 0; i < numRow; i++) {
        for (var j = 0; j < numCol; j++) {
            if (cellColor[i][j] === empty) {
                if ((i + j) % 2 === 0) {
                    ctx.fillStyle = checkerLight;
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                }
                else {
                    ctx.fillStyle = checkerDark;
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                }
            }
            else {
                ctx.fillStyle = cellColor[i][j];
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }
}
var channel = document.getElementById('channel');
channel.value = '1';
var channelValue = channel.value;
var colors = [];
var selectedColor = document.getElementById('color');
selectedColor.value = '#3355aa';
var foreground = selectedColor.value;
var clearing = document.getElementById('clear');
var drawing = document.getElementById('draw');
channel.addEventListener('change', function () {
    channelValue = channel.value;
    if (colors[channelValue] === undefined) {
        colors[channelValue] = '#3355aa';
    }
    foreground = colors[channelValue];
    selectedColor.value = foreground;
});
selectedColor.addEventListener('change', function () {
    foreground = selectedColor.value;
    channelValue = channel.value;
    colors[channelValue] = foreground;
});
clearing.addEventListener('click', function () {
    foreground = empty;
});
drawing.addEventListener('click', function () {
    foreground = selectedColor.value;
});
var brushsize = document.getElementById('brush');
brushsize.value = '1';
var brushValue = brushsize.value;
brushsize.addEventListener('change', function () {
    brushValue = brushsize.value;
});
canvas.addEventListener('click', function (e) {
    var x = e.offsetX;
    var y = e.offsetY;
    var col = Math.floor(x / cellSize);
    var row = Math.floor(y / cellSize);
    if (brushValue === '1') {
        cellColor[col][row] = foreground;
    }
    else {
        var brushNum = parseInt(brushValue);
        for (var i = 0; i < brushNum; i++) {
            for (var j = 0; j < brushNum; j++) {
                cellColor[col + i][row + j] = foreground;
            }
        }
    }
    renderGrid();
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        for (var i = 0; i < numRow; i++) {
            for (var j = 0; j < numCol; j++) {
                cellColor[i][j] = empty;
            }
        }
        renderGrid();
    }
});
res_dropdown.addEventListener('change', function () {
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
        case '5':
            cellSize = width / 128;
            res = 5;
            break;
        default:
            throw new Error('Invalid resolution');
    }
    numRow = Math.floor(width / cellSize);
    numCol = Math.floor(height / cellSize);
    cellColor = new Array(numRow);
    for (var i = 0; i < numRow; i++) {
        cellColor[i] = new Array(numCol);
        for (var j = 0; j < numCol; j++) {
            cellColor[i][j] = empty;
        }
    }
    renderGrid();
});
canvas.addEventListener('mousemove', function (e) {
    var x = e.offsetX;
    var y = e.offsetY;
    var col = Math.floor(x / cellSize);
    var row = Math.floor(y / cellSize);
    if (e.buttons === 1) {
        if (brushValue === '1') {
            cellColor[col][row] = foreground;
        }
        else {
            var brushNum = parseInt(brushValue);
            for (var i = 0; i < brushNum; i++) {
                for (var j = 0; j < brushNum; j++) {
                    cellColor[col + i][row + j] = foreground;
                }
            }
        }
    }
    renderGrid();
});
var save = document.getElementById('save');
save.addEventListener('click', function () {
    //Save image to png without checkerboard background
    var temp = new Array(numRow);
    for (var i = 0; i < numRow; i++) {
        temp[i] = new Array(numCol);
        for (var j = 0; j < numCol; j++) {
            temp[i][j] = cellColor[i][j];
            if (temp[i][j] === checkerLight || temp[i][j] === checkerDark) {
                temp[i][j] = empty;
            }
        }
    }
    var canv = document.createElement('canvas');
    canv.width = numRow;
    canv.height = numCol;
    var ct = canv.getContext('2d');
    var imgData = ct.getImageData(0, 0, width, height);
    for (var i = 0; i < numRow; i++) {
        for (var j = 0; j < numCol; j++) {
            var index = (i + j * imgData.width) * 4;
            var color = temp[i][j];
            if (color === empty) {
                imgData.data[index + 0] = 0;
                imgData.data[index + 1] = 0;
                imgData.data[index + 2] = 0;
                imgData.data[index + 3] = 0;
            }
            else {
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
