import babel from "@rollup/plugin-babel"
import resolve from "rollup-plugin-node-resolve"
import { terser } from "rollup-plugin-terser"

const extensions = [".js", ".ts"]
const config = {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
  },
  plugins: [
    resolve({ extensions }),
    babel({ babelHelpers: "bundled", extensions, include: ["src/**/*"] }),
    terser(),
  ],
}

export default config
