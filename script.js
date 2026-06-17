// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initFireworks();
    bindEvents();
});

// ===== 事件绑定 =====
function bindEvents() {
    const giftBox = document.getElementById('gift-box');
    if (giftBox) {
        giftBox.addEventListener('click', openGift);
    }
}

// ===== 打开礼物盒 =====
function openGift() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const celebrationScreen = document.getElementById('celebration-screen');
    
    welcomeScreen.classList.remove('active');
    
    setTimeout(() => {
        celebrationScreen.classList.add('active');
        
        // 启动时间显示
        startClock();
        
        // 启动彩带
        launchConfetti(80);
        
        // 启动烟花
        setTimeout(() => launchFireworksBurst(3), 300);
        
        // 启动气球
        startBalloons();
        
        // 持续放烟花
        setInterval(() => {
            if (celebrationScreen.classList.contains('active')) {
                launchFireworksBurst(1);
            }
        }, 3000);
        
        // 持续撒彩带
        setInterval(() => {
            if (celebrationScreen.classList.contains('active')) {
                launchConfetti(15);
            }
        }, 2000);
    }, 500);
}

// ===== 时钟功能 =====
function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekDay = weekDays[now.getDay()];
    
    document.getElementById('date-display').textContent = 
        `${year}年${month}月${day}日 ${weekDay}`;
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
    
    // 持续生成气球
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
    
    // 初始放几个
    for (let i = 0; i < 5; i++) {
        setTimeout(createBalloon, i * 500);
    }
    
    // 持续生成
    setInterval(createBalloon, 1500);
}

// ===== 烟花功能 =====
let fireworkCanvas, fireworkCtx;
let fireworkParticles = [];
let fireworkAnimationId = null;

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
    constructor(x, y, color, angle, speed, type = 'spark') {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
        this.decay = 0.008 + Math.random() * 0.015;
        this.gravity = 0.08;
        this.size = type === 'rocket' ? 3 : 2 + Math.random() * 2;
        this.type = type;
        this.trail = [];
    }
    
    update() {
        this.trail.push({ x: this.x, y: this.y, life: this.life });
        if (this.trail.length > 8) this.trail.shift();
        
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.life -= this.decay;
    }
    
    draw(ctx) {
        for (let i = 0; i < this.trail.length; i++) {
            const t = this.trail[i];
            ctx.beginPath();
            ctx.globalAlpha = (i / this.trail.length) * this.life * 0.5;
            ctx.fillStyle = this.color;
            ctx.arc(t.x, t.y, this.size * (i / this.trail.length), 0, Math.PI * 2);
            ctx.fill();
        }
        
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
        this.trail = [];
    }
    
    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 15) this.trail.shift();
        
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
        for (let i = 0; i < this.trail.length; i++) {
            const t = this.trail[i];
            ctx.beginPath();
            ctx.globalAlpha = (i / this.trail.length) * 0.8;
            ctx.fillStyle = this.color;
            ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
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
    
    fireworkAnimationId = requestAnimationFrame(animateFireworks);
}

// ===== 音乐功能 (Web Audio API 生日快乐歌) =====
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

function playNote(frequency, startTime, duration, volume = 0.3) {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, startTime);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05);
    gainNode.gain.setValueAtTime(volume, startTime + duration - 0.1);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

function playHappyBirthday() {
    initAudio();
    
    // 清除之前的定时器
    musicTimeoutIds.forEach(id => clearTimeout(id));
    musicTimeoutIds = [];
    
    // 音符频率 (Hz)
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00,
          A4 = 440.00, Bb4 = 466.16, C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46;
    
    // 生日快乐歌的音符
    const notes = [
        { note: C4, duration: 0.375 }, { note: C4, duration: 0.125 },
        { note: D4, duration: 0.5 }, { note: C4, duration: 0.5 },
        { note: F4, duration: 0.5 }, { note: E4, duration: 1.0 },
        
        { note: C4, duration: 0.375 }, { note: C4, duration: 0.125 },
        { note: D4, duration: 0.5 }, { note: C4, duration: 0.5 },
        { note: G4, duration: 0.5 }, { note: F4, duration: 1.0 },
        
        { note: C4, duration: 0.375 }, { note: C4, duration: 0.125 },
        { note: C5, duration: 0.5 }, { note: A4, duration: 0.5 },
        { note: F4, duration: 0.5 }, { note: E4, duration: 0.5 },
        { note: D4, duration: 1.0 },
        
        { note: Bb4, duration: 0.375 }, { note: Bb4, duration: 0.125 },
        { note: A4, duration: 0.5 }, { note: F4, duration: 0.5 },
        { note: G4, duration: 0.5 }, { note: F4, duration: 1.0 }
    ];
    
    const tempo = 0.5; // 基础节拍时长（秒）
    let currentTime = audioContext.currentTime + 0.1;
    
    notes.forEach((item) => {
        const duration = item.duration * tempo * 1.5;
        playNote(item.note, currentTime, duration * 0.9, 0.25);
        currentTime += duration;
    });
    
    // 循环播放
    const totalDuration = currentTime - audioContext.currentTime + 1;
    const timeoutId = setTimeout(() => {
        if (musicPlaying) {
            playHappyBirthday();
        }
    }, totalDuration * 1000);
    musicTimeoutIds.push(timeoutId);
}

function stopMusic() {
    musicPlaying = false;
    musicTimeoutIds.forEach(id => clearTimeout(id));
    musicTimeoutIds = [];
    if (audioContext) {
        // 逐渐停止
        const now = audioContext.currentTime;
        // 简单的方式：关闭所有连接
    }
}

function toggleMusic() {
    const musicText = document.getElementById('music-text');
    if (musicPlaying) {
        stopMusic();
        musicText.textContent = '播放音乐';
    } else {
        musicPlaying = true;
        playHappyBirthday();
        musicText.textContent = '暂停音乐';
    }
}
