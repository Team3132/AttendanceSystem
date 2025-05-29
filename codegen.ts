import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3000/query",
  documents: ["src/**/*.gql", "src/**/*.graphql"],
  generates: {
    "./src/gql/index.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        useTypeImports: true,
        rawRequest: true,
        documentMode: "string",
      },
    },
  },
};
export default config;
