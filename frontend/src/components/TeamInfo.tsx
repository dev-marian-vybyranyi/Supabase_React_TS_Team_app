import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useTeamStore } from "../store/teamStore";
import Loader from "./Loader";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const TeamInfo = () => {
  const { teamId } = useAuthStore();
  const { team, members, isLoading, fetchTeamData } = useTeamStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (teamId) {
      fetchTeamData(teamId);
    }
  }, [teamId, fetchTeamData]);

  const handleCopyCode = async () => {
    if (team?.invite_code) {
      try {
        await navigator.clipboard.writeText(team.invite_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy", err);
      }
    }
  };

  if (isLoading) {
    return <Loader size="lg" />;
  }

  if (!team) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardContent>
        <h2 className="text-2xl font-bold mb-4">{team.name}</h2>

        <div className="space-y-4">
          <div>
            <span className="text-muted-foreground">Team ID: </span>
            <span className="font-mono text-sm">{team.id}</span>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-muted-foreground">Invite code: </span>
              <span className="font-mono font-medium">{team.invite_code}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              title="Copy invite code"
            >
              {copied ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3">
              Team members ({members.length})
            </h3>
            <ul className="space-y-3">
              {members.map((member) => (
                <li key={member.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {(member.display_name || member.email || "?")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">
                      {member.display_name || "No name"}
                    </div>
                    {member.email && (
                      <div className="text-sm text-muted-foreground">
                        {member.email}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamInfo;
