// ===========================================
// KONSTANTA & INISIALISASI (Tidak berubah)
// ===========================================

const targetElement = document.getElementById('typewriter-text');
const paragraphElement = document.getElementById('sub-greeting');
const bgm = document.getElementById('bgm'); 
const confettiSFX = document.getElementById('confetti-sfx'); 
const surpriseOverlay = document.getElementById('surprise-overlay');
const heartsContainer = document.getElementById('hearts-container'); 

const textToType = "Halo Cinta, Selamat Ulang Tahun yang ke-[Umur]!"; 
let i = 0;
const speed = 70; 
let heartInterval; 


// ===========================================
// FUNGSI ANIMASI HATI MELAYANG (Tidak berubah)
// ===========================================

function createFloatingHeart() {
    if (!heartsContainer) return; 
    // ... (Implementasi fungsi tetap sama) ...
    const heart = document.createElement('span');
    heart.classList.add('floating-heart');
    heart.innerHTML = '❤️'; 
    const startX = Math.random() * window.innerWidth;
    heartsContainer.appendChild(heart);
    heart.style.left = `${startX}px`;
    heart.style.bottom = '-50px'; 
    heart.style.setProperty('--translateX', `${(Math.random() - 0.5) * 300}px`); 
    heart.style.setProperty('--translateY', `-${window.innerHeight + 100}px`); 
    heart.style.setProperty('--scale', `${0.8 + Math.random() * 0.8}`); 
    heart.style.animationDuration = `${7 + Math.random() * 5}s`; 
    heart.style.animationDelay = `${Math.random() * 0.5}s`; 

    heart.addEventListener('animationend', () => {
        heart.remove();
    });
}

function startHeartAnimation() {
    if (surpriseOverlay && surpriseOverlay.style.display !== 'none' && !heartInterval) {
        heartInterval = setInterval(createFloatingHeart, 350); 
    }
}

function stopHeartAnimation() {
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
    if (heartsContainer) {
        heartsContainer.innerHTML = '';
    }
}


// ===========================================
// FUNGSI MESIN KETIK & UTAMA (Tidak berubah)
// ===========================================

function typeWriter() {
    if (i < textToType.length && targetElement) {
        targetElement.innerHTML += textToType.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else if (targetElement) {
        targetElement.style.borderRight = 'none'; 
        if (paragraphElement) {
            paragraphElement.classList.add('visible-text');
        }
    }
}

function revealPage() {
    const mainContent = document.getElementById('main-content');
    
    if (surpriseOverlay) {
        surpriseOverlay.style.display = 'none';
        stopHeartAnimation(); 
    }
    
    if (mainContent) {
        mainContent.classList.remove('hidden');
    }
    
    // 1. Mulai BGM 
    if (bgm) {
        bgm.play().catch(error => { console.log("Autoplay BGM diblokir:", error); });
    }
    
    // 2. MAINKAN SUARA KONFETI (SFX)
    if (confettiSFX) {
        confettiSFX.currentTime = 0; 
        confettiSFX.play().catch(error => { console.log("Autoplay SFX diblokir:", error); });
    }

    // 3. Tembakkan Konfeti Awal
    if (window.confetti) {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }

    // 4. Mulai Efek Mesin Ketik
    if (targetElement) {
        typeWriter(); 
    }
}
window.revealPage = revealPage;


// ===========================================
// EVENT LISTENERS & LIGHTBOX (MODIFIKASI NAVIGASI)
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Inisiasi Animasi Hati ---
    if (surpriseOverlay && surpriseOverlay.style.display !== 'none') {
        startHeartAnimation();
    }
    
    // FUNGSI BARU: Untuk memicu konfeti dan smooth scroll di halaman yang sama
    function triggerConfettiAndScroll(e, targetId) {
        e.preventDefault(); 
        
        if (confettiSFX) { confettiSFX.currentTime = 0; confettiSFX.play(); }
        if (window.confetti) { confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } }); }
        
        // Melakukan smooth scroll ke target ID
        setTimeout(() => { 
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    }

    // NAVIGASI DENGAN KONFETI & SCROLL
    const nextButtonIndex = document.getElementById('to-gallery-btn'); 
    if (nextButtonIndex) {
        nextButtonIndex.addEventListener('click', function(e) { 
            const target = this.getAttribute('href'); 
            triggerConfettiAndScroll(e, target); 
        });
    }
    const nextButtonGallery = document.getElementById('to-ending-btn'); 
    if (nextButtonGallery) {
        nextButtonGallery.addEventListener('click', function(e) { 
            const target = this.getAttribute('href'); 
            triggerConfettiAndScroll(e, target);
        });
    }

    // KEJUTAN AKHIR
    const finalButton = document.getElementById('final-surprise-btn');
    if (finalButton) {
        finalButton.addEventListener('click', function() {
            if (confettiSFX) { confettiSFX.currentTime = 0; confettiSFX.play(); }
            if (window.confetti) { confetti({ particleCount: 250, spread: 360, ticks: 200, gravity: 0.5, origin: { x: 0.5, y: 0.3 } }); }
            alert('🎉'); 
        });
    }


    // ===========================================
    // LOGIKA LIGHTBOX GALERI (POP-UP)
    // ===========================================
    
    const modal = document.getElementById('lightbox-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const closeBtn = document.querySelector('.close-btn');
    const clickablePhotos = document.querySelectorAll('.clickable-photo');

    function closeModal() {
        modal.classList.add('hidden-modal');
        if (bgm && modal.getAttribute('data-bgm-paused') === 'true') {
            bgm.play();
            modal.removeAttribute('data-bgm-paused');
        }
    }

    clickablePhotos.forEach(photoDiv => {
        photoDiv.addEventListener('click', function() {
            const fullImgSrc = this.getAttribute('data-full-img');
            const captionText = this.getAttribute('data-caption');
            modalImage.src = fullImgSrc;
            modalCaption.textContent = captionText;
            modal.classList.remove('hidden-modal');

            if (bgm && !bgm.paused) {
                 bgm.pause();
                 modal.setAttribute('data-bgm-paused', 'true');
            }
        });
    });

    if (closeBtn) { closeBtn.onclick = closeModal; }
    window.onclick = function(event) {
        if (event.target == modal) { closeModal(); }
    }
});