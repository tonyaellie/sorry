"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { LoaderCircle } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const SorryButton = () => {
  const [submitting, setSubmitting] = useState(false);
  const submit = api.post.addSorry.useMutation();
  const remove = api.post.removeSorry.useMutation();
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        try {
          setSubmitting(true);
          const returnId = await submit.mutateAsync();
          router.refresh();
          toast(`Sorry added`, {
            cancel: {
              label: "Undo",
              onClick: () => {
                void (async () => {
                  try {
                    await remove.mutateAsync({ id: returnId });
                    router.refresh();
                    toast("Sorry removed");
                  } catch (err) {
                    console.error(err);
                    toast("Sorry, something went wrong removing the sorry");
                  }
                })();
              },
            },
          });
        } catch (err) {
          console.error(err);
          toast("Sorry, something went wrong adding the sorry");
        } finally {
          setSubmitting(false);
        }
      }}
      disabled={submitting}
      className="w-16"
    >
      {submitting ? <LoaderCircle className="animate-spin" /> : "Sorry"}
    </Button>
  );
};

export const SignInButton = () => (
  <Button
    onClick={() => {
      void signIn("discord");
    }}
  >
    Sign in
  </Button>
);
