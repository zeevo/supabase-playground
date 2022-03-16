import { Button, Input, Link, Spacer, Text } from "@nextui-org/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";
import { VIEWS } from "./constants";
import { RedirectTo } from "./types";

function ForgottenPassword({
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

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const { error } = await supabaseClient.auth.api.resetPasswordForEmail(
      email,
      { redirectTo }
    );
    if (error) setError(error.message);
    else setMessage("Check your email for the password reset link");
    setLoading(false);
  };

  return (
    <form
      id="auth-forgot-password"
      onSubmit={handlePasswordReset}
      style={{ width: "100%" }}
    >
      <div style={{ display: "flex" }}>
        <Input
          fullWidth
          label="Email address"
          placeholder="Your email address"
          onChange={(e: React.ChangeEvent<FormElement>) =>
            setEmail(e.target.value)
          }
        />
      </div>
      <Spacer y={1} />
      <Button size="lg" type="submit" auto>
        Send reset password instructions
      </Button>
      <Spacer y={1} />
      <Link
        href="#auth-sign-in"
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          setAuthView(VIEWS.SIGN_IN);
        }}
      >
        Go back to sign in
      </Link>
      {message && <Text>{message}</Text>}
      {error && <Text color="error">{error}</Text>}
    </form>
  );
}

export default ForgottenPassword;
