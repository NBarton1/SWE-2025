import { invitePlayerFromTeam } from "../../request/teams";
import PlayerSelectorModal from "../profile/PlayerSelectModal.tsx";

interface InvitePlayerModalProps {
    opened: boolean;
    onClose: () => void;
}

const InvitePlayerModal = ({ opened, onClose }: InvitePlayerModalProps) => {
    return (
        <div data-testid="team-invite-modal">
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
        </div>
    );
};

export default InvitePlayerModal;
