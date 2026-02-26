import { useAuthStore } from "../store/authStore";
import { Card, CardContent } from "./ui/card";

const TeamInfo = () => {
  const { teamId } = useAuthStore();

  return (
    <Card className="mb-8">
      <CardContent>
        <p className="text-muted-foreground">
          <strong className="text-foreground">Team ID:</strong> {teamId}
        </p>
      </CardContent>
    </Card>
  );
};

export default TeamInfo;
