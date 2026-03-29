# WCAG 2.1 AA Checklist — Sorting Visualizer

## Controls
- [ ] All buttons have visible text or `aria-label`
- [ ] Speed slider exposes `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`
- [ ] Array size slider exposes same attributes
- [ ] Play/pause button label changes to reflect current state ("Play" when paused, "Pause" when playing)
- [ ] Algorithm selector is keyboard navigable

## Visualizer region
- [ ] Bar chart container has `role="img"` with `aria-label` describing current algorithm and state
- [ ] `aria-live="polite"` region announces step changes for screen readers

## Motion / Animation
- [ ] `@media (prefers-reduced-motion: reduce)` disables all animations or substitutes instant transitions
- [ ] Animations do not flash more than 3 times per second (WCAG 2.3.1)
- [ ] Animation can be paused via the play/pause control (WCAG 2.2.2)

## Colour contrast
- [ ] All text on surface colours meets 4.5:1 contrast ratio
- [ ] Bar state colours (comparing, swapping, sorted, pivot) meet 3:1 against background (UI component threshold)
- [ ] State is communicated by more than colour alone (bar labels or legend)

## Focus
- [ ] All interactive elements reachable and operable via keyboard (Tab, Enter, Space)
- [ ] Focus ring visible on all interactive elements
- [ ] No keyboard traps
