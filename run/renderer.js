const fs = require('fs');
const path = require('path');

export function loadScenes() {
    const appContainer = document.getElementById('app');
    const scenesPath = path.join(__dirname, '../src/components/scenes');

    fs.readdir(scenesPath, (err, files) => {
        if (err) {
            console.error("Erreur lors de la lecture du dossier scenes:", err);
            return;
        }

        files.filter(file => file.endsWith('.html')).forEach(file => {
            const filePath = path.join(scenesPath, file);
            const content = fs.readFileSync(filePath, 'utf8');

            const wrapper = document.createElement('div');
            wrapper.innerHTML = content;

            const scene = wrapper.querySelector('body') || wrapper;
            scene.id = file.replace('.html', '');
            scene.classList.add('scene');
            scene.style.display = file === 'main.html' ? 'flex' : 'none';

            appContainer.appendChild(scene);
        });
    });
}
