document.querySelectorAll('.info-cta').forEach(button => {
    button.addEventListener('click', function() {
        const artGridItem = this.closest('.art-grid-item');
        artGridItem.classList.toggle('show-info');
    });
});

document.querySelector('.art-info-overlay').addEventListener('click', function() {
    const artGridItem = document.querySelector('.art-grid-item.show-info');
    if (artGridItem) {
        artGridItem.classList.remove('show-info');
        document.querySelector('.info-cta').textContent = 'More Info';
        this.style.display = 'none';
    }
});