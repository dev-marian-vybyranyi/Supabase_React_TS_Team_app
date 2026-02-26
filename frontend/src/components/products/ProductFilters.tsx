import { useDebounce } from "@/hooks/useDebounce";
import { useProductStore } from "@/store/productStore";
import { useTeamStore } from "@/store/teamStore";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const ProductFilters = () => {
  const { members } = useTeamStore();
  const {
    sortOrder,
    setSortOrder,
    userFilter,
    setUserFilter,
    searchQuery,
    setSearchQuery,
    totalCount,
  } = useProductStore();

  const [searchInput, setSearchInput] = useState(searchQuery);
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      setSearchQuery(debouncedSearch);
    }
  }, [debouncedSearch, searchQuery, setSearchQuery]);

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex items-center gap-2 w-full md:w-auto">¨
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-1.5 text-sm shadow-sm"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Sort by date:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Filter by user:</label>
        <select
          value={userFilter || ""}
          onChange={(e) => setUserFilter(e.target.value || null)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm"
        >
          <option value="">All users</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.display_name || member.email || "Unknown user"}
            </option>
          ))}
        </select>
      </div>
      {totalCount > 0 && (
        <span className="text-sm text-muted-foreground ml-auto">
          {totalCount} product{totalCount !== 1 ? "s" : ""} found
        </span>
      )}
    </div>
  );
};

export default ProductFilters;
