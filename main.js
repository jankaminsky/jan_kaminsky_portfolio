document.addEventListener("DOMContentLoaded", function () {
    // ===== LOADER =====
    const artImages = [
        'images/art/SWIRLS.jpg',
        'images/art/TIGER_PAINTING_thumbnail.jpg',
        'images/art/ENJOY_PAINTING_thumbnail.jpg',
        'images/art/TORA_POSTER_thumbnail.png',
        'images/art/ALLIWANTTODOISRELAX_thumbnail.jpg',
        'images/art/UNDERTHEWEATHER_POSTER_thumbnail.jpg',
        'images/art/UNDERTHEWEATHER2_POSTER.jpg',
        'images/art/DR_TOM_START_Cover_Art_FINAL.png',
        'images/art/FAIS_DE_BEAUX_RÊVES.png',
        'images/art/DR_TOM-MultiColor-Logo.png',
    ];

    function initLoader() {
        const loader = document.getElementById('loader');
        const counter = loader.querySelector('.loader-counter');
        const image = loader.querySelector('.loader-image');

        let currentImageIndex = 0;
        let progress = 0;

        // Preload images
        artImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        // Show first image and reveal window
        image.src = artImages[0];
        // Small delay to ensure image loads before reveal
        setTimeout(() => {
            image.classList.add('reveal');
        }, 50);

        // Cycle images rapidly (instant swap, no fade)
        const imageInterval = setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % artImages.length;
            image.src = artImages[currentImageIndex];
        }, 200);

        // Animate counter
        const counterInterval = setInterval(() => {
            progress += Math.random() * 8 + 2;
            if (progress >= 100) {
                progress = 100;
                counter.textContent = '100';
                clearInterval(counterInterval);
                clearInterval(imageInterval);

                // Close window, then fade out loader
                image.classList.remove('reveal');
                image.classList.add('close');
                setTimeout(() => {
                    loader.classList.add('fade-out');
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 600);
                }, 400);
            } else {
                counter.textContent = Math.floor(progress);
            }
        }, 150);
    }

    initLoader();

    // ===== PROGRESS BAR =====
    const progressDot = document.querySelector(".nav_progressdot");
    const progressBar = document.querySelector(".nav_progressbar");

    function debounce(func, wait = 10) {
        let timeout;
        return function (...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function updateProgress() {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollTop / scrollHeight; // 0 (top) to 1 (bottom)

        // Calculate the new position
        const progressBarWidth = progressBar.clientWidth - progressDot.clientWidth - 4; // Adjust for dot size
        const translateX = progressBarWidth * scrollPercentage;

        // Apply transformation
        progressDot.style.transform = `translateX(${translateX}px)`;
    }

    // Debounced update function to avoid conflicts
    const debouncedUpdateProgress = debounce(updateProgress, 10);
    window.addEventListener("scroll", debouncedUpdateProgress);

    // Initialize on load
    updateProgress();

    progressBar.addEventListener("click", function (event) {
        const progressBarWidth = progressBar.clientWidth;
        const clickPosition = event.offsetX; // Position where the user clicked
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Calculate the scroll position based on the click
        const targetScroll = (clickPosition / progressBarWidth) * scrollHeight;

        // Smoothly scroll to the calculated position
        window.scrollTo({
            top: targetScroll,
            behavior: "smooth"
        });
    });

    let isDragging = false;

    progressDot.addEventListener("mousedown", (event) => {
        isDragging = true;
        document.body.style.userSelect = "none"; // Prevent text selection
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        document.body.style.userSelect = ""; // Restore text selection

        // Reattach the scroll event listener after dragging ends
        window.addEventListener("scroll", debouncedUpdateProgress);
    });

    document.addEventListener("mousemove", (event) => {
        if (!isDragging) return;

        const progressBarRect = progressBar.getBoundingClientRect();
        let newX = event.clientX - progressBarRect.left;

        // Ensure the dot stays within bounds
        newX = Math.max(0, Math.min(newX, progressBar.clientWidth - progressDot.clientWidth - 4));

        // Temporarily disable the scroll event listener to avoid conflicts
        window.removeEventListener("scroll", debouncedUpdateProgress);

        // Calculate corresponding scroll position
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = (newX / (progressBar.clientWidth - progressDot.clientWidth)) * scrollHeight;

        // Apply transformation to progress dot
        progressDot.style.transform = `translateX(${newX}px)`;

        // Scroll the page
        window.scrollTo({
            top: scrollPosition,
            behavior: "auto"
        });
    });
});