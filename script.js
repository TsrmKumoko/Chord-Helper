// 创建合成器
const synth = new Tone.Synth().toDestination();

// 获取所有键
const keys = document.querySelectorAll('.key');

// 键盘映射
const keyMap = {
    'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
    'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4',
    'u': 'A#4', 'j': 'B4'
};

// 添加鼠标事件
keys.forEach(key => {
    key.addEventListener('mousedown', () => {
        const note = key.dataset.note;
        synth.triggerAttack(note);
        key.classList.add('active');
    });

    key.addEventListener('mouseup', () => {
        synth.triggerRelease();
        key.classList.remove('active');
    });

    key.addEventListener('mouseleave', () => {
        synth.triggerRelease();
        key.classList.remove('active');
    });
});

// 添加键盘事件
document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const note = keyMap[e.key.toLowerCase()];
    if (note) {
        const key = document.querySelector(`[data-note="${note}"]`);
        key.classList.add('active');
        synth.triggerAttack(note);
    }
});

document.addEventListener('keyup', (e) => {
    const note = keyMap[e.key.toLowerCase()];
    if (note) {
        const key = document.querySelector(`[data-note="${note}"]`);
        key.classList.remove('active');
        synth.triggerRelease();
    }
});