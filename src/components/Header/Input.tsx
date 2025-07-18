import { createEffect } from 'solid-js'


export default function Input() { 
	let input: HTMLInputElement = undefined as any

	function search() { //console.log('dada')
		const input = document.querySelector('header input[type=search]') as HTMLInputElement
		if (input?.value) { 
			const targetUrlString = input.value
			const targetUrl = new URL(targetUrlString)
			targetUrl.searchParams.append('hostname', targetUrl.hostname)
			location.assign(targetUrl.pathname + targetUrl.search)
		}
	}

	createEffect(() => { 
		document.querySelector('header input[type=search]')?.addEventListener('search', search)
		document.querySelector('header input[type=search] ~ button')?.addEventListener('click', search)
	})


    return (
        <section class="flex gap-3 items-center flex-responsive">
			<input ref={input} class="w-80 px-5 py-3 rounded-full bg-transparent border border-zinc-500 text-zinc-400 outline-0"
			 type="search" placeholder="Insert your website here." />
			<button onClick={search} class="w-fit px-5 py-3 rounded-full border border-primary text-primary cursor-pointer hover:bg-primary hover:text-white">
				Search
			</button>
		</section>
    )
}