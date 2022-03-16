import {
  Button,
  FormElement,
  Input,
  Link,
  Spacer,
  Text,
} from "@nextui-org/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { VIEWS } from "./constants";
import { RedirectTo, ViewType } from "./types";

function EmailAuth({
  authView,
  defaultEmail,
  defaultPassword,
  id,
  setAuthView,
  setDefaultEmail,
  setDefaultPassword,
  supabaseClient,
  redirectTo,
  magicLink,
}: {
  authView: ViewType;
  defaultEmail: string;
  defaultPassword: string;
  id: "auth-sign-up" | "auth-sign-in";
  setAuthView: any;
  setDefaultEmail: (email: string) => void;
  setDefaultPassword: (password: string) => void;
  supabaseClient: SupabaseClient;
  redirectTo?: RedirectTo;
  magicLink?: boolean;
}) {
  const isMounted = useRef<boolean>(true);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setEmail(defaultEmail);
    setPassword(defaultPassword);

    return () => {
      isMounted.current = false;
    };
  }, [authView]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    switch (authView) {
      case "sign_in":
        const { error: signInError } = await supabaseClient.auth.signIn(
          {
            email,
            password,
          },
          { redirectTo }
        );
        if (signInError) setError(signInError.message);
        break;
      case "sign_up":
        const {
          user: signUpUser,
          session: signUpSession,
          error: signUpError,
        } = await supabaseClient.auth.signUp(
          {
            email,
            password,
          },
          { redirectTo }
        );
        if (signUpError) setError(signUpError.message);
        // Check if session is null -> email confirmation setting is turned on
        else if (signUpUser && !signUpSession)
          setMessage("Check your email for the confirmation link.");
        break;
    }

    /*
     * it is possible the auth component may have been unmounted at this point
     * check if component is mounted before setting a useState
     */
    if (isMounted.current) setLoading(false);
  };

  const handleViewChange = (newView: ViewType) => {
    setDefaultEmail(email);
    setDefaultPassword(password);
    setAuthView(newView);
  };

  return (
    <form id={id} onSubmit={handleSubmit}>
      <Input
        fullWidth
        bordered
        label="Email address"
        autoComplete="email"
        defaultValue={email}
        onChange={(e: React.ChangeEvent<FormElement>) =>
          setEmail(e.target.value)
        }
      />
      <Input.Password
        fullWidth
        bordered
        label="Password"
        type="password"
        defaultValue={password}
        autoComplete="current-password"
        onChange={(e: React.ChangeEvent<FormElement>) =>
          setPassword(e.target.value)
        }
      />
      <Spacer y={1} />
      <div style={{ justifyContent: "space-between", display: "flex" }}></div>
      <div style={{ display: "flex" }}>
        <Button type="submit" style={{ flex: 1 }}>
          {authView === VIEWS.SIGN_IN ? "Sign in" : "Sign up"}
        </Button>
      </div>

      {authView === VIEWS.SIGN_IN && magicLink && (
        <Link
          href="#auth-magic-link"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            setAuthView(VIEWS.MAGIC_LINK);
          }}
        >
          Sign in with magic link
        </Link>
      )}
      {authView === VIEWS.SIGN_IN ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Link
            href="#auth-sign-up"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              handleViewChange(VIEWS.SIGN_UP);
            }}
          >
            {`Don't have an account? Sign up`}
          </Link>
          {authView === VIEWS.SIGN_IN && (
            <Link
              href="#auth-forgot-password"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                setAuthView(VIEWS.FORGOTTEN_PASSWORD);
              }}
            >
              Forgot your password?
            </Link>
          )}
        </div>
      ) : (
        <Link
          href="#auth-sign-in"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            handleViewChange(VIEWS.SIGN_IN);
          }}
        >
          Sign In instead
        </Link>
      )}
      {message && <Text>{message}</Text>}
      {error && <Text color="error">{error}</Text>}
    </form>
  );
}

export default EmailAuth;
