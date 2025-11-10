package com.jknv.lum.services

import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.request.player.PlayerFilter
import com.jknv.lum.repository.PlayerRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class PlayerService (
    private val playerRepository: PlayerRepository,
    private val guardianService: GuardianService,
    private val coachService: CoachService,
) {
    fun setPlayerGuardian(playerId: Long, guardianId: Long): PlayerDTO {
        val player = getPlayerById(playerId)
        if (player.guardian != null)
            throw IllegalAccessException("$playerId already has a guardian")

        val guardian = guardianService.getGuardianById(guardianId)

        player.guardian = guardian
        return updatePlayer(player)
    }

    fun getPlayers(filter: PlayerFilter?): List<PlayerDTO> =
        playerRepository.findAll()
            .filter { player -> filter?.let { f ->
                f.isOrphan?.let { it == (player.guardian == null) } ?: true
            } ?: true }
            .map { it.toDTO() }

    fun updatePlayerPermission(playerId: Long, accountId: Long, hasPermission: Boolean): PlayerDTO {
        val player = getPlayerById(playerId)
        val guardian = guardianService.getGuardianById(accountId)

        if (player.guardian?.id != guardian.id)
            throw IllegalAccessException("You do not have permission to modify this player")

        player.hasPermission = hasPermission
        return updatePlayer(player)
    }

    fun removePlayerFromTeam(playerId: Long, coachId: Long): PlayerDTO {
        val coach = coachService.getCoachById(coachId)
        val player = getPlayerById(playerId)

        if (coach.coachingTeam?.id != player.playingTeam?.id)
            throw IllegalAccessException("You cannot remove this player from your team")

        player.playingTeam = null
        return updatePlayer(player)
    }

    internal fun createPlayer(account: Account): PlayerDTO =
        playerRepository.save(Player(account = account)).toDTO()

    internal fun updatePlayer(player: Player): PlayerDTO =
        playerRepository.save(player).toDTO()

    internal fun getPlayerById(playerId: Long): Player =
        playerRepository.findById(playerId).orElseThrow { EntityNotFoundException("Player $playerId not found") }
}
