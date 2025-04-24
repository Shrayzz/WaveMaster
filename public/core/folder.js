export async function addFolder(folderURL) {
    const response = await fetch('http://localhost:8000/music/add', {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: folderURL
    });

    if (!response.ok) {
        console.error(`Erreur ajout dossier ${folderURL} :`, response.status);
    } else {
        console.log('Dossier bien enregistré');
    }
}

export async function removeFolder(folderURL) {
    const response = await fetch('http://localhost:8000/music/remove', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ folder: folderURL })
    });

    if (!response.ok) {
        console.error(`Erreur suppression dossier ${folderURL} :`, response.status);
    } else {
        console.log('Dossier supprimé');
    }
}