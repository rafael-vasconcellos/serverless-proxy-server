import { createEffect } from 'solid-js'


export default function Input() { 
	let input: HTMLInputElement = undefined as any

	function search() { 
		if (input?.value) { 
			const targetUrlString = input.value
			const targetUrl = new URL(targetUrlString)
			location.assign(targetUrl.pathname + `?hostname=${targetUrl.hostname}`)
		}
	}

	createEffect(() => { 
		input?.addEventListener('search', search)
	})


    return (
        <section class="flex gap-3 items-center flex-responsive">
			<input class="w-80 px-5 py-3 rounded-full bg-transparent border border-zinc-500 text-zinc-400 outline-0" ref={input}
			 type="search" placeholder="Insert your website here." />
			<button class="w-fit px-5 py-3 rounded-full border border-primary text-primary cursor-pointer hover:bg-primary hover:text-white" onClick={search}>
				Search
			</button>
		</section>
    )
}