import { format } from 'url'
import { ExtendedRequest } from "./types";


export default async function handler(req: ExtendedRequest) { console.log(req.url)
    if (!req.url) { return new Response(null, { status: 400 }) }
    let { hostname: queryHostname } = req.query ?? {}
    const { hostname: cookieHostname } = req.cookies ?? {}
    const headers = Object.fromEntries( 
        Object.entries(req.headers ?? {}).filter(([ key, value ]) => !(key in ['referer']))
    ) as Record<string, any>
    queryHostname = queryHostname instanceof Array? queryHostname[0] : queryHostname
    const hostname = queryHostname ?? cookieHostname
    const pathname = new URL(req.url).pathname
    const url = hostname? format({ 
        protocol: 'https',
        hostname,
        pathname
    }) : null

    if (!url) { return new Response(null, { status: 400 }) }
    const response = await fetch(url, { headers })
    response.headers.append(
        "Set-Cookie",
        `hostname=${hostname}; Path=/`
    );
    return response
}