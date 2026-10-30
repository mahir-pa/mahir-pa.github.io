# Mahir Patel — Portfolio

Mahir's electrical-engineering portfolio: embedded systems, vehicle electronics, personal projects, an interactive KiCad-derived PCB explorer, and an original reactive magnetic-field background.

The site is plain HTML, CSS, and JavaScript. GitHub Actions validates notebook entries, builds the static site, and publishes it with GitHub Pages.

## Highlights

- Scanner 2.0 and Receiver boards derived from Mahir's supplied KiCad designs
- Interactive 3D components, trace highlighting, 2D layouts, and schematic views
- Pointer-responsive field with PCB-derived branching pulses and Attract / Repel control
- Restored multilingual name scramble: English, Hindi, and Gujarati
- A semicircular vinyl collection, animated record loading and stylus, playback controls, and a swipeable mobile sleeve rack
- Light switch, responsive layout, reduced-motion behavior, and static WebGL fallback

See [PCB-ACCURACY.md](PCB-ACCURACY.md) for source counts, limitations, model attribution, and validation details. The raw KiCad board and schematic files are intentionally not included.

## Writing in the Notebook

Open `notebook.html`, choose New entry, and use PIN `2412`. This PIN is a convenience lock for the editor; your GitHub account controls publication. Drafts save in your browser on the current device.

Write an entry, review it, and choose Continue on GitHub. Sign in if asked, review the prefilled JSON file, and Commit changes to `main`. The publishing workflow automatically validates the entry and refreshes the public notebook index. Longer entries can be copied into the blank GitHub file using the alternate buttons. No account token is stored in the website. Entries live in `notebook/entries/`; reading is public.

## Signal lab and music

The graph accepts ordinary mathematical notation, including `x`, `t`, `f`, `pi`, powers, and functions such as `sin`, `cos`, `exp`, `sqrt`, and `abs`. Parsing does not execute JavaScript. The CAN, motor PWM, and sensor traces are illustrative simulations. The CAN voltage levels follow [Texas Instruments](https://www.ti.com/document-viewer/lit/html/SSZTCN3); the packet is slowed for readability.

The 16-song catalog is in `assets/tracks.js`. Artwork and official recording source links are recorded in `assets/catalog-sources.json`; no audio is redistributed. Inline availability depends on YouTube's embedding permissions. The small current-record display follows actual player state.
