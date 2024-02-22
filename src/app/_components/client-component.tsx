"use client";

import { useDynamicQuery } from "@/hooks/use-dynamic-query";
import { components } from "@/types/generated-types";
import { useState } from "react";

type ClientComponentProps = {
  initialData: components["schemas"]["Pet"];
};

function ClientComponent({ initialData }: ClientComponentProps) {
  const [id, setId] = useState<number | undefined>(initialData.id);

  const { data, refetch } = useDynamicQuery("get", "/pet/{petId}", {
    params: {
      path: { petId: id ?? 1 },
    },
    reactQuery: {
      initialData,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue)) {
      setId(inputValue);

      refetch();
    }
  };

  return (
    <div>
      <h4>Get Pet</h4>
      <label htmlFor='petId'>Get Pet ID:</label>
      <input name='petId' value={id} onChange={handleInputChange} />

      <div>
        <h1>NAME: {data?.name}</h1>
        <p>ID: {data?.id}</p>
        <p>Category: {data?.category?.name}</p>
        <ul>
          {data?.tags?.map((tag) => (
            <li key={tag?.id}>{tag?.name}</li>
          ))}
        </ul>
        <p>Status: {data?.status}</p>
      </div>
    </div>
  );
}

export { ClientComponent };
