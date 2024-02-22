import { paths } from "@/types/generated-types";
import type { ParamsOption, RequestBodyOption } from "openapi-fetch";
import createClient from "openapi-fetch";

export type UseOpenApiQueryOptions<T, PData = object> = ParamsOption<T> &
  RequestBodyOption<T> & {
    // add your custom options here
    reactQuery?: {
      initialData?: PData | undefined;
    };
  };

const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  cache: "no-cache",
});

export { client };
