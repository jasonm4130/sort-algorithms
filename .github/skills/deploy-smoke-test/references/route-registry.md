# Route Registry

All routes that must pass the deploy smoke test.

## Static routes
- `/` — Home page with algorithm grid

## Algorithm visualizer routes
- `/algorithm/bubble-sort`
- `/algorithm/selection-sort`
- `/algorithm/insertion-sort`
- `/algorithm/merge-sort`
- `/algorithm/quick-sort`
- `/algorithm/heap-sort`
- `/algorithm/shell-sort`
- `/algorithm/tim-sort`
- `/algorithm/counting-sort`
- `/algorithm/radix-sort`
- `/algorithm/bucket-sort`
- `/algorithm/bogo-sort`

## Notes
- Add new algorithm routes here when registering in `src/constants/algorithms.ts`
- The smoke test iterates this list programmatically
