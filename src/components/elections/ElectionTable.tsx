import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Election } from "@/utils/electionUtils";
import { ElectionTableRow } from "./ElectionTableRow";

interface ElectionTableProps {
  elections: Election[];
  onDelete: (id: string) => void;
}

export const ElectionTable = ({ elections, onDelete }: ElectionTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Elections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Start Date</th>
                <th className="text-left py-3 px-4">End Date</th>
                <th className="text-left py-3 px-4">Candidates</th>
                <th className="text-left py-3 px-4">Total Votes</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {elections.map((election) => (
                <ElectionTableRow
                  key={election.id}
                  election={election}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};