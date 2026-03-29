import { Link } from 'react-router'
import { ArrowRight } from 'react-feather'
import { ALGORITHM_GROUPS, ALGORITHMS } from '../constants/algorithms.ts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { Badge } from '@/components/ui/badge.tsx'

const TOTAL = ALGORITHMS.length

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <header className="mb-20">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-text-muted">
          An interactive guide
        </p>
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Sorting is the{' '}
          <span className="text-accent">most studied</span>{' '}
          problem in computer science.
        </h1>
        <p className="max-w-[65ch] text-xl leading-relaxed text-text-muted">
          Before databases, before search engines, before AI — there was the humble question: given
          a pile of things, what is the fastest way to put them in order? The answer turned out to
          be surprisingly deep, and the journey to find it produced some of the most elegant (and
          most absurd) ideas in all of computing.
        </p>
      </header>

      {/* ── Why it matters ────────────────────────────────────────────── */}
      <section className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-2xl font-bold">Why does sorting matter?</h2>
          <p className="mb-4 leading-relaxed text-text-muted">
            About 25% of all CPU time in the early days of computing was spent sorting data. Today
            it is baked into every layer of the stack — your database index, your search results,
            your autocomplete dropdown — all depend on something being in order first.
          </p>
          <p className="leading-relaxed text-text-muted">
            More importantly, sorting is where algorithmic thinking becomes visceral. The difference
            between a naïve O(n²) approach and a clever O(n log n) one is not just academic: on a
            million items it is the difference between 0.02 seconds and 28 hours.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-surface p-5">
            <p className="mb-1 font-mono text-3xl font-bold text-accent">O(n²)</p>
            <p className="text-sm text-text-muted">
              1,000,000 items with bubble sort: ~<strong className="text-text">277 hours</strong> of operations.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5">
            <p className="mb-1 font-mono text-3xl font-bold text-bar-sorted">O(n log n)</p>
            <p className="text-sm text-text-muted">
              Same data with merge sort: ~<strong className="text-text">0.02 seconds</strong> of operations.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5">
            <p className="mb-1 font-mono text-3xl font-bold text-bar-swapping">O(∞)</p>
            <p className="text-sm text-text-muted">
              Bogo sort on 20 items: statistically, <strong className="text-text">longer than the age of the universe</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ── Complexity primer ─────────────────────────────────────────── */}
      <section className="mb-20">
        <h2 className="mb-3 text-2xl font-bold">Big-O in 60 seconds</h2>
        <p className="mb-6 max-w-[65ch] leading-relaxed text-text-muted">
          Big-O notation describes how an algorithm scales as input grows — specifically the worst
          case. It strips away hardware differences and tells you the fundamental shape of the
          curve. Here are the ones you will see here:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted">
                <th className="pb-3 pr-8 font-semibold">Notation</th>
                <th className="pb-3 pr-8 font-semibold">Name</th>
                <th className="pb-3 pr-8 font-semibold">10 items</th>
                <th className="pb-3 font-semibold">1,000 items</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {[
                { o: 'O(n)', name: 'Linear', s10: '10', s1k: '1,000' },
                { o: 'O(n log n)', name: 'Linearithmic', s10: '33', s1k: '10,000' },
                { o: 'O(n²)', name: 'Quadratic', s10: '100', s1k: '1,000,000' },
                { o: 'O(n²·⁷¹)', name: 'Stooge territory', s10: '521', s1k: '~512,000,000' },
                { o: 'O(n!)', name: 'Factorial (bogo)', s10: '3,628,800', s1k: '∞ (practically)' },
              ].map(row => (
                <tr key={row.o} className="border-b border-border/50">
                  <td className="py-2.5 pr-8 text-accent">{row.o}</td>
                  <td className="py-2.5 pr-8 text-text-muted font-sans">{row.name}</td>
                  <td className="py-2.5 pr-8 text-text">{row.s10}</td>
                  <td className="py-2.5 text-text">{row.s1k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Novelty section ───────────────────────────────────────────── */}
      <section className="mb-20">
        <h2 className="mb-3 text-2xl font-bold">Then there are the absurd ones.</h2>
        <p className="mb-8 max-w-[65ch] leading-relaxed text-text-muted">
          Not every sorting algorithm was invented to be fast. Some were invented to be funny,
          some to illustrate theoretical limits, and at least one relies on the heat death of the
          universe as part of its operating model.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: 'Miracle Sort',
              complexity: 'O(∞)',
              copy: 'Check if sorted. If not, do nothing and check again. Repeat until a cosmic ray flips the right bits. Has never terminated in a non-trivial case in recorded history.',
            },
            {
              name: 'Bogo Sort',
              complexity: 'O(n · n!)',
              copy: 'Shuffle the array randomly. Check if it\'s sorted. If not, shuffle again. Expected comparisons for 20 items: more than atoms in the observable universe.',
            },
            {
              name: 'Sleep Sort',
              complexity: 'O(n + max)',
              copy: 'Launch one thread per element. Each thread sleeps for a duration proportional to its value, then announces itself. The O(1) lookup is technically correct.',
            },
            {
              name: 'Quantum Bogosort',
              complexity: 'O(1)',
              copy: 'Observe the array. Destroy all universes where it is not sorted. In the surviving universe it was always sorted. Genuinely O(1) — just not in this universe.',
            },
            {
              name: 'Stalin Sort',
              complexity: 'O(n)',
              copy: 'Iterate once. Any element that is out of order is eliminated. The result is sorted, technically. Some elements just did not make it to the output.',
            },
            {
              name: 'Stooge Sort',
              complexity: 'O(n²·⁷¹)',
              copy: 'Sort the first two-thirds. Then the last two-thirds. Then the first two-thirds again. Donald Knuth called it "particularly noteworthy for its poor performance."',
            },
          ].map(item => (
            <div key={item.name} className="rounded-lg border border-border bg-surface p-5">
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <span className="font-semibold">{item.name}</span>
                <span className="font-mono text-xs text-bar-comparing">{item.complexity}</span>
              </div>
              <p className="text-sm leading-relaxed text-text-muted">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Algorithm grid ────────────────────────────────────────────── */}
      <section>
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">All {TOTAL} algorithms</h2>
          <p className="text-sm text-text-muted">Click any to start the visualizer</p>
        </div>

        <div className="flex flex-col gap-10">
          {Object.entries(ALGORITHM_GROUPS).map(([groupName, algorithms]) => (
            <div key={groupName}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
                {groupName}
              </h3>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
                {algorithms.map(algo => (
                  <li key={algo.id}>
                    <Link
                      to={`/algorithm/${algo.id}`}
                      aria-label={`View ${algo.name} visualization`}
                      className="block rounded-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Card className="h-full transition-colors hover:border-accent hover:bg-surface-raised">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{algo.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1.5">
                          <code className="font-mono text-xs text-bar-default">
                            {algo.timeComplexity.average}
                          </code>
                          <Badge variant={algo.stable ? 'secondary' : 'outline'} className="w-fit">
                            {algo.stable ? 'Stable' : 'Unstable'}
                          </Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <div className="mt-20 flex items-center justify-center">
        <Link
          to="/algorithm/bubble-sort"
          className="group flex items-center gap-2 rounded-lg border border-accent bg-accent px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Start with Bubble Sort
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

    </main>
  )
}

