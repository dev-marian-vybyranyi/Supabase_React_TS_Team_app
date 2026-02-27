import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useTeamStore } from "../store/teamStore";
import { usePresenceStore } from "../store/presenceStore";
import Loader from "./Loader";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const TeamInfo = () => {
  const { teamId, session } = useAuthStore();
  const { team, members, isLoading, fetchTeamData } = useTeamStore();
  const { onlineUserIds, initializePresence, cleanupPresence } =
    usePresenceStore();

  const [copied, setCopied] = useState(false);
  const [toggleMembers, setToggleMembers] = useState(false);

  useEffect(() => {
    if (teamId) {
      fetchTeamData(teamId);

      if (session?.user?.id) {
        initializePresence(teamId, session.user.id);
      }
    }

    return () => {
      cleanupPresence();
    };
  }, [
    teamId,
    session?.user?.id,
    fetchTeamData,
    initializePresence,
    cleanupPresence,
  ]);

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
            <span className="font-mono text-sm break-all">{team.id}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div>
              <span className="text-muted-foreground break-all">
                Invite code:{" "}
              </span>
              <span className="font-mono font-medium break-all">
                {team.invite_code}
              </span>
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
            <h3
              className="font-semibold mb-3 cursor-pointer flex items-center align-center"
              onClick={() => setToggleMembers(!toggleMembers)}
            >
              {toggleMembers ? (
                <ChevronUp className="w-4 h-4 mr-2" />
              ) : (
                <ChevronDown className="w-4 h-4 mr-2" />
              )}
              Team members ({members.length})
            </h3>

            {toggleMembers && (
              <ul className="space-y-3">
                {members.map((member) => {
                  const isOnline = onlineUserIds.includes(member.id);

                  return (
                    <li
                      key={member.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {(member.display_name || member.email || "?")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span
                            className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                              isOnline ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
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
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamInfo;
