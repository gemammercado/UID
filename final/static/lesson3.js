const blueCircle = document.getElementById('hover-blue');
const orangeCircle = document.getElementById('hover-orange');
const blueImage = document.querySelector('.hover-blue');
const orangeImage = document.querySelector('.hover-orange');

blueCircle.addEventListener('mouseenter', () => {
    blueImage.style.display = 'block';
});
blueCircle.addEventListener('mouseleave', () => {
    blueImage.style.display = 'none';
});

orangeCircle.addEventListener('mouseenter', () => {
    orangeImage.style.display = 'block';
});
orangeCircle.addEventListener('mouseleave', () => {
    orangeImage.style.display = 'none';
});