const current = document.querySelector('.current');
let next = document.querySelector('.next');

export function setDisplay() {
    next.style.display = 'flex';
    next.style.opacity = 0;
    current.style.pointerEvents = 'none';

    const hide = current.animate([
        {
            opacity: 1,
            transform: 'scale(1)'
        },
        {
            pointerEvents: 'none',
            opacity: 0,
            transform: 'scale(0.8)'
        }], {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'forwards'
    });

    const show = next.animate([
        {
            opacity: 0,
            transform: 'scale(0.8)'
        },
        {
            opacity: 1,
            transform: 'scale(1)'
        }], {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'forwards'
    });

    hide.finished.then(() => {
        current.style.display = 'none';
        current.classList.remove('current');
        current.style.pointerEvents = '';

        next.classList.remove('next');
        next.classList.add('current');
        next = current;
    });
}

export function assignCurrentAndNext(currentId, nextId) {
    const currentScene = document.getElementById(currentId);
    const nextScene = document.getElementById(nextId);

    if (currentScene && nextScene) {
        currentScene.classList.add('current');
        nextScene.classList.add('next');
    } else {
        console.error(`Error: one or both elements with IDs '${currentId}' or '${nextId}' not found.`);
    }
}