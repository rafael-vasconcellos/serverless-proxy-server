import { format } from 'url'
import { ExtendedRequest } from "./types";


export default async function handler(req: ExtendedRequest) { 
    let { hostname: queryHostname } = req.query ?? {}
    const { hostname: cookieHostname } = req.cookies ?? {}
    const headers = Object.fromEntries( 
        Object.entries(req.headers ?? {}).filter(([ key, value ]) => !['referer', 'host'].includes(key))
    ) as Record<string, any>
    const query = Object.fromEntries(
        Object.entries(req.query ?? {}).filter(([ key, value ]) => key!=='hostname')
    )
    queryHostname = queryHostname instanceof Array? queryHostname[0] : queryHostname
    const hostname = queryHostname ?? cookieHostname
    const pathname = req.url?.slice(0, req.url.indexOf('?'))
    const targetUrl = hostname? format({ 
        protocol: 'https',
        hostname,
        pathname,
        query
    }) : null

    if (!targetUrl) { return new Response(JSON.stringify({ 
        query: queryHostname,
        cookie: cookieHostname
    }), { status: 400 }) }
    const response = await fetch(targetUrl)
    return new Response(await response.text(), { 
        status: response.status,
        headers: { 
            ...Object.fromEntries(response.headers.entries()),
            "Set-Cookie": `hostname=${hostname}; Path=/`
        }
    })
}