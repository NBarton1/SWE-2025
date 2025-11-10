import { invitePlayerFromTeam } from "../../request/teams";
import PlayerSelectorModal from "../profile/PlayerSelectModal.tsx";

interface InvitePlayerModalProps {
    opened: boolean;
    onClose: () => void;
}

const InvitePlayerModal = ({ opened, onClose }: InvitePlayerModalProps) => {
    return (
        <PlayerSelectorModal
            opened={opened}
            onClose={onClose}
            title="Invite Player"
            confirmLabel="Send Invite"
            onConfirm={async (playerId) => {
                const res = await invitePlayerFromTeam(playerId);
                if (!res.ok) throw new Error();
            }}
            errorMessage="Cannot send invite — player likely already has one from this team."
        />
    );
};

export default InvitePlayerModal;
