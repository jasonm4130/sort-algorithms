---
applyTo: "src/components/**"
---

# Component File Rules

## Structure
- Every component lives in its own folder: `src/components/<ComponentName>/`
- Every component folder **must** contain a co-located `<ComponentName>.test.tsx`
- Export the component as a **named export** (not default): `export function ComponentName(...)`

## Animations
- All animations must use `motion/react` — no CSS transitions or other animation libraries
- Use `<motion.div layout>` for elements that change position (especially sort bars)
- Use stable `entry.id` as the React `key`, never array indices
- Wrap animated elements in `<LayoutGroup>` when they reorder siblings

## Testing animations
- Always wrap component renders in `<MotionConfig reducedMotion="always">` in tests:
  ```tsx
  import { MotionConfig } from 'motion/react'
  render(
    <MotionConfig reducedMotion="always">
      <YourComponent />
    </MotionConfig>
  )
  ```
- Test rendered state, not animation internals

## CSS
- Use CSS custom properties for all theme-sensitive values: `var(--color-bar-default)`, `var(--color-bar-comparing)`, `var(--color-surface)`, etc.
- Never hardcode hex colour values in component files — always reference a CSS variable

## Accessibility
- Interactive controls must have accessible labels (`aria-label`, associated `<label>`, or visible text)
- The bar visualizer region must have `role="img"` with a descriptive `aria-label`
- Speed and size sliders must expose their current value via `aria-valuenow`
