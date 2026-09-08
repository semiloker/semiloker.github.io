/* Keeps the age on the about page current. */

function updateAge() {
    const el = document.querySelector('.age');
    if (!el) return;

    const birth = new Date(2007, 2, 1);   /* local, so the date never slips */
    const now = new Date();

    let age = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
        age--;
    }

    el.textContent = age;
}

document.addEventListener('DOMContentLoaded', updateAge);
