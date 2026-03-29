import type { ArrayEntry, Step } from '../types/index.ts'

// Cycle Sort: O(n²) time but provably minimises the number of writes to memory.
// Every element is written to its final position at most twice — ideal for
// write-constrained storage (e.g. NAND flash, EEPROM).
//
// For each "cycle" starting at cycleStart:
//   1. Count elements smaller than a[cycleStart] → that is its correct position (pos)
//   2. Skip past any duplicates at pos
//   3. Write the item to pos, displace what was there
//   4. Repeat with the displaced element until the cycle closes at cycleStart

export function* cycleSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length

  for (let cycleStart = 0; cycleStart <= n - 2; cycleStart++) {
    let itemVal = a[cycleStart].value
    let itemId = a[cycleStart].id

    // Count elements strictly smaller → find correct position
    let pos = cycleStart
    for (let i = cycleStart + 1; i < n; i++) {
      yield { type: 'compare', i, j: cycleStart }
      if (a[i].value < itemVal) pos++
    }

    // Element is already in a valid position for this cycle
    if (pos === cycleStart) continue

    // Skip past duplicates at the target position
    while (pos < n - 1 && itemVal === a[pos].value) pos++

    // Write item to its position, save the displaced element
    const tmpVal = a[pos].value
    const tmpId = a[pos].id
    a[pos] = { id: itemId, value: itemVal }
    yield { type: 'overwrite', i: pos, value: itemVal }
    itemVal = tmpVal
    itemId = tmpId

    // Rotate the remaining elements of the cycle
    while (pos !== cycleStart) {
      pos = cycleStart
      for (let i = cycleStart + 1; i < n; i++) {
        yield { type: 'compare', i, j: cycleStart }
        if (a[i].value < itemVal) pos++
      }
      while (pos < n - 1 && itemVal === a[pos].value) pos++

      const dv = a[pos].value
      const di = a[pos].id
      a[pos] = { id: itemId, value: itemVal }
      yield { type: 'overwrite', i: pos, value: itemVal }
      itemVal = dv
      itemId = di
    }
  }

  yield { type: 'mark-sorted', indices: Array.from({ length: n }, (_, i) => i) }
  yield { type: 'done' }
}

export function cycleSort(arr: number[]): number[] {
  const a = [...arr]
  const n = a.length

  for (let cycleStart = 0; cycleStart <= n - 2; cycleStart++) {
    let item = a[cycleStart]

    let pos = cycleStart
    for (let i = cycleStart + 1; i < n; i++) {
      if (a[i] < item) pos++
    }

    if (pos === cycleStart) continue

    while (pos < n - 1 && item === a[pos]) pos++

    ;[a[pos], item] = [item, a[pos]]

    while (pos !== cycleStart) {
      pos = cycleStart
      for (let i = cycleStart + 1; i < n; i++) {
        if (a[i] < item) pos++
      }
      while (pos < n - 1 && item === a[pos]) pos++
      ;[a[pos], item] = [item, a[pos]]
    }
  }

  return a
}
