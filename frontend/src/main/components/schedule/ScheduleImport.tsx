import {Title, Container} from "@mantine/core";
import {MatchExcelImporter} from "./ScheduleExcelDropzone.tsx";


const ScheduleImport = () => {

    return (
        <Container>
            <Title
                order={2} mb="md"
                ta="center"
                data-testid="schedule-import-title"
            >
                Import from Excel
            </Title>

           <MatchExcelImporter></MatchExcelImporter>

        </Container>
    );
};

export default ScheduleImport;

