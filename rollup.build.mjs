import fs from 'fs'
import path from 'path';
import nodeResolve from "@rollup/plugin-node-resolve";
import common from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { rollup } from "rollup";
import { renderToString } from "solid-js/web";
import requireFromString from 'require-from-string';
import typescript from '@rollup/plugin-typescript';

const tsconfig = JSON.parse(fs.readFileSync('./tsconfig.json'))


function buildFiles(dir, options = []) { 
    const dirContents = fs.readdirSync(dir);
    if (dirContents.some(content => content.startsWith('layout'))) { 
        const contentPath = path.join(dir, 'layout.jsx')
        options.push( getRollupOptions(contentPath) )
    }
    else if (dirContents.some(content => content.startsWith('index'))) { 
        const contentPath = path.join(dir, 'index.jsx')
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
            typescript(tsconfig),
            nodeResolve({ preferBuiltins: true, exportConditions: ["solid", "node"] }),
            babel({
                babelHelpers: "bundled",
                presets: [["solid", { generate: "ssr", hydratable: true }]]
            }),
            common(),
        ]
    }
}

async function main() { 
    const options = buildFiles('./src/pages')
    for (const option of options) { 
        const outputPath = option.input.replace('.jsx', '.html').replace('src\\pages', 'public')
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