/* VARS */
var PUZZLE_DIFFICULTY = 3;
const PUZZLE_HOVER_TINT = '#009900';


var image = "";
var _stage;
var _canvas = document.getElementById('canvas');

var _img;
var _pieces;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _currentPiece;
var _currentDropPiece;

var _mouse;

var overlay;
var modal;
var closeButton;
/* ---------------BROWSER DETECTION----------- */
// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 79
var isChrome = !!window.chrome;

// Edge (based on chromium) detection
var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

/* -------------END OFBROWSER DETECTION----------- */

/* -------------MUSTACHE----------- */

var listOfImages = [
    {
        image: "imgs/losia.jpg",
        name: "Łoś - klępa",
        imgdata: "losia"
    },
    {
        image: "imgs/nart.jpg",
        name: "Obszar Ochrony Ścisłej - Nart",
        imgdata: "nart"
    },
    {
        image: "imgs/ols.jpg",
        name: "Ols",
        imgdata: "ols"
    },
    {
        image: "imgs/pajeczyna.jpg",
        name: "Pajęczyna",
        imgdata: "pajeczyna"
    },
    {
        image: "imgs/rys.jpg",
        name: "Ryś",
        imgdata: "rys"
    },
    {
        image: "imgs/wydma.jpg",
        name: "Wydma",
        imgdata: "wydma"
    }
];
var results = document.getElementById('gallery');
var mustacheGalleryTemplate = document.getElementById('imageTemplate').innerHTML;
Mustache.parse(mustacheGalleryTemplate);
var listPhotos = "";

listOfImages.map( element => {
    listPhotos += Mustache.render(mustacheGalleryTemplate, element);
    
})

var renderedGallery = Mustache.render(listPhotos);
results.insertAdjacentHTML('beforeend', renderedGallery);
/* ----------------- END OF MUSTACHE ---------------------- */

const gallery = document.getElementById('gallery');
const difficulty = document.getElementById("difficulty");
const showButton = document.getElementById("show-button");
const label = document.getElementById("label");

gallery.addEventListener('click', function (e) {
    e.stopPropagation();
    image = e.target.attributes[1].value;

    gallery.style.display = "none";
    label.style.display = "block";
    difficulty.style.display = "block";
    showButton.style.display = "block";
    _canvas.style.display = "block"
    init();
});

showButton.addEventListener('click', function (e) {
    e.stopPropagation();
    difficulty.style.display = "none";
    showButton.style.display = "none";
    gallery.style.display = "flex";
    _canvas.style.display = "none";
})

/* ------------------------------- */



function selectDifficulty() {
    PUZZLE_DIFFICULTY = document.getElementById("difficulty").value;
    init();
}

function init() {
    _img = new Image();
    _img.addEventListener('load', onImage, false);
    _img.src = `./imgs/${image}.jpg`;

    overlay = document.getElementById("modal-overlay");
    modal = document.getElementById("finishModal");
    closeButton = document.getElementById("closeButton");

    document.getElementById("closeButton").addEventListener('click', closeModal)
    //_canvas.style.display = "block"


}
function onImage(e) {
    _pieceWidth = Math.floor(_img.width / PUZZLE_DIFFICULTY)
    _pieceHeight = Math.floor(_img.height / PUZZLE_DIFFICULTY)
    _puzzleWidth = _pieceWidth * PUZZLE_DIFFICULTY;
    _puzzleHeight = _pieceHeight * PUZZLE_DIFFICULTY;
    setCanvas();
    initPuzzle();
}
function setCanvas() {
    //_canvas = document.getElementById('canvas');
    _stage = _canvas.getContext('2d');
    _canvas.width = _puzzleWidth;
    _canvas.height = _puzzleHeight;
    _canvas.style.border = "1px solid black";
}
function initPuzzle() {
    _pieces = [];
    _mouse = { x: 0, y: 0 };
    _currentPiece = null;
    _currentDropPiece = null;
    _stage.drawImage(_img, 0, 0, _puzzleWidth, _puzzleHeight, 0, 0, _puzzleWidth, _puzzleHeight);
    createTitle("Kliknij aby rozpocząć");
    buildPieces();
}
function createTitle(msg) {
    _stage.fillStyle = "grey";
    _stage.globalAlpha = .7;
    _stage.fillRect(100, _puzzleHeight - 40, _puzzleWidth - 200, 40);
    _stage.fillStyle = "#FFFFFF";
    _stage.globalAlpha = 1;
    _stage.textAlign = "center";
    _stage.textBaseline = "middle";
    _stage.font = "20px Arial";
    _stage.fillText(msg, _puzzleWidth / 2, _puzzleHeight - 20);
}
function buildPieces() {
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for (i = 0; i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY; i++) {
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        _pieces.push(piece);
        xPos += _pieceWidth;
        if (xPos >= _puzzleWidth) {
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    document.getElementById("canvas").onmousedown = shufflePuzzle;
}
function shufflePuzzle() {
    _pieces = shuffleArray(_pieces);
    _stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for (i = 0; i < _pieces.length; i++) {
        piece = _pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(xPos, yPos, _pieceWidth, _pieceHeight);
        _stage.strokeStyle = "yellow";
        xPos += _pieceWidth;
        if (xPos >= _puzzleWidth) {
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    document.getElementById("canvas").onmousedown = onPuzzleClick;
}
function onPuzzleClick(e) {
    if (e.layerX || e.layerX == 0) {
        _mouse.x = e.layerX - _canvas.offsetLeft;
        if (isFirefox || isEdge) {
            _mouse.y = e.layerY - _canvas.offsetTop;
        }
        else if (isChrome) {
            _mouse.y = e.layerY;
        }

    }
    else if (e.offsetX || e.offsetX == 0) {
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
    _currentPiece = checkPieceClicked();
    if (_currentPiece != null) {
        _stage.clearRect(_currentPiece.xPos, _currentPiece.yPos, _pieceWidth, _pieceHeight);
        _stage.save();
        _stage.globalAlpha = .9;
        _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
        _stage.restore();
        document.onmousemove = updatePuzzle;
        document.onmouseup = pieceDropped;
    }
}
function checkPieceClicked() {
    var i;
    var piece;
    for (i = 0; i < _pieces.length; i++) {
        piece = _pieces[i];
        if (_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)) {
            //PIECE NOT HIT

        }
        else {
            return piece;
        }
    }
    return null;
}
function updatePuzzle(e) {
    _currentDropPiece = null;
    if (e.layerX || e.layerX == 0) {
        _mouse.x = e.layerX - _canvas.offsetLeft;
        if (isFirefox || isEdge) {
            _mouse.y = e.layerY - _canvas.offsetTop;
        }
        else if (isChrome) {
            _mouse.y = e.layerY;
        }
    }
    else if (e.offsetX || e.offsetX == 0) {
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
    _stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);
    var i;
    var piece;
    for (i = 0; i < _pieces.length; i++) {
        piece = _pieces[i];
        if (piece == _currentPiece) {
            continue;
        }
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        if (_currentDropPiece == null) {
            if (_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)) {
                //NOT OVER
            }
            else {
                _currentDropPiece = piece;
                _stage.save();
                _stage.globalAlpha = .4;
                _stage.fillStyle = PUZZLE_HOVER_TINT;
                _stage.fillRect(_currentDropPiece.xPos, _currentDropPiece.yPos, _pieceWidth, _pieceHeight);
                _stage.restore();
            }
        }
    }
    _stage.save();
    _stage.globalAlpha = .6;
    _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
    _stage.restore();
    _stage.strokeRect(_mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
}
function pieceDropped(e) {
    document.onmousemove = null;
    document.onmouseup = null;
    if (_currentDropPiece != null) {
        var tmp = { xPos: _currentPiece.xPos, yPos: _currentPiece.yPos };
        _currentPiece.xPos = _currentDropPiece.xPos;
        _currentPiece.yPos = _currentDropPiece.yPos;
        _currentDropPiece.xPos = tmp.xPos;
        _currentDropPiece.yPos = tmp.yPos;
    }
    resetPuzzleAndCheckWin();
}
function resetPuzzleAndCheckWin() {
    _stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);
    var gameWin = true;
    var i;
    var piece;
    for (i = 0; i < _pieces.length; i++) {
        piece = _pieces[i];
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        if (piece.xPos != piece.sx || piece.yPos != piece.sy) {
            gameWin = false;
        }
    }
    if (gameWin) {
        setTimeout(gameOver, 500);
    }
}
function gameOver() {
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    openModal();
    initPuzzle();
}
function shuffleArray(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

/* MODAL */


function openModal() {
    overlay.style.display = "block";
    modal.style.display = "flex";
}

function closeModal() {
    overlay.style.display = "none";
    modal.style.display = "none";
}


