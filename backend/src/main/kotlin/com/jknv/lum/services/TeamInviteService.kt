package com.jknv.lum.services

import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.dto.TeamInviteDTO
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.entity.TeamInvite
import com.jknv.lum.model.entity.TeamInvitePK
import com.jknv.lum.model.type.InviteStatus
import com.jknv.lum.repository.TeamInviteRepository
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
@Transactional
class TeamInviteService (
    private val teamInviteRepository: TeamInviteRepository,
    private val playerService: PlayerService,
    private val coachService: CoachService,
) {
    fun invitePlayerByCoach(playerId: Long, accountId: Long): TeamInviteDTO {
        val team = coachService.getCoachById(accountId).coachingTeam
            ?: throw EntityNotFoundException("You are not coaching a team")
        val player = playerService.getPlayerById(playerId)

        return createInvite(team, player)
    }

    fun getInvitesByPlayer(id: Long): List<TeamInviteDTO> {
        val player = playerService.getPlayerById(id)

        return teamInviteRepository.findTeamInvitesByPlayer(player).filter { it.status == InviteStatus.PENDING }.map { it.toDTO() }
    }

    fun countInvites(): Long =
        teamInviteRepository.count()

    fun respondToInvite(id: Long, teamId: Long, isAccepted: Boolean): TeamInviteDTO {
        val player = playerService.getPlayerById(id)
        if (!player.hasPermission)
            throw IllegalAccessException("You do not have permission to register for a team")

        val invite = getInviteById(player.id, teamId)

        if (isAccepted) {
            player.playingTeam = invite.team
            invite.status = InviteStatus.ACCEPTED
            playerService.updatePlayer(player)
        } else {
            invite.status = InviteStatus.DECLINED
        }

        return updateInvite(invite)
    }

    internal fun createInvite(team: Team, player: Player): TeamInviteDTO =
        teamInviteRepository.save(TeamInvite(team = team, player = player)).toDTO()

    internal fun getInviteById(playerId: Long, teamId: Long): TeamInvite =
        teamInviteRepository.findTeamInviteById(TeamInvitePK(teamId, playerId)).orElseThrow { EntityNotFoundException("Invite $teamId -> $playerId not found") }

    internal fun updateInvite(invite: TeamInvite): TeamInviteDTO =
        teamInviteRepository.save(invite).toDTO()
}
