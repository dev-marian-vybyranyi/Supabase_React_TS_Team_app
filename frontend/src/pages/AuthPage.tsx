import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface AuthPageProps {
  session: any;
}

export default function AuthPage({ session }: AuthPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <div className="p-6 min-h-screen flex items-center flex-col justify-center">
      <div className="w-full max-w-md p-10 flex flex-col">
        <h1 className="text-4xl font-bold mb-8 text-center shrink-0">
          Welcome back
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
        />
      </div>
    </div>
  );
}
