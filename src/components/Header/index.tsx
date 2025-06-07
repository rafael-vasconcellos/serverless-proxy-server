import BigLogo from "./BigLogo.jsx";
import Input from "./Input.jsx";


export default function Header() {
    return (
        <header class="h-screen py-10 flex flex-col items-center gap-8">
            <BigLogo />
            <Input />
        </header>
    )
}