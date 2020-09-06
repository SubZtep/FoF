import json from "@rollup/plugin-json"
import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"
import resolve from "rollup-plugin-node-resolve"

const extensions = [".js", ".ts"]
const plugins = [
  resolve({ extensions }),
  babel({
    babelHelpers: "bundled",
    extensions,
    include: ["src/**/*"],
  }),
  json(),
]
const output = {
  dir: "dist",
  format: "esm",
}

if (process.env.BUILD === "production") {
  plugins.push(terser())
}

const config1 = {
  input: "src/index.ts",
  output,
  plugins,
}

const config2 = {
  input: "src/workers/ground.ts",
  output,
  plugins,
}

export default [
  config1,
  // config2
]
