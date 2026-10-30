# Actual PCB explorer — accuracy and interaction notes

Both supplied board files and their matching schematics were inspected. The published portfolio includes derived visual assets. The raw .kicad_pcb and .kicad_sch files remain local and are excluded from this repository.

| Source | Board size | Footprints | Pads | Track segments | Vias | Filled polygons |
|---|---|---:|---:|---:|---:|---:|
| Scanner2.0 | 48.5 × 85.5 mm | 21 | 87 | 229 | 4 | 9 |
| RECEIVER | 43.5 × 65.5 mm | 19 | 76 | 171 | 2 | 6 |

## What is real

The board outlines, 1.6 mm thickness, footprint positions and rotations, pad shapes, copper segments and zones, vias, drill positions, and relevant silkscreen come from the supplied designs. All component references and values were cross-checked against their matching schematic. There are no separate mounting-hole footprints or board cutouts in these two files. Through-holes and via drills are cut into the rendered board.

Eleven of twelve referenced package types use official KiCad packages3D library geometry converted from VRML to Three.js JSON, scaled to millimeters. The component anchors and rotations come directly from the footprint data. Original library model sources and license notices are included under assets/pcb/model-sources; these are public library models, not your raw design files.

## Specific limitations

- The exact LED_D5.0mm-4_RGB_Wide_Pins model was unavailable. D1 uses a simplified 5 mm RGB LED body and leads aligned to the actual pads. Its height and optical appearance are approximate.
- Library packages represent the referenced footprint, not a measured scan of the assembled hardware. Board colors, lighting, solder appearance, and material finishes are artistic.
- KiCad itself and its export CLI were unavailable locally. The board and schematic assets were generated directly from KiCad S-expressions, including embedded schematic symbols. This is not a KiCad-native 3D or schematic export. Schematic/silkscreen lettering uses an approximate font and some annotations may overlap at small zoom levels.
- External servo, keypad, OLED, and IR modules are not in the board geometry and were not invented. The crystal's frequency is unspecified in the source schematic.

## Sensors and floating interaction

Neither schematic identifies an onboard sensor. J2 is a three-pin IR RX connector for external hardware whose sensor model is unspecified. The explorer labels this accurately and lifts verified functional components/connectors instead of relabeling them as sensors.

Selection or pointer hover lifts a component 8 mm above its real footprint, with a fine leader back to the original anchor and connected trace segments highlighted by net. Explore staggers J2, J4, U1, J7, D1, and BZ1; Reassemble returns the vertical offset to exactly zero. Shared supply nets can highlight many traces. This is visual connectivity, not a simulation of signal flow. Touch uses tap selection; vertical scrolling is preserved. Drawings offer front/back layout and schematic zoom.

## Background and restored name

The original spring-field artwork responds to pointer speed and direction, then settles. Empty-space clicks send a radial impulse and a branching signal along paths derived from Scanner 2.0 track segments. The nearest branching junction seeds the routing. Copper planes and electrical behavior are not simulated. Attract / Repel reverses the radial response. Forms, navigation, music controls, text clicks, and the board scene do not trigger pulses.

Coarse pointers get fewer field lines and eddies. Reduced motion freezes the field, replaces animated pulses with a brief static mark, and snaps component changes. Rendering pauses when the document is hidden; the board also pauses offscreen.

Mahir's original personal name sequence is restored: Mahir Patel → माहिर पटेल → માહિર પટેલ, with the original scramble alphabet and three-second holds. Hindi and Gujarati use grapheme-aware scrambling. The accessible heading remains stable, and reduced motion keeps the English name still.

## Validation performed

Browser checks confirmed both board selections, six-component exploration at 8 mm, zero offsets after reassembly, schematic rendering, and static fallback switching to Receiver. Pointer movement produced an 81.5 px field displacement and seven live eddies during one test; a click registered a pulse over the 229-segment trace graph. The polarity button did not inject another pulse. The 390 px layout had no horizontal overflow. Gujarati rendered correctly on mobile width.

Reduced-motion/coarse-pointer behavior and unavailable-WebGL behavior were exercised through separate local test harnesses, not a physical phone or changed operating-system setting. Reduced-motion exploration reached the exact 8 mm endpoints immediately, and Reassemble returned an empty lifted list. The background remained at zero displacement. The harnesses are excluded from the downloadable website.

Unrelated existing pages, resume, playlist, images, and vendor files were hash-checked as unchanged. Changes to the shared app entry point are limited to loading these interactions; original music, light switch, filters, reveals, and oscilloscope logic remain intact.

## Interaction research

- PavelDoGreat fluid simulation: https://paveldogreat.github.io/WebGL-Fluid-Simulation/
- Source/reference: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
- Codrops emitter cursor: https://tympanus.net/Development/EmitterCursor/
- Codrops interaction hub: https://tympanus.net/codrops/hub/

These informed momentum, wake, and emitter interaction ideas. The field implementation is original and uses the portfolio's existing colors rather than rainbow smoke.
