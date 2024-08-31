import * as fs from "fs";
import path from "path";

function extractServicesFromFile(filePath: string): string[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const regex =
    /new InterfaceVpcEndpointAwsService\('([^']+)'(?:,\s*'([^']+)')?\)/g;
  const services: string[] = [];
  let match;

  while ((match = regex.exec(fileContent)) !== null) {
    const serviceName = match[2] ? `${match[2]}.${match[1]}` : match[1];
    services.push(serviceName);
  }

  return services;
}

function extractServicesFromCLI(cliOutput: string[]): string[] {
  const normalizedServices = cliOutput.map((service) =>
    service
      .replace(/^com\.amazonaws\.us-east-1\./, "")
      .replace(/us-east-1\./, "")
  );
  return normalizedServices;
}

function findMissingServices(
  fileServices: string[],
  cliServices: string[]
): string[] {
  const missing = cliServices.filter(
    (service) => !fileServices.includes(service)
  );
  return missing;
}

function saveResultToJson(filePath: string, data: any) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData, "utf-8");
  console.log(`Results saved to ${filePath}`);
}

const filePath = './aws-cdk/packages/aws-cdk-lib/aws-ec2/lib/vpc-endpoint.ts'
const outputFilePath = "./missing_services.json";
const cliOutput = JSON.parse(fs.readFileSync('./cli_output.json', 'utf-8'));

// Extract services from file
const fileServices = extractServicesFromFile(filePath);

// Extract services from CLI output
const cliServices = extractServicesFromCLI(cliOutput);

// Find missing services
const missingServices = findMissingServices(fileServices, cliServices);

// Output the result
console.log("Missing services:", missingServices);
saveResultToJson(
  path.join(__dirname, outputFilePath),
  missingServices
);
