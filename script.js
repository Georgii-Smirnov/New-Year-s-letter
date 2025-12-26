(function() {
    const canvas = document.getElementById('snowflakes');
    const ctx = canvas.getContext('2d');
    
    // Устанавливаем размер canvas на весь экран
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Класс для снежинки
    class Snowflake {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 4 + 2;
            this.speed = Math.random() * 0.8 + 0.3;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.swing = Math.random() * 0.3 + 0.1;
            this.swingSpeed = Math.random() * 0.01 + 0.005;
            this.swingOffset = Math.random() * Math.PI * 2;
        }
        
        update() {
            this.y += this.speed;
            this.x += Math.sin(this.y * this.swingSpeed + this.swingOffset) * this.swing;
            
            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
            
            if (this.x < -10) {
                this.x = canvas.width + 10;
            }
            if (this.x > canvas.width + 10) {
                this.x = -10;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
            
            // Рисуем дополнительные детали для более красивой снежинки
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.size);
            ctx.lineTo(this.x, this.y + this.size);
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.6})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.x - this.size, this.y);
            ctx.lineTo(this.x + this.size, this.y);
            ctx.stroke();
        }
    }
    
    // Создаем массив снежинок
    const snowflakes = [];
    const snowflakeCount = 100;
    
    for (let i = 0; i < snowflakeCount; i++) {
        snowflakes.push(new Snowflake());
    }
    
    // Анимация
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        snowflakes.forEach(snowflake => {
            snowflake.update();
            snowflake.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
})();

// Управление плеером
(function() {
    const audioPlayer = document.getElementById('audioPlayer');
    const playButton = document.getElementById('playButton');
    const playIcon = playButton.querySelector('.player__icon--play');
    const pauseIcon = playButton.querySelector('.player__icon--pause');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    
    let isPlaying = false;
    
    // Форматирование времени
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Обновление времени
    function updateTime() {
        if (audioPlayer.duration) {
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressFill.style.width = progress + '%';
        }
    }
    
    // Загрузка метаданных
    audioPlayer.addEventListener('loadedmetadata', function() {
        totalTimeEl.textContent = formatTime(audioPlayer.duration);
    });
    
    // Обновление времени при воспроизведении
    audioPlayer.addEventListener('timeupdate', updateTime);
    
    // Переключение play/pause
    playButton.addEventListener('click', function() {
        if (isPlaying) {
            audioPlayer.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            isPlaying = false;
        } else {
            audioPlayer.play().catch(function(error) {
                console.log('Ошибка воспроизведения:', error);
                alert('Не удалось воспроизвести аудио. Убедитесь, что файл last-christmas.mp3 находится в папке проекта.');
            });
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            isPlaying = true;
        }
    });
    
    // Обработка окончания трека
    audioPlayer.addEventListener('ended', function() {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        isPlaying = false;
        progressFill.style.width = '0%';
        currentTimeEl.textContent = '0:00';
    });
    
    // Клик по прогресс-бару для перемотки
    progressBar.addEventListener('click', function(e) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
    });
    
    // Обновление времени при загрузке
    audioPlayer.addEventListener('loadeddata', function() {
        updateTime();
    });
})();


