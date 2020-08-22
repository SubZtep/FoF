import json from "@rollup/plugin-json"
import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"
import resolve from "rollup-plugin-node-resolve"

const extensions = [".js", ".ts"]
const config = {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
  },
  plugins: [resolve({ extensions }), babel({ babelHelpers: "bundled", extensions, include: ["src/**/*"] }), json()],
}

if (process.env.BUILD === "production") {
  config.plugins.push(terser())
}

export default config
