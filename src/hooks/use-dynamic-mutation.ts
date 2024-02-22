import { useMutation } from "@tanstack/react-query";
import type { FetchResponse } from "openapi-fetch";
import type { HttpMethod, PathsWithMethod } from "openapi-typescript-helpers";
import type { UseOpenApiQueryOptions } from "../lib/api-client";
import { client } from "../lib/api-client";
import { paths } from "@/types/generated-types";

type HttpMutationMethod = Extract<
  HttpMethod,
  "post" | "put" | "patch" | "delete"
>;

export function useDynamicMutation<
  T extends HttpMutationMethod,
  P extends PathsWithMethod<paths, T>
>(
  method: T,
  url: P,
  options?: UseOpenApiQueryOptions<
    T extends keyof paths[P] ? paths[P][T] : unknown
  >
) {
  return useMutation<
    // @ts-expect-error It does return the correct type
    FetchResponse<T extends keyof paths[P] ? paths[P][T] : unknown>["data"],
    // @ts-expect-error It does return the correct type
    FetchResponse<T extends keyof paths[P] ? paths[P][T] : unknown>["error"],
    UseOpenApiQueryOptions<T extends keyof paths[P] ? paths[P][T] : unknown>
  >({
    ...options?.reactQuery,
    mutationKey: [url, options?.body, options?.params],
    mutationFn: async (vars) => {
      // @ts-expect-error It does return the correct type
      const { data, error } = await client[method.toUpperCase()](url, {
        ...vars,
      });
      if (error) throw new Error(error as string | undefined);

      // @ts-expect-error It does return the correct type
      return data as FetchResponse<
        T extends keyof paths[P] ? paths[P][T] : unknown
      >["data"];
    },
  });
}
