"use client";

import { useDynamicMutation } from "@/hooks/use-dynamic-mutation";
import { components } from "@/types/generated-types";

function UpdatePet() {
  const { mutate } = useDynamicMutation("post", "/pet");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const petId = formData.get(
      "petId"
    ) as unknown as components["schemas"]["Pet"]["id"];
    const name = formData.get("name") as components["schemas"]["Pet"]["name"];
    const status = formData.get(
      "status"
    ) as components["schemas"]["Pet"]["status"];

    mutate({
      body: {
        id: petId,
        name,
        status,
        photoUrls: [],
      },
    });
  };

  return (
    <div>
      <h4>Create a new pet</h4>
      <form onSubmit={handleSubmit}>
        <label htmlFor='petId'>Pet ID:</label>
        <input type='number' id='petId' name='petId' required />

        <label htmlFor='name'>Name:</label>
        <input type='text' id='name' name='name' required />

        <label htmlFor='status'>Status:</label>
        <input type='text' id='status' name='status' required />

        <button type='submit'>Create Pet</button>
      </form>
    </div>
  );
}

export { UpdatePet };
