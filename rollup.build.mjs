import fs from 'fs'
import path from 'path';
import nodeResolve from "@rollup/plugin-node-resolve";
import common from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { rollup } from "rollup";
import { renderToString } from "solid-js/web";
import requireFromString from 'require-from-string';
import typescript from '@rollup/plugin-typescript';
import { spawn } from 'child_process';



async function buildRollupOptions(dir, generate = "ssr", options = []) { 
    const dirContents = fs.readdirSync(dir);
    let targetFile = generate==="ssr"? 'index' : 'page'
    targetFile = dirContents.find(content => content.startsWith(targetFile))
    const cssFile = dirContents.find(content => content.endsWith('.css'))
    if (targetFile) { 
        const contentPath = path.join(dir, targetFile)
        options.push( getRollupOption(contentPath, generate) )
    }
    if (cssFile) { 
        const contentPath = path.join(dir, cssFile)
        await writeCss(contentPath)
    }
    for (const content of dirContents) { 
        const contentPath = path.join(dir, content);
        const stats = fs.statSync(contentPath);

        if (stats.isDirectory()) {
            await buildRollupOptions(contentPath, generate, options)
        }
    }

    return options
}

function getRollupOption(srcPath, generate = 'ssr') { 
    const outputDir = path.dirname(srcPath).replace(`src${path.sep}pages`, 'public')

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
            srcPath.includes('tsx')? typescript({ jsx: 'preserve', module: 'esnext' }) : '', 
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
    console.log('Writed file in: ' + pathString)
}

function writeCss(srcPath) { 
    const { dir } = getRollupOption(srcPath)?.output?.[0] ?? {}
    const child = spawn('npx', [ 
            '@tailwindcss/cli',
            '-i', srcPath,
            '-o', path.join(dir, 'output.css'), 
        ], {
            stdio: 'inherit', // redireciona stdout/stderr do filho para o console principal
            shell: true, // necessário para que o comando 'npx' funcione corretamente no Windows
            
        }
    )
    const { promise, resolve, reject } = Promise.withResolvers();
    child.on('close', (code, signal) => { console.log('Builded css file in: ' + path.join(dir, 'style.css'))
        resolve(child)
    })
    return promise
}

async function main() { 
    const ssrOptions = await buildRollupOptions('./src/pages', "ssr")
    const domOptions = await buildRollupOptions('./src/pages', "dom")
    for (let i=0; i<ssrOptions.length; i++) { 
        const ssrOption = ssrOptions[i]
        const domOption = domOptions[i]
        const outputPath = ssrOption.input.replace(`src${path.sep}pages`, 'public')
        const fileExtension = '.' + outputPath.split('.').at(-1)
        const ssrCode = await getCodeString(ssrOption)
        const ssrComponent = requireFromString(ssrCode, { 
            prependPaths: [import.meta.url + '/node_modules']
        })
        writeFile(outputPath.replace(fileExtension, '.html'), renderToString(ssrComponent))
        const domCode = await getCodeString(domOption, "esm")
        writeFile(outputPath.replace(fileExtension, '.js'), domCode)
    }

    //fs.cp('./public', './dist/public', { recursive: true }, ()=>{})
    fs.cp('./api', './netlify/functions', { recursive: true }, ()=>{})
}

main().then(response => { 
    console.log({ 
        root: fs.readdirSync('.'),
        ".vercel": fs.existsSync('./.vercel')? fs.readdirSync('./.vercel') : undefined
    })
})