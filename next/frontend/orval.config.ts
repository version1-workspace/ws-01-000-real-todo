import { defineConfig } from "orval"

export default defineConfig({
  realTodo: {
    input: {
      target: "../../api-spec/swagger.yaml",
    },
    output: {
      mode: "tags-split",
      target: "src/services/api/generated/index.ts",
      schemas: "src/services/api/generated/model",
      client: "fetch",
      clean: true,
      override: {
        mutator: {
          path: "./src/services/api/orval/mutator.ts",
          name: "customInstance",
        },
      },
    },
  },
})
