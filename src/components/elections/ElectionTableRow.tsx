import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Election } from "@/types/elections";
import { Link } from "react-router-dom";

interface ElectionTableRowProps {
  election: Election;
  onDelete?: (id: string) => void;
}

const ElectionTableRow = ({ election, onDelete }: ElectionTableRowProps) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(election.id);
    }
  };

  return (
    <TableRow>
      <TableCell>{election.title}</TableCell>
      <TableCell>{format(new Date(election.start_date), "PPP")}</TableCell>
      <TableCell>{format(new Date(election.end_date), "PPP")}</TableCell>
      <TableCell>
        <span className="capitalize px-2 py-1 rounded-full text-xs font-semibold">
          {election.status}
        </span>
      </TableCell>
      <TableCell>{election.total_votes || 0}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Link to={`/elections/${election.id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ElectionTableRow;