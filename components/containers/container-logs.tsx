'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import {
  Download as DownloadIcon,
  RefreshCw as RefreshIcon,
  Search as SearchIcon,
  Clock as ClockIcon,
  AlertTriangle as WarningIcon,
  XCircle as ErrorIcon,
  Info as InfoIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Log {
  timestamp: string | null;
  message: string;
  type: 'info' | 'error';
}

interface ContainerLogsProps {
  containerId: string;
  containerName: string;
}

export function ContainerLogs({ containerId, containerName }: ContainerLogsProps) {
  const { toast } = useToast();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  async function fetchLogs() {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/containers/${containerId}/logs?timestamps=true&tail=1000`
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch logs');
      }

      const data = await response.json();
      setLogs(data.logs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      toast({
        title: 'Error',
        description: 'Failed to fetch container logs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();

    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [containerId, autoRefresh]);

  // Filtrer les logs
  const filteredLogs = logs.filter((log) =>
    log.message.toLowerCase().includes(filter.toLowerCase())
  );

  // Télécharger les logs
  const downloadLogs = () => {
    const content = filteredLogs
      .map((log) => `${log.timestamp || ''} ${log.message}`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${containerName}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Container Logs</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn({
              'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400':
                autoRefresh,
            })}
          >
            <RefreshIcon className="mr-1 h-4 w-4" />
            {autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}
          </Button>
          <Button variant="outline" size="sm" onClick={downloadLogs}>
            <DownloadIcon className="mr-1 h-4 w-4" />
            Download
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Filter logs..."
              className="pl-8"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="h-[500px] rounded-md border" ref={scrollAreaRef}>
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <RefreshIcon className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center space-y-2 p-4 text-center">
              <ErrorIcon className="h-8 w-8 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchLogs}>
                Try Again
              </Button>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-2 p-4 text-center">
              <InfoIcon className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500">No logs found</p>
            </div>
          ) : (
            <div className="space-y-1 p-4">
              {filteredLogs.map((log, index) => (
                <div
                  key={index}
                  className={cn('flex items-start space-x-2 rounded-md p-1', {
                    'bg-red-50 dark:bg-red-900/20': log.type === 'error',
                  })}
                >
                  {log.type === 'error' ? (
                    <ErrorIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  ) : (
                    <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    {log.timestamp && (
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <pre className="mt-1 whitespace-pre-wrap break-all text-sm">
                      {log.message}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}