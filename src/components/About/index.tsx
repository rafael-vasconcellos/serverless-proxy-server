import ProxyIcon from "../ProxyIcon.jsx";
import AboutCard from "./Card.jsx";


export default function About() { 
    const title = `Access Any Website from Japan – Bypass Geo-Restrictions Instantly.`
    const content = `Welcome to your ultimate solution for bypassing region-based restrictions — a fast, reliable proxy service that connects you to any website through a server located in Japan. Whether you're trying to access streaming platforms, news sites, social media, or any region-locked content, our Japan-based proxy makes it simple and secure.

Just enter the URL of the site you want to visit into the field above, and our system will route your connection through a Japanese server. This makes it appear as if you're browsing directly from Japan, helping you bypass firewalls, censorship, and geographic filters effortlessly. No software installation or registration required — everything works directly from your browser.

Our service is especially useful for accessing content that's exclusive to Japanese users, testing how your website appears to users in Japan, or simply enhancing your online privacy. With end-to-end encryption and anonymous browsing, your activity remains secure and private.

Whether you're an international user wanting to explore Japanese digital content or a developer conducting regional testing, our proxy tool offers a seamless experience with minimal latency and maximum compatibility. Enjoy fast load times, responsive design, and full access to content that may otherwise be blocked in your region.

Start exploring the web without borders — powered by our Japan-based proxy service.`

    return ( 
        <AboutCard title={title} content={content}>
            <ProxyIcon color={"fill-primary"} size={"size-48"} />
        </AboutCard>
    )
}