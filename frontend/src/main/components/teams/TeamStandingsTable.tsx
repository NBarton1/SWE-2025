import {
    ScrollArea,
    Table,
} from "@mantine/core";
import {formatTeamPCT, type Team} from "../../types/team.ts";
import {useNavigate} from "react-router";

interface TeamStandingsEntriesProps {
    teams: Team[]
}


const TeamStandingsTable = ({ teams }: TeamStandingsEntriesProps) => {

    const navigate = useNavigate()

    return (
        <ScrollArea h="80vh">
            <Table
                highlightOnHover
                striped
                stickyHeader
                verticalSpacing="sm"
                horizontalSpacing="md"
                data-testid="teams-table"
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Rank</Table.Th>
                        <Table.Th>Team</Table.Th>
                        <Table.Th>Win</Table.Th>
                        <Table.Th>Loss</Table.Th>
                        <Table.Th>Draw</Table.Th>
                        <Table.Th>PCT</Table.Th>
                        <Table.Th>Points For</Table.Th>
                        <Table.Th>Points Allowed</Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {teams.sort((t0, t1) => t1.pct - t0.pct).map((team, index) => (
                        <Table.Tr key={`${team.id}-${index}`}>
                            <Table.Td>{index + 1}</Table.Td>
                            <Table.Td
                                onClick={() => navigate(`/teams/${team.id}`)}
                                style={{ cursor: "pointer", color: "#1c7ed6" }}
                                onMouseOver={e => (e.currentTarget.style.textDecoration = "underline")}
                                onMouseOut={e => (e.currentTarget.style.textDecoration = "none")}
                            >
                                {team.name}
                            </Table.Td>
                            <Table.Td>{team.win}</Table.Td>
                            <Table.Td>{team.loss}</Table.Td>
                            <Table.Td>{team.draw}</Table.Td>
                            <Table.Td>{formatTeamPCT(team)}</Table.Td>
                            <Table.Td>{team.pointsFor}</Table.Td>
                            <Table.Td>{team.pointsAllowed}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </ScrollArea>
    );
};

export default TeamStandingsTable;
