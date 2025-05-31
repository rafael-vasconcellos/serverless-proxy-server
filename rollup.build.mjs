import fs from 'fs'
import path from 'path';
import nodeResolve from "@rollup/plugin-node-resolve";
import common from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { rollup } from "rollup";
import { renderToString } from "solid-js/web";
import requireFromString from 'require-from-string';
import typescript from '@rollup/plugin-typescript';



function buildFiles(dir, options = []) { 
    const dirContents = fs.readdirSync(dir);
    if (dirContents.some(content => content.startsWith('layout'))) { 
        const contentPath = path.join(dir, 'layout.tsx')
        options.push( getRollupOptions(contentPath) )
    }
    else if (dirContents.some(content => content.startsWith('index'))) { 
        const contentPath = path.join(dir, 'index.tsx')
        options.push( getRollupOptions(contentPath) )
    }
    for (const content of dirContents) {
        const contentPath = path.join(dir, content);
        const stats = fs.statSync(contentPath);

        if (stats.isDirectory()) {
            buildFiles(contentPath, options)
        }
    }

    return options
}

function getRollupOptions(srcPath) { 
    const outputDir = path.dirname(srcPath).replace('src\\pages', 'public')

    return {
        input: srcPath,
        output: [
            {
                dir: outputDir,
                format: "esm"
            }
        ],
        external: ["solid-js", "solid-js/web"],
        plugins: [ 
            nodeResolve({ preferBuiltins: true, exportConditions: ["solid", "node"] }), 
            common(), 
            typescript({ jsx: 'preserve' }), 
            babel({
                babelHelpers: "bundled",
                extensions: [".js", ".jsx", ".ts", ".tsx"],
                presets: [ 
                    ['@babel/preset-typescript', { isTsx: true }], 
                    ["solid", { generate: "ssr", hydratable: true }], 
                ]
            }), 
        ]
    }
}

async function main() { 
    const options = buildFiles('./src/pages')
    for (const option of options) { 
        const outputPath = option.input.replace('.tsx', '.html').replace('src\\pages', 'public')
        const bundle = await rollup(option)
        const { output } = await bundle.generate({ format: 'cjs' });
        const code = output[0].code;
        const Home = requireFromString(code, { 
            prependPaths: [import.meta.url + '/node_modules']
        })
        fs.writeFileSync(outputPath, renderToString(Home))
    }
}

main()