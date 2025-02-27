
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Election } from "@/utils/electionUtils";
import { Link } from "react-router-dom";
import { BarChart, Users, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isActive = new Date(election.start_date) <= new Date() && 
                  new Date(election.end_date) >= new Date();

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-start gap-4">
          {election.image ? (
            <img 
              src={election.image} 
              alt={election.title} 
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
              <BarChart className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div>
            <h3 className="font-semibold">{election.title}</h3>
            <p className="text-sm text-muted-foreground">{election.description}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-muted-foreground" />
            <span>{format(new Date(election.start_date), "PPP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-muted-foreground" />
            <span>{format(new Date(election.end_date), "PPP")}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          getStatusColor(election.status)
        )}>
          {election.status}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{election.total_votes || 0}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Link to={`/elections/${election.id}`}>
            <Button variant={isActive ? "default" : "outline"} size="sm">
              {isActive ? "Vote Now" : "View"}
            </Button>
          </Link>
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ElectionTableRow;
