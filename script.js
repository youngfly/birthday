// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initFireworks();
    bindEvents();
});

// ===== 卡片计数器 =====
let cardIndex = 1;  // 1-8 轮流

// ===== 事件绑定 =====
function bindEvents() {
    const giftBox = document.getElementById('gift-box');
    if (giftBox) {
        giftBox.addEventListener('click', openGift);
    }

    const cake = document.getElementById('cake');
    if (cake) {
        cake.addEventListener('click', openCakeGift);
    }

    const giftBox2 = document.getElementById('gift-box-2');
    if (giftBox2) {
        giftBox2.addEventListener('click', openGift2);
    }

    const closeBtn = document.getElementById('card-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCardModal);
    }

    const cardModal = document.getElementById('card-modal');
    if (cardModal) {
        cardModal.addEventListener('click', function(e) {
            if (e.target === cardModal) {
                closeCardModal();
            }
        });
    }

    const musicBtn = document.getElementById('music-btn');
    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusic);
    }

    const videoCloseBtn = document.getElementById('video-close-btn');
    if (videoCloseBtn) {
        videoCloseBtn.addEventListener('click', closeVideoModal);
    }

    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }

    const birthdayVideo = document.getElementById('birthday-video');
    if (birthdayVideo) {
        birthdayVideo.addEventListener('ended', function() {
            this.pause();
        });
        birthdayVideo.addEventListener('click', function() {
            if (this.paused) {
                this.play();
            }
        });
    }
}

// ===== 音乐控制 =====
function playMusic() {
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');
    if (music) {
        music.volume = 0.5;
        const playPromise = music.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => { /* 自动播放被浏览器阻止时忽略 */ });
        }
    }
    if (musicBtn) musicBtn.classList.add('playing');
    if (musicIcon) musicIcon.textContent = '🎶';
}

function toggleMusic() {
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');
    if (!music) return;

    if (music.paused) {
        music.play();
        if (musicBtn) musicBtn.classList.add('playing');
        if (musicIcon) musicIcon.textContent = '🎶';
    } else {
        music.pause();
        if (musicBtn) musicBtn.classList.remove('playing');
        if (musicIcon) musicIcon.textContent = '🎵';
    }
}

// ===== 打开初始礼物盒 =====
function openGift() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const celebrationScreen = document.getElementById('celebration-screen');

    welcomeScreen.classList.remove('active');

    setTimeout(() => {
        celebrationScreen.classList.add('active');

        startClock();
        launchConfetti(80);
        setTimeout(() => launchFireworksBurst(3), 300);
        startBalloons();
        playMusic();

        setInterval(() => {
            if (celebrationScreen.classList.contains('active')) {
                launchFireworksBurst(1);
            }
        }, 3000);

        setInterval(() => {
            if (celebrationScreen.classList.contains('active')) {
                launchConfetti(15);
            }
        }, 2000);
    }, 500);
}

// ===== 点击蛋糕 - 弹出第二个礼物盒 =====
function openCakeGift() {
    const giftOverlay = document.getElementById('gift-overlay');
    if (giftOverlay && !giftOverlay.classList.contains('active')) {
        giftOverlay.classList.add('active');
        launchConfetti(40);
        setTimeout(() => launchFireworksBurst(2), 300);
    }
}

// ===== 打开第二个礼物盒 - 弹出对应卡片弹窗 =====
function openGift2() {
    const giftBox2 = document.getElementById('gift-box-2');
    const giftOverlay = document.getElementById('gift-overlay');
    const cardModal = document.getElementById('card-modal');

    if (giftBox2 && !giftBox2.classList.contains('opening')) {
        giftBox2.classList.add('opening');

        launchConfetti(60);
        setTimeout(() => launchFireworksBurst(3), 200);

        setTimeout(() => {
            if (giftOverlay) {
                giftOverlay.classList.remove('active');
            }
            // 重置卡片计数器，从第一个开始
            cardIndex = 1;
            showCard(cardIndex);
            if (cardModal) {
                cardModal.classList.add('active');
            }
            setTimeout(() => {
                if (giftBox2) {
                    giftBox2.classList.remove('opening');
                }
            }, 800);
        }, 1000);
    }
}

// ===== 显示指定卡片 =====
function showCard(index) {
    // 先隐藏所有卡片内容
    for (let i = 1; i <= 7; i++) {
        const card = document.getElementById('card-' + i);
        if (card) {
            card.classList.remove('active');
        }
    }
    // 移除所有主题类
    const cardModal = document.getElementById('card-modal');
    if (cardModal) {
        cardModal.classList.remove('theme-1', 'theme-2', 'theme-3', 'theme-4', 'theme-5', 'theme-6', 'theme-7');
        cardModal.classList.add('theme-' + index);
    }
    // 显示当前卡片
    const currentCard = document.getElementById('card-' + index);
    if (currentCard) {
        currentCard.classList.add('active');
    }
    // 根据当前卡片切换按钮符号：最后一张显示✓，其他显示→
    const closeBtn = document.getElementById('card-close-btn');
    if (closeBtn) {
        closeBtn.textContent = (index >= 7) ? '✓' : '→';
    }
}

// ===== 关闭卡片弹窗：如果不是最后一张，则显示下一张；是最后一张才真正关闭 =====
function closeCardModal() {
    const cardModal = document.getElementById('card-modal');
    if (!cardModal) return;

    // 如果当前是第 7 张卡片，关闭弹窗并显示视频
    if (cardIndex >= 7) {
        cardModal.classList.remove('active');
        cardIndex = 1;
        launchConfetti(80);
        setTimeout(() => launchFireworksBurst(3), 200);
        showVideoModal();
    } else {
        // 不是最后一张，先淡出内容再切换到下一张
        cardIndex = cardIndex + 1;
        // 添加淡出动画效果
        const modalContent = cardModal.querySelector('.card-modal-content');
        if (modalContent) {
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8) translateY(30px)';
            modalContent.style.transition = 'all 0.3s ease';
        }
        setTimeout(() => {
            showCard(cardIndex);
            // 重新触发弹窗内容的进入动画
            if (modalContent) {
                setTimeout(() => {
                    modalContent.style.opacity = '1';
                    modalContent.style.transform = 'scale(1) translateY(0)';
                }, 50);
            }
            launchConfetti(30);
        }, 300);
    }
}

// ===== 视频弹窗控制 =====
function showVideoModal() {
    const videoModal = document.getElementById('video-modal');
    const birthdayVideo = document.getElementById('birthday-video');
    const bgMusic = document.getElementById('bg-music');

    if (videoModal) {
        videoModal.classList.add('active');
    }

    if (bgMusic && !bgMusic.paused) {
        bgMusic.pause();
    }

    if (birthdayVideo) {
        birthdayVideo.currentTime = 0;
        const playPromise = birthdayVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                birthdayVideo.muted = true;
                birthdayVideo.play();
            });
        }
    }
}

function closeVideoModal() {
    const videoModal = document.getElementById('video-modal');
    const birthdayVideo = document.getElementById('birthday-video');
    const bgMusic = document.getElementById('bg-music');

    if (videoModal) {
        videoModal.classList.remove('active');
    }

    if (birthdayVideo) {
        birthdayVideo.pause();
    }

    if (bgMusic) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }
    }
}

// ===== 天数计数器（从2000年7月7日到今天） =====
function startClock() {
    updateDaysCount();
    // 每分钟更新一次，确保跨天时也能刷新
    setInterval(updateDaysCount, 60000);
}

function updateDaysCount() {
    const birthDate = new Date(2000, 6, 7);  // 月份从0开始，6代表7月
    const now = new Date();

    // 计算天数差（考虑时区，使用 UTC 避免夏令时误差）
    const birthUTC = Date.UTC(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const daysPassed = Math.floor((nowUTC - birthUTC) / (1000 * 60 * 60 * 24));

    const daysCountEl = document.getElementById('days-count');
    if (daysCountEl) {
        daysCountEl.textContent = daysPassed.toLocaleString();
    }

    const dateDisplayEl = document.getElementById('date-display');
    if (dateDisplayEl) {
        dateDisplayEl.textContent = `从 2000 年 7 月 7 日 来此世间 已经历`;
    }
}

// ===== 彩带功能 =====
function launchConfetti(count) {
    const container = document.getElementById('confetti-container');
    const colors = ['#ff6b9d', '#ffd54f', '#4fc3f7', '#81c784', '#ba68c8', '#ff8a65', '#f06292', '#fff176'];
    const shapes = ['rect', 'circle', 'triangle'];

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';

            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const drift = (Math.random() - 0.5) * 300;
            const duration = 3 + Math.random() * 3;
            const left = Math.random() * 100;

            confetti.style.left = left + '%';
            confetti.style.top = '-20px';
            confetti.style.setProperty('--drift', drift + 'px');
            confetti.style.animationDuration = duration + 's';

            if (shape === 'rect') {
                confetti.style.width = (8 + Math.random() * 8) + 'px';
                confetti.style.height = (12 + Math.random() * 12) + 'px';
                confetti.style.background = color;
                confetti.style.borderRadius = '2px';
            } else if (shape === 'circle') {
                const size = 8 + Math.random() * 8;
                confetti.style.width = size + 'px';
                confetti.style.height = size + 'px';
                confetti.style.background = color;
                confetti.style.borderRadius = '50%';
            } else {
                confetti.style.width = '0';
                confetti.style.height = '0';
                confetti.style.background = 'transparent';
                confetti.style.borderLeft = '8px solid transparent';
                confetti.style.borderRight = '8px solid transparent';
                confetti.style.borderBottom = `14px solid ${color}`;
            }

            container.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, duration * 1000);
        }, i * 30);
    }
}

// ===== 气球功能 =====
function startBalloons() {
    const colors = [
        'radial-gradient(circle at 30% 30%, #ff9a9e, #e91e63)',
        'radial-gradient(circle at 30% 30%, #a1c4fd, #1976d2)',
        'radial-gradient(circle at 30% 30%, #ffecd2, #ff9800)',
        'radial-gradient(circle at 30% 30%, #fcb69f, #e64a19)',
        'radial-gradient(circle at 30% 30%, #d4a5ff, #7b1fa2)',
        'radial-gradient(circle at 30% 30%, #a8e6cf, #388e3c)',
        'radial-gradient(circle at 30% 30%, #ffdde1, #c2185b)',
        'radial-gradient(circle at 30% 30%, #fff9c4, #f57f17)'
    ];

    function createBalloon() {
        const container = document.getElementById('balloon-container');
        const balloon = document.createElement('div');
        balloon.className = 'balloon';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = 8 + Math.random() * 6;
        const left = Math.random() * 95;
        const sway = (Math.random() - 0.5) * 200;
        const delay = Math.random() * 2;

        balloon.style.background = color;
        balloon.style.left = left + '%';
        balloon.style.setProperty('--sway', sway + 'px');
        balloon.style.animationDuration = duration + 's';
        balloon.style.animationDelay = delay + 's';

        container.appendChild(balloon);

        setTimeout(() => {
            balloon.remove();
        }, (duration + delay) * 1000);
    }

    for (let i = 0; i < 5; i++) {
        setTimeout(createBalloon, i * 500);
    }

    setInterval(createBalloon, 1500);
}

// ===== 烟花功能 =====
let fireworkCanvas, fireworkCtx;
let fireworkParticles = [];

function initFireworks() {
    fireworkCanvas = document.getElementById('fireworks-canvas');
    fireworkCtx = fireworkCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animateFireworks();
}

function resizeCanvas() {
    fireworkCanvas.width = window.innerWidth;
    fireworkCanvas.height = window.innerHeight;
}

class Particle {
    constructor(x, y, color, angle, speed) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
        this.decay = 0.008 + Math.random() * 0.015;
        this.gravity = 0.08;
        this.size = 2 + Math.random() * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
}

class Rocket {
    constructor(targetX, targetY) {
        this.x = Math.random() * fireworkCanvas.width;
        this.y = fireworkCanvas.height;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = `hsl(${Math.random() * 60 + 300}, 100%, 70%)`;
        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        this.vx = Math.cos(angle) * 8;
        this.vy = Math.sin(angle) * 8;
        this.exploded = false;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.y <= this.targetY || Math.abs(this.vy) < 0.5) {
            this.exploded = true;
            this.explode();
        }
    }

    explode() {
        const colors = [
            '#ff6b9d', '#ffd54f', '#4fc3f7', '#81c784',
            '#ba68c8', '#ff8a65', '#f06292', '#fff176',
            '#ff4081', '#ffeb3b', '#00e5ff', '#e040fb'
        ];
        const particleCount = 60 + Math.floor(Math.random() * 40);
        const explodeColor = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 / particleCount) * i + Math.random() * 0.3;
            const speed = 2 + Math.random() * 5;
            const color = Math.random() > 0.5 ? explodeColor : colors[Math.floor(Math.random() * colors.length)];
            fireworkParticles.push(new Particle(this.x, this.y, color, angle, speed));
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

let rockets = [];

function launchFireworksBurst(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const targetX = fireworkCanvas.width * (0.2 + Math.random() * 0.6);
            const targetY = fireworkCanvas.height * (0.1 + Math.random() * 0.3);
            rockets.push(new Rocket(targetX, targetY));
        }, i * 200);
    }
}

function animateFireworks() {
    fireworkCtx.clearRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);

    for (let i = rockets.length - 1; i >= 0; i--) {
        rockets[i].update();
        rockets[i].draw(fireworkCtx);
        if (rockets[i].exploded) {
            rockets.splice(i, 1);
        }
    }

    for (let i = fireworkParticles.length - 1; i >= 0; i--) {
        fireworkParticles[i].update();
        fireworkParticles[i].draw(fireworkCtx);
        if (fireworkParticles[i].life <= 0) {
            fireworkParticles.splice(i, 1);
        }
    }

    requestAnimationFrame(animateFireworks);
}
