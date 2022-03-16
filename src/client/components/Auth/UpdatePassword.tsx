import { Button, FormElement, Input, Text } from "@nextui-org/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";

function UpdatePassword({
  supabaseClient,
}: {
  supabaseClient: SupabaseClient;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const { error } = await supabaseClient.auth.update({ password });
    if (error) setError(error.message);
    else setMessage("Your password has been updated");
    setLoading(false);
  };

  return (
    <form id="auth-update-password" onSubmit={handlePasswordReset}>
      <Input
        label="New password"
        placeholder="Enter your new password"
        type="password"
        onChange={(e: React.ChangeEvent<FormElement>) =>
          setPassword(e.target.value)
        }
      />
      <Button size="lg" type="submit">
        Update password
      </Button>
      {message && <Text>{message}</Text>}
      {error && <Text color="error">{error}</Text>}
    </form>
  );
}

export default UpdatePassword;
