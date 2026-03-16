function updateAge() {
    const birthDate = new Date('2007-03-01');
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const d = today.getDate() - birthDate.getDate();
    if (m < 0 || (m === 0 && d < 0)) {
        age--;
    }

    const ageElement = Array.from(document.querySelectorAll('.about-pre'))
        .find(el => el.innerHTML.includes('Age'));
    if (ageElement) {
        ageElement.innerHTML = ageElement.innerHTML.replace(/Age\s*:\s*\d+/, `Age         : ${age}`);
    }
}

document.addEventListener('DOMContentLoaded', updateAge);
