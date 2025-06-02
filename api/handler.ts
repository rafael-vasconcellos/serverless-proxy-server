import { format } from 'url'
import { ExtendedRequest } from "./types";


export function getHostname(req: ExtendedRequest) { 
    let { hostname: queryHostname } = req.query ?? {}
    const { hostname: cookieHostname } = req.cookies ?? {}
    const refererHostname = req.headers.referer? 
        new URL(req.headers.referer).searchParams.get('hostname') : null
    queryHostname = queryHostname instanceof Array? queryHostname[0] : queryHostname
    const hostname = queryHostname ?? cookieHostname ?? refererHostname
    return { hostname, queryHostname, cookieHostname, refererHostname }
}

export default async function handler(req: ExtendedRequest) { 
    /* const headers: HeadersInit = Object.fromEntries( 
        Object.entries(req.headers ?? {}).filter(([ key, value ]) => !['referer', 'host'].includes(key))
    ) as Record<string, any> */
    const query = Object.fromEntries(
        Object.entries(req.query ?? {}).filter(([ key, value ]) => key!=='hostname')
    )
    const { hostname, queryHostname, cookieHostname, refererHostname } = getHostname(req)
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


    const response = await fetch(targetUrl, { 
        headers: { 
            cookie: req.headers.cookie as string
        }
    })
    const proxyDomainName = req.hostname?.replace('www', '')
    const targetDomainName = hostname?.replace('www', '')
    const setCookieHeaders = response.headers.getSetCookie().map(cookie =>
        cookie.replace(targetDomainName, proxyDomainName)
    )
    const newHeaders = new Headers({ 
        "Content-Security-Policy": "default-src 'self'; script-src * 'unsafe-inline'; style-src * 'unsafe-inline'; img-src *; font-src *; connect-src *",
        "content-type": response.headers.get('content-type') ?? "text/plain",
        "content-length": response.headers.get('content-length') ?? "",
        "Set-Cookie": `hostname=${hostname}; Path=/`
    })
    setCookieHeaders.forEach(cookie => newHeaders.append("Set-Cookie", cookie))


    const responseEntity = new Response(response.body, { 
        status: response.status,
        headers: newHeaders
    })
    return responseEntity
}

/*
    const blacklisted_headers = [
        //'set-cookie', 'p3p', 'connection', 'keep-alive', 
        'content-encoding', 'transfer-encoding', 'strict-transport-security', 'content-security-policy'
    ]
*/