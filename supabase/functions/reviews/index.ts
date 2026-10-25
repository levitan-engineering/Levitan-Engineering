import { createHandler } from "./handler.ts";
Deno.serve(createHandler({ env: Deno.env }));
