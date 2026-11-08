# Funambule (Tightrope Walker)

A balance game: a tightrope walker moves forward on their own along a wire stretched high above the city, and it is up to you to keep them upright against their own wobble and the wind. Get as far as you can before the fall.

*Version française : [README.md](README.md)*

## Controls

- **Space**: set off (and start again after a fall).
- Hold **←** or **→**, or click and hold on the **left** or **right** half of the game, to tilt the pole that way.
- **P**: pause.

## How it works

- The walker moves at a steady pace, which slowly increases with distance.
- They are never perfectly stable: as soon as they lean, they lean more and more unless caught. **Lean away from the fall**, without overdoing it, or they tip over the other way.
- The **wind** blows harder and harder as the crossing goes on, and changes direction.
- Sudden **gusts** add to it: they are announced a second ahead by white streaks crossing the screen from the side they come from, with a whoosh.
- Past a certain angle, it is the **fall**.
- A **pole** is passed every 26 metres.

## Statistics

After each fall, the screen shows the distance covered and the poles passed. The Records panel keeps your **longest crossing**, the number of **crossings**, the total **poles passed** and the **total distance**.

## Data and sync

Your record and totals are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Funambule → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
