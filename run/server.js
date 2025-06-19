import { serve } from "bun";
import path from "path";
import fs from "fs";

import { createMusic } from "../backend/instance.js";
import { addFolder } from "../backend/folder.js";

const baseDir = path.join(import.meta.dir, "run");

const server = serve({
    async fetch(req) {
        const url = new URL(req.url);

        const headers = new Headers({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        });

        // Folder and music creation
        if (req.method === "POST" && url.pathname === "/music/add") {
            const folderURL = await req.text();
            await addFolder(folderURL);

            return new Response("Ajouté", { status: 200 });
        }
        // if(req.method === "GET" && url.pathname === '/music/remove') {}
        if (req.method === "GET" && url.pathname === "/music/get") {
            const musicList = await createMusic();
            return new Response(JSON.stringify(musicList), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
    },

    port: 8000,
});

console.log(`Server running at ${server.url.href}`);