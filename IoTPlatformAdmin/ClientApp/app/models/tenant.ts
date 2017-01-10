export class Tenant {
    id: string;
    displayName: string;
    resources: Resources[];   
}


export class Resources {
    type: string;
    configuration: Configuration[];
}

export class Configuration {
    version: string;
    parameters: Parameters[]; 
    services: Services[];
    type: string;
}

export class Parameters {
    name: string;
    value: string;
    secret: boolean; 
}

export class Services {
    type: string;
    typename: string;
    minReplicaSetSize?: number;
    targetReplicaSetSize?: number;
    instanceCount?: number;
    name: string;
}

