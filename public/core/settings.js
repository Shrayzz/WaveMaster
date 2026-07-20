import { globalValues } from "../../backend/data/values.js";
import { message, restart } from "./event.js";

const newFolder = document.querySelector('.folder-tool-new-folder');
const deleteAllBtn = document.querySelector('.folder-tool-delete-all');
const foldersDisplay = document.getElementById('folders-display');

let result;

newFolder.addEventListener('click', async () => {
    await setNewFolder();
});

deleteAllBtn.addEventListener('click', async () => {
    const res = confirm("Are you sure you want to delete all your paths ? (This action is irreversible)");
    if (!res) return;

    result = deleteAllFolders();
});

async function setNewFolder() {
    try {
        const urls = await window.wmAPI.getUrls();
        const folderPath = await window.wmAPI.getFolderPath();

        if (!folderPath) {
            message(`❌ No folder path added`, 128, 0, 0);
            return;
        }

        const urlNormalized = folderPath.replace(/\\/g, '/');

        if (urls.includes(urlNormalized)) {
            message(`❌ Folder path already exists in urls list`, 128, 0, 0);
            return;
        }

        const count = await window.wmAPI.getFolderCount(urlNormalized);
        const folderDiv = createFolderDiv(urlNormalized, count);

        // ! FIX
        foldersDisplay.appendChild(folderDiv);
        const result = await folderAddConfirmation(folderDiv);
        console.log("confirm", result);

        if (!result) return;

        urls.push(urlNormalized);
        await window.wmAPI.writeUrls(urls);
        await restart();


    } catch (err) {
        message(`❌ Cannot add any url list : ${err}`, 128, 0, 0);
        console.error(err)
    }
}

function createFolderDiv(path, count) {
    const mainContainer = document.createElement("div");
    mainContainer.className = "folder-display-container-temp";

    mainContainer.innerHTML = `
        <div class="folder-display-label-container">
            <p class="folder-display-label-p">${path}</p>
        </div>

        <div class="folder-display-other-container">
            <div class="folder-display-other-container-top">
                <p class="folder-display-label-count">${count}</p>
                <img src="../assets/icons/music-note.svg" alt="">
            </div>

            <div class="folder-display-other-container-bottom">
                <button class="edit-btn">
                    <img src="../assets/icons/pencil.svg" alt="">
                </button>

                <button class="delete-btn">
                    <img src="../assets/icons/x.svg" alt="">
                </button>
            </div>
        </div>
    `;

    const deleteBtn = mainContainer.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", async () => {
        await deleteFolder(mainContainer, path);
    });

    return mainContainer;
}

async function folderAddConfirmation(container) {
    return new Promise((resolve) => {
        const checkBtns = document.querySelector('.folders-tools-left');

        checkBtns.style.opacity = "1";
        checkBtns.style.pointerEvents = "auto";

        const yes = document.querySelector('.folder-tool-set');
        const no = document.querySelector('.folder-tool-undo');

        const cleanup = () => {
            checkBtns.style.opacity = "0";
            checkBtns.style.pointerEvents = "none";
        };

        const onYes = () => {
            yes.removeEventListener('click', onYes);
            no.removeEventListener('click', onNo);

        
            const el = document.querySelector('.folder-display-container-temp');
            el.classList.remove('folder-display-container-temp');
            el.classList.add('folder-display-container')

            cleanup();
            resolve(true);
        };

        const onNo = () => {
            yes.removeEventListener('click', onYes);
            no.removeEventListener('click', onNo);

            foldersDisplay.removeChild(container);

            cleanup();
            resolve(false);
        };

        yes.addEventListener('click', onYes);
        no.addEventListener('click', onNo);
    });
}

async function deleteAllFolders() {
    try {
        let urls = await window.wmAPI.getUrls();
        urls = [];
        await window.wmAPI.writeUrls(urls);
        
        while (foldersDisplay.firstChild) {
            foldersDisplay.removeChild(foldersDisplay.firstChild);
        }
        await restart();
    } catch (err) {
        console.log(err);
        message(`❌ Unable to delete all folders : ${err}`, 128, 0, 0);
    }
}

async function deleteFolder(container, path) {
    try {
        const confirmDelete = confirm(
            `Delete this folder ?\n${path}`
        );

        if (!confirmDelete) return;
        let urls = await window.wmAPI.getUrls();
        urls = urls.filter(url => url !== path);
        await window.wmAPI.writeUrls(urls);
        container.remove(); 

        await restart();

    } catch (err) {
        console.log(err);
        message(`❌ Unable to delete folder : ${err}`, 128, 0, 0);
    }
}