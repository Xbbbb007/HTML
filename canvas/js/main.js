const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#28a92b';


let position = {x : 0, y : 0};
function draw() {
    ctx.clearRect(0,0,300,300);
    ctx.fillRect(position.x, position.y, 100, 100);
}

gsap.to(position, {x: 200, y: 200, duration: 2, onUpdate: draw});