interface LayoutProps { 
    children: any
    title: string
}

export default function Layout({ children, title }: LayoutProps) { 
    return ( 
        <>
            <head>
                <meta charset="UTF-8" />
                <link rel="icon" type="image/svg+xml" href="/japanicon.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <link href="/home/output.css" rel="stylesheet"></link>
            </head>
            <body>
                {children}
                <script src="/home/index.js" type="module"></script>
            </body>
        </>
    )
}