import { useQuery } from "@tanstack/react-query";
import type { FetchOptions, FetchResponse } from "openapi-fetch";
import type { HttpMethod, PathsWithMethod } from "openapi-typescript-helpers";
import { client, type UseOpenApiQueryOptions } from "../lib/api-client";
import { paths } from "@/types/generated-types";

type HttpSafeMethod = Extract<
  HttpMethod,
  "get" | "delete" | "options" | "head" | "trace"
>;

export async function getDynamicQuery<
  T extends HttpSafeMethod,
  P extends PathsWithMethod<paths, T>
>(
  method: T,
  url: P,
  options?: UseOpenApiQueryOptions<
    T extends keyof paths[P] ? paths[P][T] : unknown
  >,
  fetchOptions?: FetchOptions<T extends keyof paths[P] ? paths[P][T] : unknown>,
  signal?: AbortSignal
): Promise<
  FetchResponse<
    T extends keyof paths[P] ? paths[P][T] : unknown,
    T extends keyof paths[P] ? paths[P][T] : unknown
  >["data"]
> {
  // @ts-expect-error It does return the correct type
  const { data, error } = await client[method.toUpperCase()](url, {
    ...options,
    signal,
    ...fetchOptions,
  });

  if (error) {
    throw new Error(error as string);
  }

  return data;
}

export function useDynamicQuery<
  T extends HttpSafeMethod,
  P extends PathsWithMethod<paths, T>
>(
  method: T,
  url: P,
  options?: UseOpenApiQueryOptions<
    T extends keyof paths[P] ? paths[P][T] : unknown,
    FetchResponse<
      T extends keyof paths[P] ? paths[P][T] : unknown,
      T extends keyof paths[P] ? paths[P][T] : unknown
    >["data"]
  >
) {
  return useQuery<
    UseOpenApiQueryOptions<T extends keyof paths[P] ? paths[P][T] : unknown>,
    FetchResponse<
      T extends keyof paths[P] ? paths[P][T] : unknown,
      T extends keyof paths[P] ? paths[P][T] : unknown
    >["error"],
    FetchResponse<
      T extends keyof paths[P] ? paths[P][T] : unknown,
      T extends keyof paths[P] ? paths[P][T] : unknown
    >["data"]
  >({
    ...options?.reactQuery,
    queryKey: [url, options?.body, options?.params],
    // @ts-expect-error It does return the correct type
    queryFn: async ({ signal }) =>
      // @ts-expect-error It does return the correct type
      getDynamicQuery(method, url, options, signal),
  });
}
