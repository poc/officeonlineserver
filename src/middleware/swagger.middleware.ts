import * as swagger from "swagger-express-ts";
import { SwaggerDefinitionConstant } from 'swagger-express-ts';
export class SwaggerMiddleware {
    static use(app: any) {
        app.use(swagger.express(
            {
              definition: {
                info: {
                  title: "My api",
                  version: "1.0"
                },
                externalDocs: {
                  url: "My url"
                },
                securityDefinitions : {
                  apiKeyHeader : {
                      type: SwaggerDefinitionConstant.Security.Type.API_KEY,
                      in: SwaggerDefinitionConstant.Security.In.HEADER,
                      name: "authorization"
                  }
              }
              }
            }
          ));
    }
}