import { Button } from "@/components/ui/button";
import { Election } from "@/utils/electionUtils";
import { Edit, Trash2, Users, Calendar, ChevronRight } from "lucide-react";

interface ElectionTableRowProps {
  election: Election;
  onDelete: (id: string) => void;
}

export const ElectionTableRow = ({ election, onDelete }: ElectionTableRowProps) => {
  return (
    <tr className="border-b">
      <td className="py-3 px-4">{election.title}</td>
      <td className="py-3 px-4">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            election.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {election.status}
        </span>
      </td>
      <td className="py-3 px-4">{election.startDate}</td>
      <td className="py-3 px-4">{election.endDate}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {election.candidates.length}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {election.totalVotes}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={`/elections/${election.id}`}>
              <ChevronRight className="w-4 h-4" />
            </a>
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(election.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};