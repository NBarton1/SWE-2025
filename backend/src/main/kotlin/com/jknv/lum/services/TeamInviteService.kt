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
    fun invitePlayerByCoach(playerId: Long, username: String): TeamInviteDTO {
        val team = coachService.getCoachByUsername(username).coachingTeam
            ?: throw EntityNotFoundException("You are not coaching a team")
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

        return createInvite(team, player)
    }

    fun updateInvite(invite: TeamInvite): TeamInviteDTO =
        teamInviteRepository.save(invite).toDTO()

    fun getInvitesByPlayer(id: Long): List<TeamInviteDTO> {
        val player = playerService.getPlayerById(id)

        return teamInviteRepository.findTeamInvitesByPlayer(player).map { it.toDTO() }
    }

    fun countInvites(): Long =
        teamInviteRepository.count()

    fun respondToInvite(id: Long, teamId: Long, isAccepted: Boolean): PlayerDTO {
        val player = playerService.getPlayerById(id)
        if (!player.hasPermission)
            throw IllegalAccessException("You do not have permission to register for WebSocketSecurityConfig.kt team")

        val invite = getInviteById(player.id, teamId)

        if (isAccepted) {
            player.playingTeam = invite.team
            invite.status = InviteStatus.ACCEPTED
        } else {
            invite.status = InviteStatus.DECLINED
        }

        updateInvite(invite)
        return playerService.updatePlayer(player)
    }

    internal fun createInvite(team: Team, player: Player): TeamInviteDTO =
        teamInviteRepository.save(TeamInvite(team = team, player = player)).toDTO()

    internal fun getInviteById(playerId: Long, teamId: Long): TeamInvite =
        teamInviteRepository.findTeamInviteById(TeamInvitePK(teamId, playerId)).orElseThrow { EntityNotFoundException("Invite $teamId -> $playerId not found") }
}
