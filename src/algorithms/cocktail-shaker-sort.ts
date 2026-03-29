import type { ArrayEntry, Step } from '../types/index.ts'

// Cocktail Shaker Sort (bidirectional bubble sort):
// Alternates between a forward pass (pushing the largest unsorted element to the right)
// and a backward pass (pushing the smallest unsorted element to the left).
// Shrinks the active window from both ends, converging faster than plain bubble sort
// on arrays with small elements near the end ("turtles" in bubble sort terms).

export function* cocktailShakerSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  let left = 0
  let right = a.length - 1
  let swapped = true

  while (swapped && left < right) {
    swapped = false

    // Forward pass — bubble largest unsorted element to the right
    for (let i = left; i < right; i++) {
      yield { type: 'compare', i, j: i + 1 }
      if (a[i].value > a[i + 1].value) {
        ;[a[i], a[i + 1]] = [a[i + 1], a[i]]
        yield { type: 'swap', i, j: i + 1 }
        swapped = true
      }
    }
    yield { type: 'mark-sorted', indices: [right] }
    right--

    if (!swapped) break
    swapped = false

    // Backward pass — bubble smallest unsorted element to the left
    for (let i = right; i > left; i--) {
      yield { type: 'compare', i: i - 1, j: i }
      if (a[i - 1].value > a[i].value) {
        ;[a[i - 1], a[i]] = [a[i], a[i - 1]]
        yield { type: 'swap', i: i - 1, j: i }
        swapped = true
      }
    }
    yield { type: 'mark-sorted', indices: [left] }
    left++
  }

  // Mark any remaining middle elements (single element or already-sorted region)
  const remaining: number[] = []
  for (let i = left; i <= right; i++) remaining.push(i)
  if (remaining.length > 0) yield { type: 'mark-sorted', indices: remaining }

  yield { type: 'done' }
}

export function cocktailShakerSort(arr: number[]): number[] {
  const a = [...arr]
  let left = 0
  let right = a.length - 1
  let swapped = true

  while (swapped && left < right) {
    swapped = false
    for (let i = left; i < right; i++) {
      if (a[i] > a[i + 1]) {
        ;[a[i], a[i + 1]] = [a[i + 1], a[i]]
        swapped = true
      }
    }
    right--
    if (!swapped) break
    swapped = false
    for (let i = right; i > left; i--) {
      if (a[i - 1] > a[i]) {
        ;[a[i - 1], a[i]] = [a[i], a[i - 1]]
        swapped = true
      }
    }
    left++
  }

  return a
}
