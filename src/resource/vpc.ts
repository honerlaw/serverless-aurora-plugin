import {NamePostFix, Resource, ResourceValue} from "../resource";
import {IVPCCreateOptions, IVPCExistingOptions, IVPCOptions} from "../options";

export class VPC extends Resource<IVPCOptions> {

    private static isCreateOptions(options: IVPCOptions): options is IVPCCreateOptions {
        return 'cidr' in options && 'subnetCidrs' in options && !('name' in options) && !('subnetNames' in options);
    }

    private readonly subnetNames: string[];

    public constructor(stage: string, options: IVPCOptions, namePrefix: string) {
        super(stage, options, namePrefix);

        if (VPC.isCreateOptions(options)) {
            this.subnetNames = options.subnetCidrs
                .map((subnet: string, index: number): string => `${this.getName(NamePostFix.SUBNET_NAME)}${index}`);
        } else {
            this.subnetNames = options.subnetNames;
        }
    }

    public getSubnetNames(): string[] {
        return this.subnetNames;
    }

    public getName(postfix: NamePostFix): string {
        if (postfix === NamePostFix.VPC) {
            const options: IVPCOptions = this.options;
            if (!VPC.isCreateOptions(options)) {
                return options.name + this.stage;
            }
        }
        return super.getName(postfix);
    }

    public generate(): ResourceValue {
        const options: IVPCOptions = this.options;
        if (!VPC.isCreateOptions(options)) {
            return this.getCommonVPCResources(options);
        }

        return Object.assign({
                [this.getName(NamePostFix.VPC)]: {
                    "Type": "AWS::EC2::VPC",
                    "Properties": {
                        "EnableDnsSupport": true,
                        "EnableDnsHostnames": true,
                        "CidrBlock": options.cidr
                    }
                }
            },
            this.getCommonVPCResources(),
            ...options.subnetCidrs.map((subnetCidr: string, index: number): ResourceValue => {
                return {
                    [this.subnetNames[index]]: {
                        "Type": "AWS::EC2::Subnet",
                        "Properties": {
                            "AvailabilityZone": {
                                "Fn::Select": [
                                    index,
                                    {
                                        "Fn::GetAZs": {
                                            "Ref": "AWS::Region"
                                        }
                                    }
                                ]
                            },
                            "VpcId": {
                                "Ref": this.getName(NamePostFix.VPC)
                            },
                            "CidrBlock": subnetCidr,
                            "MapPublicIpOnLaunch": true
                        }
                    }
                }
            }));
    }

    private getCommonVPCResources(vpc?: IVPCExistingOptions): ResourceValue {
        return {
            [this.getName(NamePostFix.SECURITY_GROUP)]: {
                "Type": "AWS::EC2::SecurityGroup",
                "DependsOn": this.getName(NamePostFix.VPC),
                "Properties": {
                    "GroupDescription": "Security group for serverless aurora",
                    "VpcId": {
                        "Ref": this.getName(NamePostFix.VPC)
                    },
                    "SecurityGroupIngress": [
                        {
                            "CidrIp": "0.0.0.0/0",
                            "IpProtocol": -1,
                            "FromPort": 3306,
                            "ToPort": 3306
                        }
                    ]
                }
            },
            [this.getName(NamePostFix.SUBNET_GROUP)]: {
                "Type": "AWS::RDS::DBSubnetGroup",
                "Properties": {
                    "DBSubnetGroupDescription": "Subnet group for serverless aurora",
                    "SubnetIds": this.getSubnetNames().map((subnetName: string): ResourceValue => ({
                        "Ref": subnetName
                    }))
                }
            }
        };
    }

}