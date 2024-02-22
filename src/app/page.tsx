import { getDynamicQuery } from "@/hooks/use-dynamic-query";
import { ClientComponent } from "./_components/client-component";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { UpdatePet } from "./_components/create-pet";

export default async function Home() {
  const data = await getDynamicQuery("get", "/pet/{petId}", {
    params: {
      path: { petId: 1 },
    },
  });

  if (!data) return notFound();

  return (
    <main>
      FETCH ON SERVER AND PASS INITIAL DATA TO CLIENT HERE
      <Suspense fallback='Loading...'>
        <ClientComponent initialData={data} />
      </Suspense>
      <UpdatePet />
    </main>
  );
}
