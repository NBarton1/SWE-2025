import {Button} from "@mantine/core";


interface ScoreButtonProps {
    points: number,
    scoreType: string,
}

const ScoreButton = ({ points, scoreType }: ScoreButtonProps) => {

    return (
        <Button type="submit">
            {scoreType}
        </Button>
    );
};

export default ScoreButton;
