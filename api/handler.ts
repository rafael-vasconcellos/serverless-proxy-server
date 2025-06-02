import { format } from 'url'
import { ExtendedRequest } from "./types";


export default async function handler(req: ExtendedRequest) { 
    let { hostname: queryHostname } = req.query ?? {}
    const { hostname: cookieHostname } = req.cookies ?? {}
    const headers = Object.fromEntries( 
        Object.entries(req.headers ?? {}).filter(([ key, value ]) => !['referer'].includes(key))
    ) as Record<string, any>
    queryHostname = queryHostname instanceof Array? queryHostname[0] : queryHostname
    const hostname = queryHostname ?? cookieHostname
    const pathname = req.url
    const targetUrl = hostname? format({ 
        protocol: 'https',
        hostname,
        pathname
    }) : null

    if (!targetUrl) { return new Response(JSON.stringify({ 
        query: queryHostname,
        cookie: cookieHostname
    }), { status: 400 }) }
    const response = await fetch(targetUrl, { headers })
    return new Response(await response.text(), { 
        status: response.status,
        headers: { 
            ...Object.fromEntries(response.headers.entries()),
            "Set-Cookie": `hostname=${hostname}; Path=/`
        }
    })
}