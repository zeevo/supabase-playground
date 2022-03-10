import { Button, Divider, Text } from "@nextui-org/react";

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
