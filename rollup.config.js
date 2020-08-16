import babel from "@rollup/plugin-babel"
import resolve from "rollup-plugin-node-resolve"

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
  ],
}

export default config
