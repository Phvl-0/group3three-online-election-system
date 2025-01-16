import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Election } from "@/utils/electionUtils";
import ElectionTableRow from "./ElectionTableRow";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Votes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {elections.map((election) => (
              <ElectionTableRow
                key={election.id}
                election={election}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};