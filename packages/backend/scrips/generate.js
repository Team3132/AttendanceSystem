// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { generate: openApiGenerate } = require('openapi-typescript-codegen');

async function generate() {
  const tbaOpenApiRef = 'https://thebluealliance.com/swagger/api_v3.json';

  const fetchedRef = await fetch(tbaOpenApiRef).then((res) => res.json());

  await openApiGenerate({
    input: fetchedRef,
    output: './tbaApi',
    clientName: 'TBAApi',
    exportCore: true,
    exportModels: true,
    exportSchemas: false,
    exportServices: true,
  });
}
generate();
