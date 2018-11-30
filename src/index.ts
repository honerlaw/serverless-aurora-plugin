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
        const options: IPluginOptions = this.serverless.service.custom.aurora;
        const vpc: VPC = new VPC(options.vpc, "SAP");
        const cluster: Cluster = new Cluster(options, "SAP", vpc);

        // merge all our stuff into resources
        Object.assign(
            this.serverless.service.provider.compiledCloudFormationTemplate.Resources,
            vpc.generate(),
            cluster.generate()
        );
    }

}

export = ServerlessAuroraPlugin;
