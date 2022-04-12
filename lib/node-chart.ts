import * as cdk8s from 'cdk8s';
import * as constructs from 'constructs';
import * as kplus from 'cdk8s-plus-21';
import { KubeIngress } from '../imports/k8s'

export class NodeChart extends cdk8s.Chart {
    constructor(
        scope: constructs.Construct,
        id: string,
    ) {
        super(scope, id);

        const helloDeployment = new kplus.Deployment(this, "deployment", {
            replicas: 3,
        });
        helloDeployment.addContainer({
            image: '368521843268.dkr.ecr.eu-west-1.amazonaws.com/node_js_hello_world_container',
            port: 3000,
        })

        const helloService = new kplus.Service(this, "service", {
            type: kplus.ServiceType.LOAD_BALANCER,
            ports: [{
                name: 'http',
                port: 80,
                targetPort: 3000,
                protocol: kplus.Protocol.TCP,
            }],
        })

        // Working
        // const service = helloDeployment.exposeViaService({
        //     port: 80,
        //     protocol: kplus.Protocol.TCP,
        //     serviceType: kplus.ServiceType.LOAD_BALANCER,
        // });

        const ingress = new KubeIngress(this, "ingress", {
            spec: {
                defaultBackend: {
                    service: {
                        name: helloService.name,
                        port: {
                            number: 80,
                        }
                    }
                }
            }
        });

        // Not working due to li internal error
        // const service = helloDeployment.exposeViaIngress("/", {
        //     name: "node-ingress",
        //     port: 80,
        //     protocol: kplus.Protocol.TCP,
        //     serviceType: kplus.ServiceType.LOAD_BALANCER,
        //     targetPort: 3000,
        //     ingress
        // })



        // const ingress = new kplus.IngressV1Beta1(this, "ingress");
        // ingress.addDefaultBackend(kplus.IngressV1Beta1Backend.fromService(service))

    }
}