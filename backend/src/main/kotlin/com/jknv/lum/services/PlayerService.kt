package com.jknv.lum.services

import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.repository.PlayerRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class PlayerService (
    private val playerRepository: PlayerRepository,
    private val accountService: AccountService,
    private val guardianService: GuardianService,
) {
    fun createPlayer(req: AccountCreateRequest, username: String): PlayerDTO {
        val guardian = guardianService.getGuardianByUsername(username)
            ?: throw EntityNotFoundException("Guardian not found")

        val account = accountService.createAccount(req)
        val player = Player(account = account, guardian = guardian)
        return playerRepository.save(player).toDTO()
    }

    fun updatePlayer(player: Player): PlayerDTO =
        playerRepository.save(player).toDTO()

    internal fun getPlayerById(playerId: Long): Player? =
        playerRepository.findPlayerByAccount_Id(playerId)

    internal fun getPlayerByUsername(username: String): Player? =
        playerRepository.findPlayerByAccount_Username(username)

    fun getPlayers(): List<PlayerDTO> =
        playerRepository.findAll().map { it.toDTO() }

    fun countPlayers(): Long =
        playerRepository.count()

    fun updatePlayerPermission(playerId: Long, username: String, hasPermission: Boolean): PlayerDTO {
        val player = getPlayerById(playerId)
            ?: throw EntityNotFoundException("Player not found")
        val guardian = guardianService.getGuardianByUsername(username)
            ?: throw EntityNotFoundException("Guardian not found")

        if (player.guardian.id != guardian.id)
            throw IllegalAccessException("You do not have permission to modify this player")

        player.hasPermission = hasPermission
        return updatePlayer(player)
    }
}