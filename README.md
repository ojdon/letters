# Literki

A touch-friendly Polish spelling game for young children. Look at the picture, then tap or drag the letters into the right order.

## Features

- Three-step welcome flow for name, age and favourite colour
- Colour themes that follow the chosen favourite colour
- 36 picture words across three difficulty levels, including Polish diacritics
- Big touch targets, tap-to-place and drag-and-drop letter tiles
- Polish speech synthesis for words, letters and tapped sentences (when the device has a Polish voice)
- Star rewards, confetti, touch and success sound effects, hints and a parent settings panel
- Progress stored locally in the browser — no account or backend needed

## Run it

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

```bash
npm run build
npm run preview
```

## Tech

- React 19 + Vite
- Tailwind CSS v4
- `@dnd-kit/core` for touch drag-and-drop
- Bundled Twemoji SVGs (CC BY 4.0) and Baloo 2 (SIL Open Font License) via Fontsource

Picture assets are from [Twemoji](https://github.com/jdecked/twemoji) and are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
