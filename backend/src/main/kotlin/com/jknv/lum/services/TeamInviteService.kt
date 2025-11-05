package com.jknv.lum.services

import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.dto.TeamInviteDTO
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
    private val teamService: TeamService,
    private val playerService: PlayerService,
    private val coachService: CoachService,
) {
    fun createInvite(teamId: Long, playerId: Long): TeamInviteDTO {
        val team = teamService.getTeamById(teamId)
        val player = playerService.getPlayerById(playerId)

        if (team == null || player == null)
            throw EntityNotFoundException()

        val invite = TeamInvite(team = team, player = player)
        return teamInviteRepository.save(invite).toDTO()
    }

    fun invitePlayerByCoach(playerId: Long, accountId: Long): TeamInviteDTO {
        val team = coachService.getCoachById(accountId)?.coachingTeam
        val player = playerService.getPlayerById(playerId)

        if (team == null || player == null)
            throw EntityNotFoundException()

        return createInvite(team.id, player.id)
    }

    fun updateInvite(invite: TeamInvite): TeamInviteDTO =
        teamInviteRepository.save(invite).toDTO()

    fun getInvitesByPlayer(id: Long): List<TeamInviteDTO> {
        val player = playerService.getPlayerById(id)
            ?: throw EntityNotFoundException("Player not found")

        return teamInviteRepository.findTeamInvitesByPlayer(player).map { it.toDTO() }
    }

    internal fun getInviteById(playerId: Long, teamId: Long): TeamInvite? =
        teamInviteRepository.findTeamInviteById(TeamInvitePK(teamId = teamId, playerId = playerId))

    fun countInvites(): Long =
        teamInviteRepository.count()

    fun respondToInvite(id: Long, teamId: Long, isAccepted: Boolean): PlayerDTO {
        val player = playerService.getPlayerById(id)
            ?: throw EntityNotFoundException("Could not find player")
        if (!player.hasPermission)
            throw IllegalAccessException("You do not have permission to register for a team")

        val invite = getInviteById(player.id, teamId)
            ?: throw EntityNotFoundException("Could not find invite for player from team $teamId")

        invite.status = InviteStatus.DECLINED
        if (isAccepted) {
            player.playingTeam = invite.team
            invite.status = InviteStatus.ACCEPTED
        }

        updateInvite(invite)
        return playerService.updatePlayer(player)
    }
}