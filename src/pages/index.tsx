import { Button, Code, Container, Text, useTheme } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Auth from "../client/components/Auth";
import { supabase } from "../client/utils/supabase";

const SignOutIfUser = (props: any) => {
  const { user } = Auth.useUser();
  const [profiles, setProfiles] = useState<any>();
  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("*")
        .then((res) => {
          setProfiles(res);
        });
    }
  }, [user]);
  if (user) {
    return (
      <div>
        <Text>Signed in: {user.email}</Text>
        <Button onClick={() => supabase.auth.signOut()}>Sign out</Button>
        <Code block>{JSON.stringify(profiles, null, 2)}</Code>
      </div>
    );
  }
  return props.children;
};

export default function AuthBasic() {
  return (
    <Container
      display="flex"
      alignItems="center"
      justify="center"
      css={{ height: "100vh" }}
    >
      <Auth.UserContextProvider supabaseClient={supabase}>
        <SignOutIfUser>
          <Auth
            socialColors={true}
            supabaseClient={supabase}
            providers={["discord", "github", "twitter"]}
          />
        </SignOutIfUser>
      </Auth.UserContextProvider>
    </Container>
  );
}
