import { format } from 'url'
import { ExtendedRequest } from "./types";


export default async function handler(req: ExtendedRequest) { 
    /* const headers: HeadersInit = Object.fromEntries( 
        Object.entries(req.headers ?? {}).filter(([ key, value ]) => !['referer', 'host'].includes(key))
    ) as Record<string, any> */
    const query = Object.fromEntries(
        Object.entries(req.query ?? {}).filter(([ key, value ]) => key!=='hostname')
    )
    let { hostname: queryHostname } = req.query ?? {}
    const { hostname: cookieHostname } = req.cookies ?? {}
    const refererHostname = req.headers.referer? 
        new URL(req.headers.referer).searchParams.get('hostname') : null
    queryHostname = queryHostname instanceof Array? queryHostname[0] : queryHostname
    const hostname = queryHostname ?? cookieHostname ?? refererHostname
    const pathname = req.url?.slice(0, req.url.indexOf('?'))
    const targetUrl = hostname? format({ 
        protocol: 'https',
        hostname,
        pathname,
        query
    }) : null

    if (!targetUrl) { return new Response(JSON.stringify({ 
        query: queryHostname,
        cookie: cookieHostname,
        referer: refererHostname
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