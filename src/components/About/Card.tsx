import { JSXElement } from "solid-js"


export interface LogoSVGProps { 
    size?: string
    color?: string
}

export interface GCardProps { 
    lang?: string | null
}

export type Lang = "pt_BR" | "en_US"

interface CardProps { 
    title: string
    content: string
    children?: JSXElement
}

export default function AboutCard({ title, content, children }: CardProps) { 
    return ( 
        <section class="card bg-neutral-950 w-full py-2 flex gap-10 flex-responsive justify-center items-center">
            {children}
            <div class="w-1/2 flex flex-col items-center">
                <h2 class="text-zinc-500 text-3xl font-medium w-fit py-4">{title}</h2>
                <p class="pb-6 text-zinc-300">{content}</p>
            </div>
        </section>
    )
}