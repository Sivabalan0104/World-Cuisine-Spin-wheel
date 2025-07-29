document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spinBtn');
    const resultDiv = document.getElementById('result');
    const cuisineInput = document.getElementById('cuisineInput');
    const addBtn = document.getElementById('addBtn');
    const cuisineListUl = document.getElementById('cuisineList');

    // Default cuisine options with emojis
    let cuisines = ['Italian 🍝', 'Mexican 🌮', 'Chinese 🥡', 'Indian 🍛', 'Japanese 🍣', 'Thai 🍜', 'Greek 🇬🇷', 'French 🥐'];
    const colors = ['#FADBD8', '#D5F5E3', '#FCF3CF', '#D6EAF8', '#FDEDEC', '#E8DAEF', '#D1F2EB', '#FDEBD0'];
    
    let currentRotation = 0;
    let isSpinning = false;

    const drawWheel = () => {
        const numOptions = cuisines.length;
        if (numOptions === 0) return;
        
        const arcSize = (2 * Math.PI) / numOptions;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2 - 20;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 18px Arial';

        cuisines.forEach((cuisine, i) => {
            const angle = i * arcSize;
            
            ctx.beginPath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
            ctx.closePath();
            ctx.fill();

            ctx.save();
            ctx.fillStyle = '#333';
            ctx.translate(centerX, centerY);
            ctx.rotate(angle + arcSize / 2);
            ctx.textAlign = 'right';
            ctx.fillText(cuisine, radius - 15, 10);
            ctx.restore();
        });
        updateCuisineList();
    };

    const updateCuisineList = () => {
        cuisineListUl.innerHTML = '';
        cuisines.forEach(cuisine => {
            const li = document.createElement('li');
            li.textContent = cuisine;
            cuisineListUl.appendChild(li);
        });
    };

    const spin = () => {
        if (isSpinning) return;
        if (cuisines.length < 2) {
            alert("Please add at least two cuisine options to spin the wheel!");
            return;
        }

        isSpinning = true;
        spinBtn.disabled = true;
        resultDiv.textContent = 'Spinning...';

        const randomSpins = Math.floor(Math.random() * 5) + 5;
        const randomStopAngle = Math.random() * 360;
        const totalRotation = (randomSpins * 360) + randomStopAngle;

        currentRotation += totalRotation;
        canvas.style.transform = `rotate(${currentRotation}deg)`;

        setTimeout(() => {
            const numOptions = cuisines.length;
            const arcSizeDegrees = 360 / numOptions;
            const finalAngle = currentRotation % 360;
            const winningAngle = (270 - finalAngle + 360) % 360;
            const winningIndex = Math.floor(winningAngle / arcSizeDegrees);

            resultDiv.textContent = `${cuisines[winningIndex]}`;
            isSpinning = false;
            spinBtn.disabled = false;
        }, 5000); // Must match CSS transition duration
    };

    const addCuisine = () => {
        const newCuisine = cuisineInput.value.trim();
        if (newCuisine) {
            if (cuisines.includes(newCuisine)) {
                alert("This cuisine is already in the list!");
                return;
            }
            cuisines.push(newCuisine);
            cuisineInput.value = '';
            drawWheel();
        }
    };

    spinBtn.addEventListener('click', spin);
    addBtn.addEventListener('click', addCuisine);
    cuisineInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCuisine();
        }
    });

    drawWheel();
});