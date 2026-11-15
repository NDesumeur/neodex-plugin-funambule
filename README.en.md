# Funambule (Tightrope Walker)

A balance game: a tightrope walker moves forward on their own along a wire stretched high above the city, and it is up to you to keep them upright against their own wobble and the wind. Get as far as you can before the fall.

*Version française : [README.md](README.md)*

## Controls

- **Space**: set off (and start again after a fall).
- Hold **←** or **→**, or click and hold on the **left** or **right** half of the game, to tilt the pole that way.
- **P**: pause.
- **Full screen**: the button of the same name; Escape to leave it. Outside full screen, the game takes the room the window leaves.

## How it works

- The walker moves at a steady pace, which slowly increases with distance.
- They are never perfectly stable: as soon as they lean, they lean more and more unless caught. **Lean away from the fall**, without overdoing it, or they tip over the other way.
- The **wind** blows harder and harder as the crossing goes on, and changes direction.
- Sudden **gusts** add to it: they are announced a second ahead by white streaks crossing the screen from the side they come from, with a whoosh.
- Past a certain angle, it is the **fall**.
- A **pole** is passed every 26 metres.
- When they lean hard, the walker (beret and striped shirt) lets go of the pole and **their arms windmill**, faster and faster; they go back to the pole as soon as they recover.

## The cities

Every **250 metres**, the wire passes over another city, with a fade, and its name shows up:

1. **Paris** at sunset: Haussmann buildings with zinc roofs, the Eiffel Tower and the basilica on its hill.
2. **Venice**: colourful houses along a canal, gondolas, mooring poles, bell towers and domes.
3. **New York by night**: stars, a crescent moon, skyscrapers with lit windows and water tanks on the roofs.
4. **The canyon**: red rock plateaus, hoodoos, a stone arch and cacti.

Then the crossing starts again from Paris.

## Statistics

After each fall, the screen shows the distance covered and the poles passed. The Records panel keeps your **longest crossing**, the number of **crossings**, the total **poles passed** and the **total distance**.

## Data and sync

Your record and totals are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Funambule → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
