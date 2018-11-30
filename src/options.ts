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
    backupRetentionPeriod?: number; // defaults to 7
    backupWindow?: string; // defaults to 1am - 2am utc
    maintenanceWindow?: string; // defaults to monday 3am - 4am utc
    vpc: IVPCOptions;
}
