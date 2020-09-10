import json from "@rollup/plugin-json"
import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"
import resolve from "rollup-plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import strip from "@rollup/plugin-strip"

const extensions = [".js", ".ts"]
const plugins = [
  resolve({ extensions }),
  replace({
    "//debug ": process.env.BUILD === "production" ? "//" : "",
    delimiters: ["", ""],
  }),
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
  plugins.push(strip(), terser())
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
