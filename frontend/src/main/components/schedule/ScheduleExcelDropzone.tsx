import { Dropzone } from "@mantine/dropzone";
import { MIME_TYPES } from "@mantine/dropzone";
import { Group, Text } from "@mantine/core";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react";
import * as XLSX from "xlsx";
import { useState } from "react";
import {createMatch, type CreateMatchRequest} from "../../request/matches.ts";
import {getTeams} from "../../request/teams.ts";
import {Match} from "../../types/match.ts";


const excelDateToJSDate = (excelNum: number)=> {
    return XLSX.SSF.parse_date_code(excelNum);
}

const normalizeRow = (raw: any) => {

    const d = excelDateToJSDate(raw.date);
    const t = excelDateToJSDate(raw.time);

    const yyyy = d.y;
    const mm = String(d.m).padStart(2, "0");
    const dd = String(d.d).padStart(2, "0");

    const hh = String(t.H).padStart(2, "0");
    const min = String(t.M).padStart(2, "0");

    return {
        type: String(raw.type).toUpperCase().trim(),            // make type case insensitive
        homeTeam: String(raw.homeTeam),
        awayTeam: String(raw.awayTeam),
        date: `${yyyy}-${mm}-${dd}`,
        time: `${hh}:${min}`,
    };
}


const excelToJSON = async (file: File): Promise<any[]> => {
    try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rowsRaw: any[] = XLSX.utils.sheet_to_json(sheet);

        const normalizedRows = rowsRaw.map(normalizeRow);

        return normalizedRows;
    } catch (err) {
        console.error("Import failed:", err);
        return [];
    }
};


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
        }
        else {
            await createMatchFromRow(
                row.type,
                homeId,
                awayId,
                row.date,
                row.time
            );
        }

        console.log("Mapped home:", homeId, "away:", awayId);

    }
};

const createMatchFromRow = async ( type: string, homeTeamId: string, awayTeamId: string, date:string, time:string) => {
    try{
        const req: CreateMatchRequest = {
            type,
            homeTeamId,
            awayTeamId,
            date: `${date}T${time}`,
        };

        const createdMatch: Match = await createMatch(req);
        console.log(createdMatch);
    }

    catch (error) {
        console.log("Failed to create match", error);
    }
};


export function MatchExcelImporter() {
    const [loading, setLoading] = useState(false);

    const handleExcel = async (file: File) => {
        setLoading(true);

        try {
            const rows = await excelToJSON(file);

            if (!rows) {
                console.error("Excel file returned no rows.");
                return;
            }

            await createMatchesFromRows(rows);
        } finally {
            setLoading(false);
        }
    };

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
