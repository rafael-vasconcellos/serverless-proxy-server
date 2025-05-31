import { IncomingMessage } from "http";


export type ExtendedRequest = IncomingMessage & {
    query: Record<string, string | string[]>;
    cookies: Record<string, string>;
    body: any;
}