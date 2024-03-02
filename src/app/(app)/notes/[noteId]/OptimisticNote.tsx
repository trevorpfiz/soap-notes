"use client";

import { useEffect, useOptimistic, useState } from "react";
import { useChat } from "ai/react";
import { useEditor } from "novel";

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

  const { editor } = useEditor();
  const [openGenerate, setOpenGenerate] = useState(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/generate",
  });

  useEffect(() => {
    // This will run every time the 'messages' array changes, i.e., when new messages are streamed in.
    console.log(editor, "editor");
    console.log(messages, "messages");
    editor &&
      messages.forEach((message) => {
        // Construct the content based on message type and content
        let content;
        if (message.role === "user") {
          content = `User: ${message.content}`;
        } else {
          content = `AI: ${message.content}`;
        }

        // Insert content into the editor. You might need to modify this depending on how your messages are structured and how you want them to appear.
        // For simplicity, I'm inserting plain text here, but you could insert HTML or JSON depending on your needs and editor capabilities.
        editor.commands.insertContent(content); // Adding a newline for separation between messages
      });
  }, [messages, editor]); // Re-run the effect if 'messages' or 'editor' changes

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
        <TailwindEditor />
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
