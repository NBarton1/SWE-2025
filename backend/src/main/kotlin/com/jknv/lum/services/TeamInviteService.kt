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
        val player = playerService.getPlayerById(playerId)

        return createInvite(team, player)
    }

    fun updateInvite(invite: TeamInvite): TeamInviteDTO =
        teamInviteRepository.save(invite).toDTO()

    fun getInvitesByPlayer(username: String): List<TeamInviteDTO> {
        val player = playerService.getPlayerByUsername(username)
        return teamInviteRepository.findTeamInvitesByPlayer(player).map { it.toDTO() }
    }

    fun countInvites(): Long =
        teamInviteRepository.count()

    fun respondToInvite(username: String, teamId: Long, isAccepted: Boolean): PlayerDTO {
        val player = playerService.getPlayerByUsername(username)
        if (!player.hasPermission)
            throw IllegalAccessException("You do not have permission to register for a team")

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
