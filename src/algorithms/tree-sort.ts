import type { ArrayEntry, Step } from '../types/index.ts'

// Tree Sort: insert every element into a Binary Search Tree, then read back
// via in-order traversal.
//
// Visualisation phases:
//   1. Build — for each element, traverse the BST comparing against visited
//      nodes until the insertion point is found. Each node visited = one
//      'compare' step. The inserted position gets a 'pivot' highlight.
//   2. Readout — in-order traversal overwrites the array left-to-right,
//      marking each slot sorted as it is written.

interface BSTNode {
  entry: ArrayEntry
  origIdx: number          // index in the flat array — used for compare steps
  left: BSTNode | null
  right: BSTNode | null
}

function bstInsert(
  root: BSTNode | null,
  entry: ArrayEntry,
  origIdx: number,
  compareSteps: Array<{ type: 'compare'; i: number; j: number }>,
): BSTNode {
  const newNode: BSTNode = { entry, origIdx, left: null, right: null }
  if (root === null) return newNode

  let cur: BSTNode = root
  for (;;) {
    compareSteps.push({ type: 'compare', i: origIdx, j: cur.origIdx })
    if (entry.value <= cur.entry.value) {
      if (cur.left === null) { cur.left = newNode; return root }
      cur = cur.left
    } else {
      if (cur.right === null) { cur.right = newNode; return root }
      cur = cur.right
    }
  }
}

function bstInOrder(root: BSTNode | null, result: ArrayEntry[]): void {
  if (root === null) return
  bstInOrder(root.left, result)
  result.push(root.entry)
  bstInOrder(root.right, result)
}

export function* treeSortSteps(arr: ArrayEntry[]): Generator<Step> {
  const a = arr.map((e) => ({ ...e }))
  const n = a.length

  if (n <= 1) {
    if (n === 1) yield { type: 'mark-sorted', indices: [0] }
    yield { type: 'done' }
    return
  }

  // Phase 1: build BST, yielding compare steps for each insertion
  let root: BSTNode | null = null
  for (let i = 0; i < n; i++) {
    const compareSteps: Array<{ type: 'compare'; i: number; j: number }> = []
    root = bstInsert(root, a[i], i, compareSteps)
    for (const step of compareSteps) yield step
    // Highlight the newly inserted node
    yield { type: 'pivot', i }
  }

  // Phase 2: in-order traversal → write sorted values back left-to-right
  const sorted: ArrayEntry[] = []
  bstInOrder(root, sorted)

  for (let i = 0; i < n; i++) {
    a[i] = sorted[i]
    yield { type: 'overwrite', i, value: sorted[i].value }
    yield { type: 'mark-sorted', indices: [i] }
  }

  yield { type: 'done' }
}

export function treeSort(arr: number[]): number[] {
  if (arr.length <= 1) return [...arr]

  interface Node { val: number; left: Node | null; right: Node | null }

  function insert(root: Node | null, val: number): Node {
    const node: Node = { val, left: null, right: null }
    if (root === null) return node
    let cur = root
    for (;;) {
      if (val <= cur.val) {
        if (cur.left === null) { cur.left = node; return root }
        cur = cur.left
      } else {
        if (cur.right === null) { cur.right = node; return root }
        cur = cur.right
      }
    }
  }

  function inOrder(root: Node | null, result: number[]): void {
    if (root === null) return
    inOrder(root.left, result)
    result.push(root.val)
    inOrder(root.right, result)
  }

  let root: Node | null = null
  for (const v of arr) root = insert(root, v)
  const result: number[] = []
  inOrder(root, result)
  return result
}
