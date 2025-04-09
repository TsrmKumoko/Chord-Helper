// 创建复音合成器
const synth = new Tone.PolySynth().toDestination();

// 获取所有键
const keys = document.querySelectorAll('.key');
const activeNotesDiv = document.getElementById('active-notes');

// 存储当前显示的音符
const activeNotes = new Set();

// 更新显示的音符
function updateActiveNotes() {
    activeNotesDiv.innerHTML = Array.from(activeNotes)
        .map(note => `<span class="note-tag">${note}</span>`)
        .join('');
}

// 切换音符显示状态
function toggleNote(note) {
    if (activeNotes.has(note)) {
        activeNotes.delete(note);
    } else {
        activeNotes.add(note);
    }
    updateActiveNotes();
}

// 键盘映射
const keyMap = {
    // C3 八度 (Z-M)
    'z': 'C3', 's': 'C#3', 'x': 'D3', 'd': 'D#3', 'c': 'E3',
    'v': 'F3', 'g': 'F#3', 'b': 'G3', 'h': 'G#3', 'n': 'A3',
    'j': 'A#3', 'm': 'B3', ',': 'C4',
    
    // C4 八度 (E-P)
    'e': 'C4', '4': 'C#4', 'r': 'D4', '5': 'D#4', 't': 'E4',
    'y': 'F4', '7': 'F#4', 'u': 'G4', '8': 'G#4', 'i': 'A4',
    '9': 'A#4', 'o': 'B4', 'p': 'C5'
};

// 修改鼠标事件
keys.forEach(key => {
    key.addEventListener('mousedown', () => {
        const note = key.dataset.note;
        synth.triggerAttack(note);
        key.classList.add('active');
        toggleNote(note);  // 保持鼠标点击的切换逻辑
    });

    key.addEventListener('mouseup', () => {
        const note = key.dataset.note;
        synth.triggerRelease([note]);
        key.classList.remove('active');
    });

    key.addEventListener('mouseleave', () => {
        const note = key.dataset.note;
        synth.triggerRelease([note]);
        key.classList.remove('active');
    });
});

// 修改键盘事件
document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const note = keyMap[e.key.toLowerCase()];
    if (note) {
        const key = document.querySelector(`[data-note="${note}"]`);
        key.classList.add('active');
        synth.triggerAttack(note);
        activeNotes.add(note);  // 按下键时直接添加音符
        updateActiveNotes();
    }
});

document.addEventListener('keyup', (e) => {
    const note = keyMap[e.key.toLowerCase()];
    if (note) {
        const key = document.querySelector(`[data-note="${note}"]`);
        key.classList.remove('active');
        synth.triggerRelease([note]);
        activeNotes.delete(note);  // 松开键时直接删除音符
        updateActiveNotes();
    }
});