"use client";

import { useOptimistic, useState } from "react";
import { useChat } from "ai/react";

import { TAddOptimistic } from "~/app/(app)/notes/useOptimisticNotes";
import GenerateForm from "~/components/notes/generate-form";
import NoteForm from "~/components/notes/NoteForm";
import Tiptap from "~/components/notes/tiptap";
import Modal from "~/components/shared/Modal";
import { Button } from "~/components/ui/button";
import { type Note } from "~/lib/db/schema/notes";
import { cn } from "~/lib/utils";

export default function OptimisticNote({ note }: { note: Note }) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Note) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticNote, setOptimisticNote] = useOptimistic(note);
  const updateNote: TAddOptimistic = (input) =>
    setOptimisticNote({ ...input.data });

  const [openGenerate, setOpenGenerate] = useState(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/generate",
  });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <NoteForm
          note={optimisticNote}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateNote}
        />
      </Modal>
      <Modal open={openGenerate} setOpen={setOpenGenerate}>
        <GenerateForm
          closeModal={() => setOpenGenerate(false)}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </Modal>
      <div className="mb-4 flex items-end justify-between">
        <h1 className="text-2xl font-semibold">{optimisticNote.name}</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setOpenGenerate(true)}>
            Generate Note
          </Button>
          <Button className="" onClick={() => setOpen(true)}>
            Edit
          </Button>
        </div>
      </div>
      <pre
        className={cn(
          "text-wrap break-all rounded-lg bg-secondary p-4",
          optimisticNote.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        <Tiptap messages={messages} />
        <ul>
          {messages.map((m, index) => (
            <li key={index}>
              {m.role === "user" ? "User: " : "AI: "}
              {m.content}
            </li>
          ))}
        </ul>
      </pre>
    </div>
  );
}
