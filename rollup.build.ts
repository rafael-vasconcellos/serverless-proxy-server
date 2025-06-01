import fs from 'fs'
import path from 'path';
import nodeResolve from "@rollup/plugin-node-resolve";
import common from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import type { ModuleFormat } from "rollup";
import { rollup } from "rollup";
import { renderToString } from "solid-js/web";
import requireFromString from 'require-from-string';
import typescript from '@rollup/plugin-typescript';
import { spawn } from 'child_process';



function buildRollupOptions(dir: string, generate = "ssr", options: any[] = []): any[] { 
    const dirContents = fs.readdirSync(dir);
    let targetFile: string | undefined = generate==="ssr"? 'index' : 'page'
    targetFile = dirContents.find(content => content.startsWith(targetFile as string))
    const cssFile = dirContents.find(content => content.endsWith('.css'))
    if (targetFile) { 
        const contentPath = path.join(dir, targetFile)
        options.push( getRollupOption(contentPath, generate) )
    }
    if (cssFile) { 
        const contentPath = path.join(dir, cssFile)
        writeCss(contentPath)
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

function getRollupOption(srcPath: string, generate: string = 'ssr') { 
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
                extensions: [".js", ".jsx", ".ts", ".tsx"],
                exportConditions: ["solid", 
                    //"node", "browser", "default"
                ],
            }), 
            srcPath.includes('tsx')? typescript({ jsx: 'preserve' }) : '', 
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

async function getCodeString(option: any, format: ModuleFormat  = "cjs") { 
    const bundle = await rollup(option)
    const { output } = await bundle.generate({ format });
    const code = output[0].code;
    return code
}

function writeFile(pathString: string, data: any) { 
    const dirname = path.dirname(pathString)
    if (!fs.existsSync(dirname)) { 
        return fs.mkdir(dirname, { recursive: true }, (err) => { 
            if (err) { return console.log(err) }
            fs.writeFileSync(pathString, data)
        }) 
    }
    fs.writeFileSync(pathString, data)
}

function writeCss(srcPath: string) { 
    const { dir } = getRollupOption(srcPath)?.output?.[0] ?? {}
    return spawn('npx', [ 
            '@tailwindcss/cli',
            '-i', srcPath,
            '-o', path.join(dir, 'style.css'), 
        ], {
            stdio: 'inherit', // redireciona stdout/stderr do filho para o console principal
            shell: true // necessário para que o comando 'npx' funcione corretamente no Windows
        }
    )
}

async function main() { 
    const ssrOptions = buildRollupOptions('./src/pages', "ssr")
    const domOptions = buildRollupOptions('./src/pages', "dom")
    for (let i=0; i<ssrOptions.length; i++) { 
        const ssrOption = ssrOptions[i]
        const domOption = domOptions[i]
        const outputPath: string = ssrOption.input.replace('src\\pages', 'public')
        const fileExtension = '.' + outputPath.split('.').at(-1)
        const ssrCode = await getCodeString(ssrOption)
        const ssrComponent = requireFromString(ssrCode, { 
            prependPaths: [import.meta.url + '/node_modules']
        })
        writeFile(outputPath.replace(fileExtension, '.html'), renderToString(ssrComponent))
        const domCode = await getCodeString(domOption, "esm")
        writeFile(outputPath.replace(fileExtension, '.js'), domCode)
    }
}

main()