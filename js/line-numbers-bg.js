// Set line-numbers-bg height to match page content height
function updateLineNumbersBg() {
    const bg = document.querySelector('.line-numbers-bg');
    if (bg) {
        const bodyHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        bg.style.height = (bodyHeight - 21) + 'px';
    }
}

document.addEventListener('DOMContentLoaded', updateLineNumbersBg);
window.addEventListener('load', updateLineNumbersBg);
