import type { AlgorithmMeta } from '../../types/index.ts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'

interface ComplexityTableProps {
  algorithm: AlgorithmMeta
}

export function ComplexityTable({ algorithm }: ComplexityTableProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <Table aria-label={`Complexity information for ${algorithm.name}`}>
        <caption className="sr-only">{algorithm.name} complexity</caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Case</TableHead>
            <TableHead scope="col">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Best</TableCell>
            <TableCell>
              <code className="font-mono text-[0.85em] text-bar-default">
                {algorithm.timeComplexity.best}
              </code>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Average</TableCell>
            <TableCell>
              <code className="font-mono text-[0.85em] text-bar-default">
                {algorithm.timeComplexity.average}
              </code>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Worst</TableCell>
            <TableCell>
              <code className="font-mono text-[0.85em] text-bar-default">
                {algorithm.timeComplexity.worst}
              </code>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Space</TableCell>
            <TableCell>
              <code className="font-mono text-[0.85em] text-bar-default">
                {algorithm.spaceComplexity}
              </code>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Stable</TableCell>
            <TableCell>{algorithm.stable ? 'Yes' : 'No'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">{algorithm.description}</p>
    </div>
  )
}

