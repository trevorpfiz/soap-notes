"use client";

import type { EditorInstance } from "novel";
import { useEffect, useOptimistic, useState } from "react";
import { useCompletion } from "ai/react";

import { TAddOptimistic } from "~/app/(app)/notes/useOptimisticNotes";
import GenerateForm from "~/components/notes/generate-form";
import NoteForm from "~/components/notes/NoteForm";
import TailwindEditor from "~/components/notes/novel/editor";
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
  const [editorInstance, setEditorInstance] = useState<EditorInstance | null>(
    null,
  );
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    api: "/api/generate",
    onFinish: (prompt, completion) => {
      // This function gets called when the completion stream ends
      if (editorInstance) {
        // Insert the completion content into the editor
        const content = `${completion}\n`; // Adjust this line as needed
        editorInstance.commands.insertContent(content);
      }
    },
  });

  const handleEditorCreate = (editor: EditorInstance) => {
    setEditorInstance(editor);
  };

  // FIXME: need to figure out how to write stream to editor
  // useEffect(() => {
  //   if (editorInstance && completion) {
  //     if (typeof completion === "string") {
  //       const content = `${completion}\n`;
  //       editorInstance.commands.insertContentAt(0, content);
  //     } else {
  //       console.warn("Completion content is not a string:", completion);
  //     }
  //   }
  // }, [completion, editorInstance]);

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
        <TailwindEditor onCreate={handleEditorCreate} note={note} />
        <p>{completion}</p>
      </pre>
    </div>
  );
}
