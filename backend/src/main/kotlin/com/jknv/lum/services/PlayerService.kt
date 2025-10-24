package com.jknv.lum.services

import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.type.InviteStatus
import com.jknv.lum.repository.PlayerRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class PlayerService (
    private val playerRepository: PlayerRepository,
    private val accountService: AccountService,
    private val teamInviteService: TeamInviteService,
) {
    fun createPlayer(player: Player): Player {
        accountService.createAccount(player.account)
        return playerRepository.save(player)
    }

    fun getPlayerById(playerId: Long): Player? {
        return playerRepository.findPlayerByAccount_Id(playerId)
    }

    fun getPlayerByUsername(username: String): Player? {
        return playerRepository.findPlayerByAccount_Username(username)
    }

    fun getPlayers(): List<Player> {
        return playerRepository.findAll()
    }

    fun updatePlayerPermission(player: Player, guardian: Guardian, hasPermission: Boolean): Player {
        if (player.guardian.id != guardian.id) {
            throw IllegalAccessException("You do not have permission to modify this player")
        }

        player.hasPermission = hasPermission
        return playerRepository.save(player)
    }

    fun respondToInvite(username: String, teamId: Long, isAccepted: Boolean): Player {
        val player = getPlayerByUsername(username)
            ?: throw EntityNotFoundException("Could not find player $username")
        if (!player.hasPermission)
            throw IllegalAccessException("You do not have permission to register for a team")

        val invite = teamInviteService.getInviteById(player.id, teamId)
            ?: throw EntityNotFoundException("Could not find invite for player $username from team $teamId")

        invite.status = InviteStatus.DECLINED
        if (isAccepted) {
            player.playingTeam = invite.team
            invite.status = InviteStatus.ACCEPTED
        }

        teamInviteService.updateInvite(invite)
        return playerRepository.save(player)
    }
}