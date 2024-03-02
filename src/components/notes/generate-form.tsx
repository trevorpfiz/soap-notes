import type { ChatRequestOptions } from "ai";
import React from "react";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

interface GenerateFormProps {
  closeModal: () => void;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined,
  ) => void;
}

const GenerateForm = (props: GenerateFormProps) => {
  const { closeModal, input, handleInputChange, handleSubmit } = props;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
        closeModal();
      }}
      className="space-y-6"
    >
      <div className="grid w-full gap-1.5">
        <Label htmlFor="transcript">Transcript</Label>
        <Textarea
          id="transcript"
          placeholder="Paste your transcript here"
          value={input}
          onChange={handleInputChange}
        />
        <p className="text-sm text-muted-foreground">
          A note will be generated based on your transcript.
        </p>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Generate</Button>
      </div>
    </form>
  );
};

export default GenerateForm;

// can you generate a sample SOAP note?
