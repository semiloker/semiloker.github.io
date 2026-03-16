function updateLineNumbers() {
    const container = document.querySelector('.line-numbers');
    const bodyHeight = document.body.scrollHeight;
    const lineHeight = 19.2;

    const linesCount = Math.ceil(bodyHeight / lineHeight);

    let linesHTML = '';
    for (let i = 1; i <= linesCount; i++) {
        linesHTML += i + '<br>';
    }

    container.innerHTML = linesHTML;
}

window.addEventListener('load', updateLineNumbers);
window.addEventListener('resize', updateLineNumbers);
