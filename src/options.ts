export interface IVPCCreateOptions {
    cidr: string;
    subnetCidrs: string[];
}

export interface IVPCExistingOptions {
    name: string;
    subnetNames: string[];
}

// can either create a new vpc or use an existing vpc
export type IVPCOptions = IVPCExistingOptions | IVPCCreateOptions;

export interface IPluginOptions {
    username: string;
    password: string;
    identifier?: string; // defaults to AuroraClusterID{stage}
    backupRetentionPeriod?: number; // defaults to 7
    backupWindow?: string; // defaults to 1am - 2am utc
    maintenanceWindow?: string; // defaults to monday 3am - 4am utc
    minCapacity?: number; // default 0
    maxCapacity?: number; // default 2
    autoPause?: boolean; // default true
    autoPauseSeconds?: number; // default 5 min
    vpc: IVPCOptions;
}
