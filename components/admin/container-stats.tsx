'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBytes } from '@/lib/utils';

interface ContainerMetrics {
  id: string;
  name: string;
  cpu: number;
  memory: {
    usage: number;
    limit: number;
  };
  network: {
    rx_bytes: number;
    tx_bytes: number;
  };
}

export function ContainerStats() {
  const [metrics, setMetrics] = useState<ContainerMetrics[]>([]);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/admin/containers/stats');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch container metrics:', error);
      }
    }

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Container Resource Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Container</TableHead>
              <TableHead>CPU</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead>Network I/O</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((container) => (
              <TableRow key={container.id}>
                <TableCell className="font-medium">
                  {container.name}
                </TableCell>
                <TableCell>{container.cpu.toFixed(1)}%</TableCell>
                <TableCell>
                  {formatBytes(container.memory.usage)} /{' '}
                  {formatBytes(container.memory.limit)}
                </TableCell>
                <TableCell>
                  ↓ {formatBytes(container.network.rx_bytes)}/s
                  <br />
                  ↑ {formatBytes(container.network.tx_bytes)}/s
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}