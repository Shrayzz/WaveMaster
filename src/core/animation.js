export function setDisplayWithAnim(current, next) {
    const currentScene = document.getElementById(current);
    const nextScene = document.getElementById(next);
    currentScene.style.display = 'flex';
    currentScene.style.pointerEvents = 'none';

    const hide = currentScene.animate([
        {
            opacity: 1,
            transform: 'scale(1)'
        },
        {
            opacity: 0,
            transform: 'scale(0.8)'
        }], {
        duration: 100,
        easing: 'ease-in-out'
    });

    hide.finished.then(() => {
        currentScene.style.display = 'none';
        currentScene.style.pointerEvents = '';

        nextScene.style.display = 'flex';

        nextScene.animate([
            {
                opacity: 0,
                transform: 'scale(0.8)'
            },
            {
                opacity: 1,
                transform: 'scale(1)'
            }], {
            duration: 100,
            easing: 'ease-in-out'
        });
    });
}

export function setDisplayWithoutAnim(current, next) {
    const currentScene = document.getElementById(current);
    const nextScene = document.getElementById(next);

    currentScene.style.display = 'none';
    nextScene.style.display = 'flex';
}


document.querySelector('.main-button-player').addEventListener('click', () => setDisplayWithAnim('main', 'player'))
document.querySelector('.player-container-header .back').addEventListener('click', () => setDisplayWithAnim('player', 'main'))
