import type { Database } from "../database.types";

export type Team = Database["public"]["Tables"]["teams"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  display_name?: string | null;
  email?: string | null;
};
