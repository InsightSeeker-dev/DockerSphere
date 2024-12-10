export interface Container {
  Id: string;
  Names: string[];
  Image: string;
  State: string;
  Status: string;
  Created: number;
  NetworkSettings: {
    IPAddress: string;
    Ports: {
      [key: string]: Array<{
        HostIp: string;
        HostPort: string;
      }> | null;
    };
  };
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Port {
  PrivatePort: number;
  PublicPort: number;
  Type: string;
}

export interface NetworkInfo {
  IPAddress: string;
  Gateway: string;
  NetworkID: string;
}

export interface ContainerStats {
  cpu_percent: number;
  memory_usage: number;
  memory_limit: number;
  memory_percent: number;
  network_rx_bytes: number;
  network_tx_bytes: number;
}

export interface DockerImage {
  Id: string;
  ParentId: string;
  RepoTags: string[];
  RepoDigests: string[];
  Created: number;
  Size: number;
  VirtualSize: number;
  SharedSize: number;
  Labels: { [key: string]: string };
  Containers: number;
}