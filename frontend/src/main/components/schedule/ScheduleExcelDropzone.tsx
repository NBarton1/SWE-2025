import { Dropzone } from "@mantine/dropzone";
import { MIME_TYPES } from "@mantine/dropzone";
import { Group, Text } from "@mantine/core";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react";
import * as XLSX from "xlsx";
import { useState } from "react";
import {createMatch, type CreateMatchRequest} from "../../request/matches.ts";
import {getTeams} from "../../request/teams.ts";
import {Match} from "../../types/match.ts";


const excelToJSON =  async (file: File) => {
    try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        return rows;
    } catch (err) {
        console.error("Import failed:", err);
    }
}

const getTeamDictionary = async () => {
    const teams = await getTeams();

    const dictionary: Record<string, string> = {};

    for (const team of teams) {
        dictionary[team.name] = String(team.id);
    }

    return dictionary;
};

const createMatchesFromRows = async (rows: any) => {
    const teamDictionary = await getTeamDictionary();

    for (const row of rows) {
        const homeId = teamDictionary[row.homeTeam];
        const awayId = teamDictionary[row.awayTeam];

        if (!homeId || !awayId) {
            console.log(`Team not found in dictionary for row:`, row);
            continue;
        }

        await createMatchFromRow(
            row.type,
            homeId,
            awayId,
            row.date,
            row.time
        );
    }
};

    /*
const parseRow = async(rows: any[], dictTeams: any) => {

    //not necessary to check because backend won't create matches with invalid teams?

    if row.homeTeam in dictTeams.keys and row.awayTeam in dictTeams.keys
            createMatchFromRow()
    else
        do nothing
     */
}

const createMatchFromRow = async ( type: string, homeTeamId: string, awayTeamId: string, date:string, time:string) => {

    try{
        const req: CreateMatchRequest = {
            type,
            homeTeamId,
            awayTeamId,
            date: `${date}T${time}`,
        };

        let createdMatch: Match = await createMatch(req);
        console.log(createdMatch);
    }

    catch (error) {
        console.log("Failed to create match", error);
    }
};


export function MatchExcelImporter() {
    const [loading, setLoading] = useState(false);

    setLoading(true);
    setLoading(false);

    const handleExcel = async (file: File) => {
        const rows = excelToJSON(file);
        createMatchesFromRows(rows);
    }

    return (
        <Dropzone
            onDrop={(files) => handleExcel(files[0])}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={5 * 1024 ** 2}
            accept={[MIME_TYPES.xlsx]}
            disabled={loading}
        >
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                    <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
                </Dropzone.Accept>

                <Dropzone.Reject>
                    <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
                </Dropzone.Reject>

                <Dropzone.Idle>
                    <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
                </Dropzone.Idle>

                <div>
                    <Text size="xl" inline>
                        Drag your file here or click to select file
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        File must be an .xlsx file and under 5mb
                    </Text>
                </div>
            </Group>
        </Dropzone>
    );
}
