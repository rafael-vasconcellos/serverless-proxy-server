import { format } from 'url'
import { ExtendedRequest } from "./types";


export default async function handler(req: ExtendedRequest) { 
    const url = req.headers['referer']
    if (!url) { return new Response(null, { status: 400 }) }
    let { hostname: queryHostname } = req.query ?? {}
    const { hostname: cookieHostname } = req.cookies ?? {}
    const headers = Object.fromEntries( 
        Object.entries(req.headers ?? {}).filter(([ key, value ]) => !['referer'].includes(key))
    ) as Record<string, any>
    queryHostname = queryHostname instanceof Array? queryHostname[0] : queryHostname
    const hostname = queryHostname ?? cookieHostname
    const pathname = new URL(url).pathname
    const targetUrl = hostname? format({ 
        protocol: 'https',
        hostname,
        pathname
    }) : null

    if (pathname==="/") { return new Response('Hello World!', { status: 200 }) }
    if (!targetUrl) { return new Response(null, { status: 400 }) }
    const response = await fetch(targetUrl, { headers })
    return new Response(await response.text(), { 
        status: response.status,
        headers: { 
            ...Object.fromEntries(response.headers.entries()),
            "Set-Cookie": `hostname=${hostname}; Path=/`
        }
    })
}