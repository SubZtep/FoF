import json from "@rollup/plugin-json"
import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"
import resolve from "rollup-plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import strip from "@rollup/plugin-strip"
import commonjs from "@rollup/plugin-commonjs"
import html from "@open-wc/rollup-plugin-html"
import pug from "pug"

const isProd = process.env.NODE_ENV === "production"
const extensions = [".js", ".ts"]

const plugins = [
  resolve({ extensions }),
  replace({
    "//debug ": process.env.NODE_ENV === "production" ? "//" : "",
    delimiters: ["", ""],
  }),
  babel({
    babelHelpers: "bundled",
    extensions,
    include: ["src/**/*"],
  }),
  json(),
  commonjs({
    //exclude: /node_modules/
  }),
  html({
    inject: false,
    template: ({ bundle }) =>
      pug
        .compileFile("src/template.pug", { pretty: !isProd })()
        .replace(
          "<!-- bundle-->",
          bundle.entrypoints.map(({ importPath }) => `<script type="module" src="${importPath}"></script>`)
        ),
    minify: isProd,
  }),
]

const output = {
  dir: "dist",
  format: "esm",
}

if (isProd) {
  plugins.push(strip(), terser())
}

const configMain = {
  input: "src/index.ts",
  output,
  plugins,
}

export default [configMain]
