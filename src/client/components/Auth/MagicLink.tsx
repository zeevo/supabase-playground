import { Button, FormElement, Input, Link, Text } from "@nextui-org/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";
import { VIEWS } from "./constants";
import { RedirectTo } from "./types";

function MagicLink({
  setAuthView,
  supabaseClient,
  redirectTo,
}: {
  setAuthView: any;
  supabaseClient: SupabaseClient;
  redirectTo?: RedirectTo;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMagicLinkSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const { error } = await supabaseClient.auth.signIn(
      { email },
      { redirectTo }
    );
    if (error) setError(error.message);
    else setMessage("Check your email for the magic link");
    setLoading(false);
  };

  return (
    <form id="auth-magic-link" onSubmit={handleMagicLinkSignIn}>
      <Input
        label="Email address"
        placeholder="Your email address"
        onChange={(e: React.ChangeEvent<FormElement>) =>
          setEmail(e.target.value)
        }
      />
      <Button size="lg" type="submit">
        Send magic link
      </Button>
      <Link
        href="#auth-sign-in"
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          setAuthView(VIEWS.SIGN_IN);
        }}
      >
        Sign in with password
      </Link>
      {message && <Text>{message}</Text>}
      {error && <Text color="error">{error}</Text>}
    </form>
  );
}

export default MagicLink;
