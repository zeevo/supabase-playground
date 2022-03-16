import React, { useEffect, useState } from "react";
import { SupabaseClient, Provider } from "@supabase/supabase-js";
import { Text } from "@nextui-org/react";
import { UserContextProvider, useUser } from "./UserContext";
import { RedirectTo, ViewsMap, ViewType } from "./types";
import SocialAuth from "./SocialAuth";
import UpdatePassword from "./UpdatePassword";
import ForgottenPassword from "./ForgottenPassword";
import MagicLink from "./MagicLink";
import EmailAuth from "./EmailAuth";

const VIEWS: ViewsMap = {
  SIGN_IN: "sign_in",
  SIGN_UP: "sign_up",
  FORGOTTEN_PASSWORD: "forgotten_password",
  MAGIC_LINK: "magic_link",
  UPDATE_PASSWORD: "update_password",
};

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

Auth.ForgottenPassword = ForgottenPassword;
Auth.UpdatePassword = UpdatePassword;
Auth.MagicLink = MagicLink;
Auth.UserContextProvider = UserContextProvider;
Auth.useUser = useUser;

export default Auth;
