"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusIcon } from "lucide-react";

import type { Note } from "~/lib/db/schema/notes";
import { useOptimisticNotes } from "~/app/(app)/notes/useOptimisticNotes";
import Modal from "~/components/shared/Modal";
import { Button } from "~/components/ui/button";
import { CompleteNote } from "~/lib/db/schema/notes";
import { cn } from "~/lib/utils";
import NoteForm from "./NoteForm";

type TOpenModal = (note?: Note) => void;

export default function NoteList({ notes }: { notes: CompleteNote[] }) {
  const { optimisticNotes, addOptimisticNote } = useOptimisticNotes(notes);
  const [open, setOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const openModal = (note?: Note) => {
    setOpen(true);
    note ? setActiveNote(note) : setActiveNote(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeNote ? "Edit Note" : "Create Note"}
      >
        <NoteForm
          note={activeNote}
          addOptimistic={addOptimisticNote}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticNotes.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticNotes.map((note) => (
            <Note note={note} key={note.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Note = ({
  note,
  openModal,
}: {
  note: CompleteNote;
  openModal: TOpenModal;
}) => {
  const optimistic = note.id === "optimistic";
  const deleting = note.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("notes") ? pathname : pathname + "/notes/";

  return (
    <li
      className={cn(
        "my-2 flex justify-between",
        mutating ? "animate-pulse opacity-30" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{note.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + note.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No notes
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new note.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Notes{" "}
        </Button>
      </div>
    </div>
  );
};
