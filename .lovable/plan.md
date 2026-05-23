# Remember Drive folder + wire up image pulls

## What I'll do

1. **Save the Drive folder to project memory** at `mem://references/image-drive.md`:
   - Folder URL: `https://drive.google.com/drive/folders/1bfp-GM0lJmQp2Qx5vMILCzTgs9iwHVtH`
   - Folder ID: `1bfp-GM0lJmQp2Qx5vMILCzTgs9iwHVtH`
   - Purpose: source of truth for all `my-story` page images (VaisesikaDasa1–14, Prabhupada3/7, manifesto3, book cover, signature, etc.)
   - Update `mem://index.md` Core to note: "All my-story images live in the shared Drive folder — pull via Google Drive connector before referencing in code."

2. **Connect the Google Drive connector** to this project (using `standard_connectors--connect` with `connector_id: google_drive`). You'll be prompted to pick/authorize a Google account that has access to the folder.

3. **Pull images on demand** — once connected, when you ask for a specific image (e.g. "use VaisesikaDasa5 in the hero"), I'll:
   - Query the folder via the connector gateway
   - Download the file straight into `src/assets/my-story/`
   - Wire it into the component via a normal Vite import

## Important caveat about "public" Drive folders

Even though the folder is shared "anyone with the link," the Google Drive connector authenticates as **your Google account**, not anonymously. So the account you connect just needs to be able to see the folder — which it will, since it's public. No extra permission setup needed on your side.

## What I won't do in this step

- I won't bulk-download all images right now. That's wasteful if we only end up using a subset. I'll pull each image the first time it's referenced and cache it in `src/assets/my-story/`.
- I won't touch `src/routes/my-story.tsx` in this plan — pure setup only.

## After you approve

Approve this plan → I'll save the memory file and trigger the Drive connector picker. Then on the next message you can say things like *"put VaisesikaDasa3 next to the manifesto section"* and I'll fetch + wire it in one step.
