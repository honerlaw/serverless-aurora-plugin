import {NamePostFix, Resource, ResourceValue} from "../resource";
import {IPluginOptions} from "../options";
import {VPC} from "./vpc";

export class Cluster extends Resource<IPluginOptions> {

    private readonly vpc: VPC;

    public constructor(stage: string, options: IPluginOptions, namePrefix: string, vpc: VPC) {
        super(stage, options, namePrefix);
        this.vpc = vpc;
    }

    public generate(): ResourceValue {
        return {
            [this.getName(NamePostFix.DATABASE_CLUSTER)]: {
                "Type": "AWS::RDS::DBCluster",
                "Properties": {
                    "Engine": this.options.engine || "aurora",
                    "EngineMode": "serverless",
                    "DBClusterIdentifier": this.options.identifier || "AuroraClusterID" + this.stage,
                    "MasterUsername": this.options.username,
                    "MasterUserPassword": this.options.password,
                    "BackupRetentionPeriod": this.options.backupRetentionPeriod || 7,
                    "PreferredBackupWindow": this.options.backupWindow || "01:00-02:00",
                    "PreferredMaintenanceWindow": this.options.maintenanceWindow || "mon:03:00-mon:04:00",
                    "ScalingConfiguration": {
                        "AutoPause": this.options.autoPause !== undefined ? this.options.autoPause : true,
                        "MinCapacity": this.options.minCapacity || 0,
                        "MaxCapacity": this.options.maxCapacity || 2,
                        "SecondsUntilAutoPause": this.options.autoPauseSeconds || 300
                    },
                    "DBSubnetGroupName": {
                        "Ref": this.vpc.getName(NamePostFix.SUBNET_GROUP)
                    },
                    "VpcSecurityGroupIds": [{
                        "Ref": this.vpc.getName(NamePostFix.SECURITY_GROUP)
                    }]
                }
            }
        };
    }

}
