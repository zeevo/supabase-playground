import React, { useEffect, useRef, useState } from "react";
import { SupabaseClient, Provider } from "@supabase/supabase-js";
import {
  Input,
  Button,
  Spacer,
  Divider,
  Text,
  FormElement,
  Link,
} from "@nextui-org/react";
import { UserContextProvider, useUser } from "./UserContext";

const VIEWS: ViewsMap = {
  SIGN_IN: "sign_in",
  SIGN_UP: "sign_up",
  FORGOTTEN_PASSWORD: "forgotten_password",
  MAGIC_LINK: "magic_link",
  UPDATE_PASSWORD: "update_password",
};

interface ViewsMap {
  [key: string]: ViewType;
}

type ViewType =
  | "sign_in"
  | "sign_up"
  | "forgotten_password"
  | "magic_link"
  | "update_password";

type RedirectTo = undefined | string;

export interface Props {
  supabaseClient: SupabaseClient;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  socialLayout?: "horizontal" | "vertical";
  socialColors?: boolean;
  socialButtonSize?: any; // Replace me with StyledButton styles
  providers?: Provider[];
  verticalSocialLayout?: any;
  view?: ViewType;
  redirectTo?: RedirectTo;
  onlyThirdPartyProviders?: boolean;
  magicLink?: boolean;
}

function Auth({
  supabaseClient,
  className,
  socialLayout = "vertical",
  socialColors = false,
  socialButtonSize = "medium",
  providers,
  view = "sign_in",
  redirectTo,
  onlyThirdPartyProviders = false,
  magicLink = false,
}: Props): JSX.Element | null {
  const [authView, setAuthView] = useState(view);
  const [defaultEmail, setDefaultEmail] = useState("");
  const [defaultPassword, setDefaultPassword] = useState("");

  const verticalSocialLayout = socialLayout === "vertical" ? true : false;

  let containerClasses = [];
  if (className) {
    containerClasses.push(className);
  }

  const Container = (props: any) => (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Text h2>Welcome</Text>
      </div>
      <SocialAuth
        supabaseClient={supabaseClient}
        verticalSocialLayout={verticalSocialLayout}
        providers={providers}
        socialLayout={socialLayout}
        socialButtonSize={socialButtonSize}
        socialColors={socialColors}
        redirectTo={redirectTo}
        onlyThirdPartyProviders={onlyThirdPartyProviders}
        magicLink={magicLink}
      />
      {!onlyThirdPartyProviders && props.children}
    </div>
  );

  useEffect(() => {
    // handle view override
    setAuthView(view);
  }, [view]);

  switch (authView) {
    case VIEWS.SIGN_IN:
    case VIEWS.SIGN_UP:
      return (
        <Container>
          <EmailAuth
            id={authView === VIEWS.SIGN_UP ? "auth-sign-up" : "auth-sign-in"}
            supabaseClient={supabaseClient}
            authView={authView}
            setAuthView={setAuthView}
            defaultEmail={defaultEmail}
            defaultPassword={defaultPassword}
            setDefaultEmail={setDefaultEmail}
            setDefaultPassword={setDefaultPassword}
            redirectTo={redirectTo}
            magicLink={magicLink}
          />
        </Container>
      );
    case VIEWS.FORGOTTEN_PASSWORD:
      return (
        <Container>
          <ForgottenPassword
            supabaseClient={supabaseClient}
            setAuthView={setAuthView}
            redirectTo={redirectTo}
          />
        </Container>
      );

    case VIEWS.MAGIC_LINK:
      return (
        <Container>
          <MagicLink
            supabaseClient={supabaseClient}
            setAuthView={setAuthView}
            redirectTo={redirectTo}
          />
        </Container>
      );

    case VIEWS.UPDATE_PASSWORD:
      return (
        <Container>
          <UpdatePassword supabaseClient={supabaseClient} />
        </Container>
      );

    default:
      return null;
  }
}

function SocialAuth({
  className,
  style,
  supabaseClient,
  children,
  socialLayout = "vertical",
  socialColors = false,
  socialButtonSize,
  providers,
  verticalSocialLayout,
  redirectTo,
  onlyThirdPartyProviders,
  magicLink,
  ...props
}: Props) {
  const buttonStyles: any = {
    azure: {
      backgroundColor: "#008AD7",
      color: "white",
    },
    bitbucket: {
      backgroundColor: "#205081",
      color: "white",
    },
    facebook: {
      backgroundColor: "#4267B2",
      color: "white",
    },
    github: {
      backgroundColor: "#333",
      color: "white",
    },
    gitlab: {
      backgroundColor: "#FC6D27",
    },
    google: {
      backgroundColor: "#ce4430",
      color: "white",
    },
    twitter: {
      backgroundColor: "#1DA1F2",
      color: "white",
    },
    apple: {
      backgroundColor: "#000",
      color: "white",
    },
    discord: {
      backgroundColor: "#404fec",
      color: "white",
    },
    twitch: {
      backgroundColor: "#9146ff",
      color: "white",
    },
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProviderSignIn = async (provider: Provider) => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signIn(
      { provider },
      { redirectTo }
    );
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <>
      {providers && providers.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {providers.map((provider) => {
            return (
              <div key={provider} style={{ display: "flex" }}>
                <Button
                  style={
                    socialColors
                      ? {
                          ...buttonStyles[provider],
                          flex: 1,
                          marginBottom: ".5rem",
                        }
                      : { flex: 1, marginBottom: ".5rem" }
                  }
                  onClick={() => handleProviderSignIn(provider)}
                >
                  {"Sign up with " + provider}
                </Button>
              </div>
            );
          })}
          {!onlyThirdPartyProviders && (
            <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
              <Divider>
                <Text>or continue with</Text>
              </Divider>
            </div>
          )}
        </div>
      )}
    </>
  );
}

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

Auth.ForgottenPassword = ForgottenPassword;
Auth.UpdatePassword = UpdatePassword;
Auth.MagicLink = MagicLink;
Auth.UserContextProvider = UserContextProvider;
Auth.useUser = useUser;

export default Auth;
