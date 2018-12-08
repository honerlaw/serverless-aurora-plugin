import {IPluginOptions} from "./options";
import {Cluster} from "./resource/cluster";
import {VPC} from "./resource/vpc";

class ServerlessAuroraPlugin {

    private readonly serverless: any;
    private readonly hooks: {[key: string]: Function};

    constructor(serverless: any, options: any) {
        this.serverless = serverless;
        this.hooks = {
            'deploy:compileFunctions': this.compile.bind(this)
        }
    }

    private compile(): void {
        const service: any = this.serverless.service;
        const options: IPluginOptions = service.custom.aurora;
        const stage: string = service.provider ? service.provider.stage : service.stage;
        const vpc: VPC = new VPC(stage, options.vpc, "SAP");
        const cluster: Cluster = new Cluster(stage, options, "SAP", vpc);

        // merge all our stuff into resources
        Object.assign(
            this.serverless.service.provider.compiledCloudFormationTemplate.Resources,
            vpc.generate(),
            cluster.generate()
        );
    }

}

export = ServerlessAuroraPlugin;
