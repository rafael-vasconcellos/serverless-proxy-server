import { JSX } from "solid-js/jsx-runtime"


export default function JapanLogo({ class: className }: JSX.SvgSVGAttributes<SVGSVGElement>) { 
    return ( 
        <svg class={className ?? "bg-white"} width="250.000000pt" height="168.000000pt"
        viewBox="0 0 250.000000 168.000000" preserveAspectRatio="xMidYMid meet" 
        version="1.0" xmlns="http://www.w3.org/2000/svg">
            <g fill="#c10007" transform="translate(0.000000,168.000000) scale(0.100000,-0.100000)" stroke="none">
                <path d="M1131 1284 c-212 -57 -355 -260 -338 -479 25 -331 376 -522 679 -369
                140 71 238 236 238 404 0 302 -287 523 -579 444z"/>
            </g>
        </svg>
    )
}