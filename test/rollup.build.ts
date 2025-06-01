import nodeResolve from "@rollup/plugin-node-resolve";
import common from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import typescript from '@rollup/plugin-typescript';


export default [
  {
    input: "./build/test.jsx",
    output: [
      {
        dir: "./build/dist",
        format: "esm"
      }
    ],
    external: ["solid-js", "solid-js/web"],
    plugins: [
      //typescript(),
      nodeResolve({ preferBuiltins: true, exportConditions: ["solid", "node"] }),
      babel({
        babelHelpers: "bundled",
        presets: [["solid", { generate: "ssr", hydratable: true }]]
      }),
      common()
    ]
  }
];