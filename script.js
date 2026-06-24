// ========================================
// ОСНОВНЫЕ ПЕРЕМЕННЫЕ
// ========================================

const weddingDate = new Date('2026-07-11T16:00:00').getTime();
const uploadStartDate = new Date('2026-07-11T00:00:00').getTime();
const uploadEndDate = new Date('2026-07-13T23:59:59').getTime();

// Telegram конфигурация
const TELEGRAM_BOT_TOKEN = '8903769374:AAEMy7lNEsgo9tgSqE4HeIYWsgI6NpFvezs';
const TELEGRAM_CHAT_IDS = ['8763738634', '7247251532', '7192587912']; // Три получателя

let uploadedPhotos = [];

// ========================================
// ИНИЦИАЛИЗАЦИЯ
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeInvitation();
    initializeMusic();
    initializeCountdown();
    initializeScrollButtons();
    initializePhotoUpload();
    initializeMap();
    checkUploadStatus();
    
    // Проверяем статус загрузки каждую минуту
    setInterval(checkUploadStatus, 60000);
});

// ========================================
// ПРИГЛАШЕНИЕ
// ========================================

function initializeInvitation() {
    const invitationModal = document.getElementById('invitationModal');
    const closeInvitationBtn = document.getElementById('closeInvitationBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const backgroundMusic = document.getElementById('backgroundMusic');

    // Функция для закрытия модального окна и включения музыки
    function closeInvitation() {
        invitationModal.classList.add('hidden');
        
        // Перезагружаем музыку с начала
        backgroundMusic.currentTime = 0;
        
        // Включаем музыку с полным звуком
        backgroundMusic.muted = false;
        attemptToPlayMusic(backgroundMusic);
        
        // Помечаем, что музыка была запущена
        window.musicStarted = true;
    }

    // Функция для закрытия приглашения БЕЗ музыки
    function closeModalWithoutMusic() {
        invitationModal.classList.add('hidden');
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        window.musicStarted = false;
    }

    // Обработчик для кнопки "Посмотреть приглашение"
    closeInvitationBtn.addEventListener('click', closeInvitation);

    // Обработчик для кнопки закрытия X
    closeModalBtn.addEventListener('click', closeModalWithoutMusic);

    // Закрытие при клике на фон (вне карточки) - выключает музыку
    invitationModal.addEventListener('click', function(e) {
        if (e.target === invitationModal) {
            closeModalWithoutMusic();
        }
    });

    // Закрытие при нажатии Escape - выключает музыку
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !invitationModal.classList.contains('hidden')) {
            closeModalWithoutMusic();
        }
    });
}

// ========================================
// МУЗЫКА
// ========================================

function initializeMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    
    // Установленная громкость
    backgroundMusic.volume = 0.2;
    
    // Музыка автоматически включается
    let isMusicEnabled = true;
    
    musicToggle.classList.add('active');
    
    // Попытка запустить музыку при загрузке (с muted для autoplay)
    attemptToPlayMusic(backgroundMusic);
    
    // Запуск музыки при первом клике или касании
    function startMusicOnFirstInteraction() {
        if (!window.musicStarted) {
            // Убираем muted для включения звука после первого взаимодействия
            backgroundMusic.muted = false;
            attemptToPlayMusic(backgroundMusic);
            window.musicStarted = true;
        }
    }
    
    // Слушатели для первого взаимодействия
    document.addEventListener('click', startMusicOnFirstInteraction, { once: true });
    document.addEventListener('touchstart', startMusicOnFirstInteraction, { once: true });
    
    // Слушатель для кнопки Toggle
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.muted = false;  // Убираем mute при включении
            attemptToPlayMusic(backgroundMusic);
            musicToggle.classList.add('active');
            isMusicEnabled = true;
            window.musicStarted = true;
        } else {
            backgroundMusic.pause();
            musicToggle.classList.remove('active');
            isMusicEnabled = false;
        }
    });
    
    // Пауза при потере фокуса (свернули сайт)
    window.addEventListener('blur', function() {
        if (!backgroundMusic.paused) {
            backgroundMusic.pause();
        }
    });
    
    // Возобновление при получении фокуса (развернули сайт)
    window.addEventListener('focus', function() {
        if (isMusicEnabled && backgroundMusic.paused && window.musicStarted) {
            backgroundMusic.muted = false;
            attemptToPlayMusic(backgroundMusic);
        }
    });
    
    // Попытка возобновления при взаимодействии
    document.addEventListener('click', function() {
        if (isMusicEnabled && backgroundMusic.paused && window.musicStarted) {
            backgroundMusic.muted = false;
            attemptToPlayMusic(backgroundMusic);
        }
    });
}

function attemptToPlayMusic(audio) {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Ошибка автовоспроизведения:', error);
        });
    }
}

// ========================================
// ОБРАТНЫЙ ОТСЧЁТ
// ========================================

function initializeCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    if (distance < 0) {
        // Свадьба уже прошла
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Заполняем нулями для красоты
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// ========================================
// ПРОКРУТКА
// ========================================

function initializeScrollButtons() {
    const detailsBtn = document.getElementById('detailsBtn');
    const dateBtn = document.getElementById('dateBtn');
    const routeBtn = document.getElementById('routeBtn');
    
    if (detailsBtn) {
        detailsBtn.addEventListener('click', () => {
            smoothScroll('countdownSection');
        });
    }
    
    if (dateBtn) {
        dateBtn.addEventListener('click', () => {
            smoothScroll('detailsSection');
        });
    }
    
    if (routeBtn) {
        routeBtn.addEventListener('click', () => {
            openYandexMaps();
        });
    }
}

function smoothScroll(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ========================================
// ЯНДЕКС КАРТЫ
// ========================================

function initializeMap() {
    if (typeof ymaps === 'undefined') {
        console.log('Яндекс.Карты не загружены');
        return;
    }
    
    ymaps.ready(() => {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;
        
        const coords = [55.575607, 37.656703];
        
        const myMap = new ymaps.Map('map', {
            center: coords,
            zoom: 16,
            controls: ['zoomControl', 'geolocationControl']
        });
        
        const placemark = new ymaps.Placemark(
            coords,
            {
                balloonContent: '<strong style="font-size: 16px;">Место проведения свадьбы</strong><br><br>Москва<br>Востряковский проезд, 23к2'
            },
            {
                preset: 'islands#icon',
                iconColor: '#d4af37'
            }
        );
        
        myMap.geoObjects.add(placemark);
    });
}

function openYandexMaps() {
    // Координаты: 55.675, 37.605
    const url = 'https://yandex.ru/maps/-/CTEaAAny';
    window.open(url, '_blank');
}

// ========================================
// ЗАГРУЗКА ФОТОГРАФИЙ
// ========================================

function checkUploadStatus() {
    const uploadForm = document.getElementById('uploadForm');
    const beforeMessage = document.getElementById('beforeMessage');
    const afterMessage = document.getElementById('afterMessage');
    
    // Загрузка всегда доступна
    if (uploadForm) uploadForm.style.display = 'block';
    if (beforeMessage) beforeMessage.style.display = 'none';
    if (afterMessage) afterMessage.style.display = 'none';
}

function initializePhotoUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const photoInput = document.getElementById('photoInput');
    const previewGallery = document.getElementById('previewGallery');
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    if (!uploadArea || !photoInput) return;
    
    // Клик на область загрузки
    uploadArea.addEventListener('click', () => {
        // Убедимся, что музыка продолжает играть
        if (!backgroundMusic.paused && window.musicStarted) {
            attemptToPlayMusic(backgroundMusic);
        }
        photoInput.click();
    });
    
    // Выбор файлов через инпут
    photoInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        // Убедимся, что музыка продолжает играть
        if (!backgroundMusic.paused && window.musicStarted) {
            attemptToPlayMusic(backgroundMusic);
        }
    });
    
    // Drag & drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(212, 175, 55, 0.15)';
        uploadArea.style.borderColor = '#c99a1e';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = 'rgba(212, 175, 55, 0.05)';
        uploadArea.style.borderColor = '#d4af37';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(212, 175, 55, 0.05)';
        uploadArea.style.borderColor = '#d4af37';
        handleFiles(e.dataTransfer.files);
        // Убедимся, что музыка продолжает играть
        if (!backgroundMusic.paused && window.musicStarted) {
            attemptToPlayMusic(backgroundMusic);
        }
    });
    
    // Кнопка отправки фотографий
    const submitBtn = document.getElementById('submitPhotosBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitPhotos);
    }
}

function handleFiles(files) {
    const previewGallery = document.getElementById('previewGallery');
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    for (let file of files) {
        if (!file.type.startsWith('image/')) continue;
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            // Убедимся, что музыка продолжает играть
            if (!backgroundMusic.paused && window.musicStarted) {
                attemptToPlayMusic(backgroundMusic);
            }
            
            const photoId = Date.now() + Math.random();
            
            uploadedPhotos.push({
                id: photoId,
                src: e.target.result
            });
            
            // Создаем элемент предпросмотра
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Photo">
                <button class="remove" data-id="${photoId}">×</button>
            `;
            
            previewGallery.appendChild(previewItem);
            
            // Удаление фото
            previewItem.querySelector('.remove').addEventListener('click', () => {
                uploadedPhotos = uploadedPhotos.filter(p => p.id !== photoId);
                previewItem.remove();
            });
        };
        
        reader.readAsDataURL(file);
    }
}

// ========================================
// ОТПРАВКА ФОТОГРАФИЙ
// ========================================

async function submitPhotos() {
    if (uploadedPhotos.length === 0) {
        alert('Пожалуйста, загрузите хотя бы одну фотографию');
        return;
    }
    
    const submitBtn = document.getElementById('submitPhotosBtn');
    const originalText = submitBtn.innerHTML;
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span><span>Отправляю...</span>';
    
    // Убедимся, что музыка продолжает играть
    const wasMusicPlaying = !backgroundMusic.paused;
    
    try {
        // Отправляем фотографии каждому получателю
        for (const chatId of TELEGRAM_CHAT_IDS) {
            // Убедимся, что музыка всё ещё играет во время отправки
            if (wasMusicPlaying && backgroundMusic.paused) {
                backgroundMusic.muted = false;
                attemptToPlayMusic(backgroundMusic);
            }
            
            // Информационное сообщение
            const message = `📸 Новые фотографии со свадьбы!\n\n` +
                           `Загружено фотографий: ${uploadedPhotos.length}\n` +
                           `Время: ${new Date().toLocaleString('ru-RU')}`;
            
            const messageUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            
            await fetch(messageUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message
                })
            });
            
            // Отправляем каждую фотографию
            const photoUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
            
            for (let i = 0; i < uploadedPhotos.length; i++) {
                // Убедимся, что музыка всё ещё играет
                if (wasMusicPlaying && backgroundMusic.paused) {
                    backgroundMusic.muted = false;
                    attemptToPlayMusic(backgroundMusic);
                }
                
                // Преобразуем Base64 в Blob
                const response = await fetch(uploadedPhotos[i].src);
                const blob = await response.blob();
                
                // Создаем FormData
                const formData = new FormData();
                formData.append('chat_id', chatId);
                formData.append('photo', blob, `photo_${i + 1}.jpg`);
                formData.append('caption', `Фото ${i + 1} из ${uploadedPhotos.length}`);
                
                // Отправляем фото
                await fetch(photoUrl, {
                    method: 'POST',
                    body: formData
                });
                
                // Задержка между отправками
                await new Promise(resolve => setTimeout(resolve, 400));
            }
        }
        
        // Убедимся, что музыка играет после отправки
        if (wasMusicPlaying && backgroundMusic.paused) {
            backgroundMusic.muted = false;
            attemptToPlayMusic(backgroundMusic);
        }
        
        alert('✅ Спасибо! Все фотографии отправлены обоим получателям в Telegram!');
        uploadedPhotos = [];
        document.getElementById('previewGallery').innerHTML = '';
        
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Ошибка при отправке фотографий.\n\nПроверьте интернет и попробуйте ещё раз.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Убедимся, что музыка продолжает играть
        if (wasMusicPlaying && backgroundMusic.paused) {
            backgroundMusic.muted = false;
            attemptToPlayMusic(backgroundMusic);
        }
    }
}

// ========================================
// УТИЛИТЫ
// ========================================

// Форматирование дат для отображения
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}
