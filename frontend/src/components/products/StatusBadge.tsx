interface StatusBadgeProps {
  status: "Draft" | "Active" | "Deleted" | null;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
        status === "Active"
          ? "bg-green-100 text-green-800"
          : status === "Deleted"
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
