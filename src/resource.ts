export type ResourceValue = { [key: string]: any };

export enum NamePostFix {
    DATABASE_CLUSTER = "DatabaseCluster",
    VPC = "VPC",
    SUBNET_NAME = "SubnetName",
    SUBNET_GROUP = "SubnetGroup",
    SECURITY_GROUP = "SecurityGroup",
}

export abstract class Resource<T> {

    protected readonly options: T;
    protected readonly stage: string;
    private readonly namePrefix: string | undefined;

    public constructor(stage: string, options: T, namePrefix?: string) {
        this.stage = stage;
        this.options = options;
        this.namePrefix = namePrefix;
    }

    public abstract generate(): ResourceValue;

    public getName(namePostFix: NamePostFix): string {
        if (this.namePrefix) {
            return this.namePrefix + namePostFix.toString() + this.stage;
        }
        return namePostFix + this.stage;
    }

}