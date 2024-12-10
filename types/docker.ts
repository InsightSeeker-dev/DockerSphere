export interface Container {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Created: number;
  State: string;
  Status: string;
  Ports: Array<{
    IP?: string;
    PrivatePort: number;
    PublicPort?: number;
    Type: string;
  }>;
  Labels: { [key: string]: string };
  HostConfig: {
    NetworkMode: string;
  };
  NetworkSettings: {
    Networks: {
      [key: string]: {
        IPAddress: string;
        Gateway: string;
      };
    };
  };
}

export interface DockerImage {
  id: string;
  name: string;
  size: number;
  created: number;
  tags: string[];
}