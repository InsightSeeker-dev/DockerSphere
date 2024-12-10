'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatBytes } from '@/lib/utils';

interface SystemMetrics {
  cpu: number;
  memory: {
    total: number;
    used: number;
    free: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
  };
}

export function SystemStats() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/admin/system');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch system metrics:', error);
      }
    }

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={metrics.cpu} />
            <p className="text-xs text-muted-foreground">
              {metrics.cpu.toFixed(1)}% utilized
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress
              value={(metrics.memory.used / metrics.memory.total) * 100}
            />
            <div className="text-xs text-muted-foreground">
              <p>{formatBytes(metrics.memory.used)} used</p>
              <p>{formatBytes(metrics.memory.total)} total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress
              value={(metrics.disk.used / metrics.disk.total) * 100}
            />
            <div className="text-xs text-muted-foreground">
              <p>{formatBytes(metrics.disk.used)} used</p>
              <p>{formatBytes(metrics.disk.total)} total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}