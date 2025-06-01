import Logo from "./Logo";


interface LogoProps { 
    iconColor?: string
    iconSize?: string
    textStyle?: string
}

export default function BigLogo({ iconColor, iconSize, textStyle }: LogoProps) { 

    return ( 
        <section class="flex items-center justify-center">
            <Logo color={iconColor ?? "fill-primary"} size={iconSize ?? "size-36 sm:size-64"} />
            <div class={`inter-logo w-fit ${textStyle ?? "text-zinc-500 text-nowrap text-5xl sm:text-7xl"}`}>
                Japanese Proxy
            </div>
        </section>
    )
}