# serverless-aurora-plugin

Generates a serverless aurora db instance either with a new vpc + subnets or an existing vpc + subnets.

#### Notes
- It is assumed the existing subnet + vpc are generated in the same serverless.yml file, it doesn't attempt to reference outputs from another CF template.
- This plugin only supports AWS

#### TODO
- Test / Write Tests
- Better TS Definitions
- Support referencing Outputs from another CF template

#### Options
```javascript
{
    username: string; // must be alphanumeric
    password: string; // must be at least 8 characters in length
    identifier?: string; // defaults to AuroraClusterID{stage}
    backupRetentionPeriod?: number; // defaults to 7
    backupWindow?: string; // defaults to 1am - 2am utc
    maintenanceWindow?: string; // defaults to monday 3am - 4am utc
    minCapacity?: number; // default 0
    maxCapacity?: number; // default 2
    autoPause?: boolean; // default true
    autoPauseSeconds?: number; // default 5 min
    vpc: {
        // both of these are required if create a new vpc
        cidr: string;
        subnetCidrs: string[];

        // both of these are required if using an existing vpc
        name: string;
        subnetNames: string[];
    };
}

```

#### Examples
```yaml
service: example-service

provider:
  name: aws
  region: us-east-1
  stage: example

plugins:
- serverless-aurora-plugin

custom:
  aurora:
    username: myawesomeusername
    password: myawesomepassword
    identifier: MyAwesomeIdentifier
    backupRetentionPeriod: 10 # keep backups for 10 days
    backupWindow: 03:00-04:00 # utc
    maintenanceWindow: mon:05:00-mon:06:00 # utc
    minCapacity: 4
    maxCapacity: 16
    autoPause: true
    autoPauseSeconds: 60 # 1 minute
    vpc:
      cidr: 10.0.0.0/16
      subnetCidrs:
      - 10.0.1.0/24
      - 10.0.2.0/24
      name: MyExistingVPC
      subnetName:
      - MyExistingSubnetOneInVPC
      - MyExistingSubnetTwoInVPC
```
