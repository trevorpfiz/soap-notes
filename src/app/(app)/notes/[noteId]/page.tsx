import { Suspense } from "react";
import { notFound } from "next/navigation";

import Loading from "~/app/loading";
import { BackButton } from "~/components/shared/BackButton";
import { getNoteById } from "~/lib/api/notes/queries";
import { checkAuth } from "~/lib/auth/utils";
import OptimisticNote from "./OptimisticNote";

export const revalidate = 0;

export default async function NotePage({
  params,
}: {
  params: { noteId: string };
}) {
  return (
    <main className="overflow-auto">
      <Note id={params.noteId} />
    </main>
  );
}

const Note = async ({ id }: { id: string }) => {
  await checkAuth();

  const { note } = await getNoteById(id);

  if (!note) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="notes" />
        <OptimisticNote note={note} />
      </div>
    </Suspense>
  );
};
