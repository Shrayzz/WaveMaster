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

export function showDisplay(scene, background) {
    const div = document.getElementById(scene);
    const bg = document.getElementById(background);
    div.style.display = 'flex';
    div.style.pointerEvents = 'none';
    bg.style.display = 'flex';

    const showDiv = div.animate([
        {
            opacity: 0,
            transform: 'scale(0.9)'
        },
        {
            opacity: 1,
            transform: 'scale(1)'
        }], {
        duration: 100,
        easing: 'ease-in-out'
    });

    const showBG = bg.animate([
        { opacity: 0 },
        { opacity: 1 }
    ], {
        duration: 100,
        easing: 'ease-in-out'
    });

    showDiv.finished.then(() => {
        div.style.pointerEvents = '';
    });
}

export function hideDisplay(scene, background) {
    const div = document.getElementById(scene);
    const bg = document.getElementById(background);

    const hideDiv = div.animate([
        {
            opacity: 1,
            transform: 'scale(1)'
        },
        {
            opacity: 0,
            transform: 'scale(0.9)'
        }], {
        duration: 100,
        easing: 'ease-in-out'
    });

    const hideBG = bg.animate([
        { opacity: 1 },
        { opacity: 0 }
    ], {
        duration: 100,
        easing: 'ease-in-out'
    });

    hideDiv.finished.then(() => {
        hideBG.finished.then(() => {
            div.style.display = 'none';
            bg.style.display = 'none';
        });
    });
}


export function setDisplayMiniWindow(windowId, state) {
    const element = document.getElementById(windowId);
    if (!element) return;

    if (state === false) {
        element.style.display = 'flex';
        element.animate([
            { opacity: 0, transform: 'translateY(50px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], {
            duration: 200,
            easing: 'ease-in-out'
        });
    } else {
        const animation = element.animate([
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(50px)' }
        ], {
            duration: 200,
            easing: 'ease-in-out'
        });

        animation.finished.then(() => {
            element.style.display = 'none';
        });
    }
}

