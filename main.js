document.addEventListener("DOMContentLoaded", function () {
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