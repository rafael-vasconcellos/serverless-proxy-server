import fs from 'fs'
import path from 'path';
import nodeResolve from "@rollup/plugin-node-resolve";
import common from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { rollup } from "rollup";
import { renderToString } from "solid-js/web";
import requireFromString from 'require-from-string';
import typescript from '@rollup/plugin-typescript';



function buildRollupOptions(dir, generate = "ssr", options = []) { 
    const dirContents = fs.readdirSync(dir);
    const targetFile = generate==="ssr"? 'index' : 'page'
    if (dirContents.some(content => content.startsWith(targetFile))) { 
        const contentPath = path.join(dir, targetFile + '.tsx')
        options.push( getRollupOption(contentPath, generate) )
    }
    for (const content of dirContents) { 
        const contentPath = path.join(dir, content);
        const stats = fs.statSync(contentPath);

        if (stats.isDirectory()) {
            buildRollupOptions(contentPath, generate, options)
        }
    }

    return options
}

function getRollupOption(srcPath, generate) { 
    const outputDir = path.dirname(srcPath).replace('src\\pages', 'public')

    return {
        input: srcPath,
        output: [
            {
                dir: outputDir,
                format: "esm"
            }
        ],
        external: generate==="ssr"? ["solid-js", "solid-js/web", "path", "express", "stream"] : undefined,
        plugins: [ 
            nodeResolve({
                /* preferBuiltins: true,
                moduleDirectories: ["node_modules"], */
                exportConditions: ["solid", 
                    //"node", "browser", "default"
                ],
            }), 
            typescript({ jsx: 'preserve' }), 
            babel({
                babelHelpers: "bundled",
                extensions: [".js", ".jsx", ".ts", ".tsx"],
                presets: [ 
                    //['@babel/preset-typescript', { isTsx: true }], 
                    ["solid", { generate, hydratable: true }], 
                ]
            }), 
            common(), 
        ], 
        preserveEntrySignatures: generate==='ssr'? true : false,
    }
}

async function getCodeString(option, format = "cjs") { 
    const bundle = await rollup(option)
    const { output } = await bundle.generate({ format });
    const code = output[0].code;
    return code
}

function writeFile(pathString, data) { 
    const dirname = path.dirname(pathString)
    if (!fs.existsSync(dirname)) { 
        return fs.mkdir(dirname, { recursive: true }, (err) => { 
            if (err) { return console.log(err) }
            fs.writeFileSync(pathString, data)
        }) 
    }
    fs.writeFileSync(pathString, data)
}

async function main() { 
    const ssrOptions = buildRollupOptions('./src/pages', "ssr")
    const domOptions = buildRollupOptions('./src/pages', "dom")
    for (let i=0; i<ssrOptions.length; i++) { 
        const ssrOption = ssrOptions[i]
        const domOption = domOptions[i]
        const outputPath = ssrOption.input.replace('src\\pages', 'public')
        const ssrCode = await getCodeString(ssrOption)
        const ssrComponent = requireFromString(ssrCode, { 
            prependPaths: [import.meta.url + '/node_modules']
        })
        writeFile(outputPath.replace('.tsx', '.html'), renderToString(ssrComponent))
        const domCode = await getCodeString(domOption, "esm")
        writeFile(outputPath.replace('.tsx', '.js'), domCode)
    }
}

main()