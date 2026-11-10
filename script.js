/* =========================================
   CONFIGURATION
========================================= */
const CONFIG = {
    countdownWords: [
        "3", "2", "1", "HAPPY", "BIRTHDAY", "TO", "ဖေကောင်း", "SCORPIO"
    ],

    bookPage: {
        wish: "Happy birthday par ဖေကောင်းမွေးနေ့မှစဖြစ်ချင်တာတွေအကုန်ဖြစ်မြောက်အောင်မြင်ပါစေစိတ်ရောကိုယ်ပါကျန်းကျန်းမာမာချမ်းချမ်းသာသာနဲ့ ဘဝကိုအထီးမကျန်ပဲ‌ေပျာ်‌ေပျာ်ရွှင်ရွှင်ဖြတ်သန်းနိုင်ပါစေ🦂",
        leftPhoto: "1.jpg",
        rightPhoto: "6.jpg"
    },

    collagePhotos: [
        "1.jpg", "5.jpg", "3.jpg", "4.jpg", "1.jpg", "4.jpg",
        "5.jpg", "1.jpg", "1.jpg", "6.jpg", "5.jpg", "4.jpg",
        "3.jpg", "6.jpg", "4.jpg", "6.jpg", "5.jpg"
    ]
};

/* =========================================
   DOM ELEMENTS
========================================= */
const introMusic  = document.getElementById("intro-music");
const wishVoice   = document.getElementById("wish-voice");
const soundHint   = document.getElementById("sound-hint");
const bearIntro   = document.getElementById("bear-intro");
const bookStage   = document.getElementById("book-stage");
const bookWrapper = document.getElementById("book-wrapper");
const bookCover   = document.getElementById("book-cover");
const bookSpread  = document.getElementById("book-spread");
const messageBox  = document.getElementById("message-box");
const messageText = document.getElementById("message-text");
const tapGuide    = document.getElementById("tap-guide");
const leftImg     = document.getElementById("left-img");
const rightImg    = document.getElementById("right-img");
const heartStage  = document.getElementById("heart-stage");

const s1Canvas   = document.getElementById("stage1-canvas");
const ctx        = s1Canvas.getContext("2d");
const starCanvas = document.getElementById("star-canvas");
const sCtx       = starCanvas.getContext("2d");


/* =========================================
   AUDIO CONTROL
========================================= */
let musicStarted = false;
let wishStarted  = false;

// Intro သီချင်းကို ဖွင့်တဲ့ Function
function playIntroMusic() {
    if (musicStarted) return;
    
    // အသံကို အတင်းဖွင့်ကြည့်မယ်
    introMusic.play()
        .then(() => {
            musicStarted = true;
            if (soundHint) soundHint.style.opacity = "0";
        })
        .catch((error) => {
            // ဖုန်းက ခွင့်မပြုသေးရင် သတိပေးစာသားလေး ပြထားမယ်
            console.log("Autoplay blocked. Waiting for user interaction.");
            if (soundHint) {
                soundHint.style.opacity = "1";
                soundHint.textContent = "TAP ANYWHERE TO PLAY MUSIC ♫";
            }
        });
}

// Voice ဖွင့်တဲ့ Function
function startBirthdayVoice() {
    if (wishStarted) return;
    wishStarted = true;

    introMusic.pause();
    introMusic.currentTime = 0;

    wishVoice.volume = 1;
    wishVoice.currentTime = 0;

    wishVoice.play().catch(() => {
        console.log("Birthday voice playback was blocked.");
    });
}

// ✅ ဖုန်းမျက်နှာပြင်တွင် ဘယ်နေရာမှာမဆို နှိပ်လိုက်တာနဲ့ အသံဖွင့်မယ်
document.addEventListener("pointerdown", () => {
    if (!musicStarted) {
        playIntroMusic();
    }
});

// ပထမဆုံး Page စဖွင့်ချင်းမှာ ကြိုးစားဖွင့်ကြည့်မယ်
window.addEventListener("load", () => {
    playIntroMusic();
});


/* =========================================
   CANVAS SETUP
========================================= */
let W = window.innerWidth;
let H = window.innerHeight;
const fontSize = 14;
let columns = Math.floor(W / fontSize);
let drops = Array(columns).fill(1);
let particles = [];

const offCanvas = document.createElement("canvas");
const offCtx = offCanvas.getContext("2d");
const matrixChars = "HAPPYBIRTHDAYSCORPIO01♏";

function resizeCanvas() {
    W = window.innerWidth;
    H = window.innerHeight;
    s1Canvas.width = W;
    s1Canvas.height = H;
    starCanvas.width = W;
    starCanvas.height = H;
    columns = Math.floor(W / fontSize);
    drops = Array(columns).fill(1);
}


/* =========================================
   STAGE 1: MATRIX COUNTDOWN
========================================= */
function sampleTextCoordinates(text) {
    offCanvas.width = W;
    offCanvas.height = H;
    offCtx.clearRect(0, 0, W, H);

    const size = text.length > 5
        ? Math.min(W / (text.length * .72), 110)
        : Math.min(W * .35, 160);

    offCtx.font = `900 ${size}px Arial`;
    offCtx.fillStyle = "#ffffff";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillText(text, W / 2, H / 2);

    const data = offCtx.getImageData(0, 0, W, H).data;
    const coords = [];
    const gap = W < 500 ? 5 : 6;

    for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
            if (data[(y * W + x) * 4 + 3] > 128) {
                coords.push({ x, y });
            }
        }
    }
    return coords;
}

function updateParticlesForWord(word) {
    const targets = sampleTextCoordinates(word);
    while (particles.length < targets.length) {
        particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            tx: W / 2,
            ty: H / 2,
            size: Math.random() * 2 + 2,
            active: false
        });
    }
    particles.forEach((p, i) => {
        if (i < targets.length) {
            p.tx = targets[i].x;
            p.ty = targets[i].y;
            p.active = true;
        } else {
            p.active = false;
        }
    });
}

let stage1Running = true;

function animateStage1() {
    if (!stage1Running) return;
    ctx.fillStyle = "rgba(3,6,12,.22)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#d8b56d";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > H && Math.random() > .975) {
            drops[i] = 0;
        }
        drops[i]++;
    }

    ctx.fillStyle = "#f5dfaa";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#d8b56d";

    for (const p of particles) {
        if (!p.active) continue;
        p.x += (p.tx - p.x) * .14;
        p.y += (p.ty - p.y) * .14;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.shadowBlur = 0;
    requestAnimationFrame(animateStage1);
}

let wordIdx = 0;

function startSequence() {
    animateStage1();
    const interval = setInterval(() => {
        if (wordIdx < CONFIG.countdownWords.length) {
            updateParticlesForWord(CONFIG.countdownWords[wordIdx]);
            wordIdx++;
        } else {
            clearInterval(interval);
            transitionToStage2();
        }
    }, 1450);
}


/* =========================================
   STAGE 2: STARRY NIGHT
========================================= */
let stars = [];

function initStars() {
    stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + .5,
        alpha: Math.random(),
        speed: Math.random() * .02 + .005
    }));
    animateStars();
}

function animateStars() {
    sCtx.clearRect(0, 0, W, H);
    for (const s of stars) {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < .2) {
            s.speed *= -1;
        }
        sCtx.fillStyle = `rgba(244,223,170,${s.alpha})`;
        sCtx.beginPath();
        sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sCtx.fill();
    }
    requestAnimationFrame(animateStars);
}

function transitionToStage2() {
    s1Canvas.style.opacity = "0";
    starCanvas.style.opacity = "1";
    initStars();

    setTimeout(() => {
        stage1Running = false;
        s1Canvas.style.display = "none";
        bearIntro.classList.add("active");

        setTimeout(() => {
            bearIntro.classList.remove("active");
            setTimeout(() => {
                bookStage.classList.add("active");
            }, 600);
        }, 2700);
    }, 900);
}


/* =========================================
   STAGE 3: BIRTHDAY BOOK
========================================= */
let bookState   = "closed";
let typingTimer = null;

function typeMessage(text) {
    messageText.textContent = "";
    clearInterval(typingTimer);
    let i = 0;

    typingTimer = setInterval(() => {
        if (i < text.length) {
            messageText.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingTimer);
        }
    }, 45);
}

function loadPage() {
    leftImg.src  = CONFIG.bookPage.leftPhoto;
    rightImg.src = CONFIG.bookPage.rightPhoto;
    typeMessage(CONFIG.bookPage.wish);
}

function handleBookClick() {
    if (bookState === "finished") return;

    if (bookState === "closed") {
        bookState = "open";
        startBirthdayVoice();
        bookCover.classList.add("hidden");
        bookSpread.classList.add("open");
        messageBox.classList.add("show");
        tapGuide.textContent = "TAP AGAIN TO SEE YOUR SURPRISE ♥";
        loadPage();
    }
    else if (bookState === "open") {
        bookState = "finished";
        clearInterval(typingTimer);
        messageBox.classList.remove("show");
        bookSpread.classList.add("closing");
        tapGuide.style.opacity = "0";
        setTimeout(() => {
            bookStage.classList.remove("active");
            startHeartFinale();
        }, 750);
    }
}

bookWrapper.addEventListener("click", handleBookClick);


/* =========================================
   STAGE 4: HEART PHOTO COLLAGE
========================================= */
const heartPositions = [
    { x: -1.1, y: -1.7 }, { x: -2.1, y: -2.0 }, { x: -3.0, y: -1.3 },
    { x: -3.2, y: -.2 }, { x: -2.6, y: .9 }, { x: -1.7, y: 1.8 },
    { x: -.8, y: 2.6 }, { x: 0, y: 3.3 }, { x: .8, y: 2.6 },
    { x: 1.7, y: 1.8 }, { x: 2.6, y: .9 }, { x: 3.2, y: -.2 },
    { x: 3.0, y: -1.3 }, { x: 2.1, y: -2.0 }, { x: 1.1, y: -1.7 },
    { x: 0, y: -1.1 }, { x: 0, y: .3 }
];

function startHeartFinale() {
    const step = Math.min(W, H) < 500 ? 42 : 56;
    heartPositions.forEach((pos, idx) => {
        const tile = document.createElement("div");
        tile.className = "heart-tile";
        const img = document.createElement("img");
        img.src = CONFIG.collagePhotos[idx % CONFIG.collagePhotos.length];
        tile.appendChild(img);
        heartStage.appendChild(tile);

        setTimeout(() => {
            tile.style.opacity = "1";
            tile.style.transform = `translate(${pos.x * step}px, ${pos.y * step}px) scale(1)`;
        }, idx * 110);
    });
}


/* =========================================
   WINDOW RESIZE
========================================= */
window.addEventListener("resize", () => {
    resizeCanvas();
    if (stars.length) {
        stars.forEach(s => {
            s.x = Math.random() * W;
            s.y = Math.random() * H;
        });
    }
    if (wordIdx > 0 && wordIdx <= CONFIG.countdownWords.length) {
        updateParticlesForWord(CONFIG.countdownWords[wordIdx - 1]);
    }
});


/* =========================================
   START EVERYTHING
========================================= */
resizeCanvas();
startSequence();
