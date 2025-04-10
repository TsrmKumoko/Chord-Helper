// 创建复音合成器
const synth = new Tone.PolySynth(Tone.FMSynth).toDestination();

// 调整音色参数
synth.set({
    harmonicity: 2,
    modulationIndex: 3,
    envelope: {
        attack: 0.02,
        decay: 0.2,
        sustain: 0.8,
        release: 1
    },
    modulation: {
        type: "triangle"
    }
});

// 获取所有键
const keys = document.querySelectorAll('.key');
const activeNotesDiv = document.getElementById('active-notes');

// 存储当前显示的音符
const activeNotes = new Set();

// 更新显示的音符
function updateActiveNotes() {
    // 定义音符顺序映射
    const noteOrder = {
        'C3': 0, 'C#3': 1, 'D3': 2, 'D#3': 3, 'E3': 4,
        'F3': 5, 'F#3': 6, 'G3': 7, 'G#3': 8, 'A3': 9,
        'A#3': 10, 'B3': 11, 'C4': 12, 'C#4': 13, 'D4': 14,
        'D#4': 15, 'E4': 16, 'F4': 17, 'F#4': 18, 'G4': 19,
        'G#4': 20, 'A4': 21, 'A#4': 22, 'B4': 23, 'C5': 24
    };

    // 获取音符数组并按照键盘顺序排序
    const notes = Array.from(activeNotes).sort((a, b) => noteOrder[a] - noteOrder[b]);
    
    // 更新显示
    activeNotesDiv.innerHTML = notes
        .map(note => `<span class="note-tag">${note}</span>`)
        .join('');
    
    // 检测和弦
    if (notes.length >= 2) {
        const chord = Tonal.Chord.detect(notes);
        if (chord.length > 0) {
            activeNotesDiv.innerHTML += ` = <span class="chord-tag">${chord[0]}</span>`;
        }
    }

    // 根据是否有音符来设置清除按钮的禁用状态
    clearBtn.disabled = notes.length === 0;
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
        
        // 当没有任何音符时，释放所有声音
        if (activeNotes.size === 0) {
            synth.releaseAll();
        }
    }
});

const muteBtn = document.getElementById('mute-btn');
let isMuted = false;

muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
    muteBtn.classList.toggle('muted');
    
    if (isMuted) {
        synth.volume.value = -Infinity;
    } else {
        synth.volume.value = 0;
    }
});

const clearBtn = document.getElementById('clear-btn');
clearBtn.disabled = true;  // 设置初始状态为禁用

clearBtn.addEventListener('click', () => {
    // 清除所有激活的音符
    activeNotes.clear();
    // 释放所有按键的声音
    synth.releaseAll();
    // 移除所有键的激活状态
    document.querySelectorAll('.key.active').forEach(key => {
        key.classList.remove('active');
    });
    // 更新显示
    updateActiveNotes();
});