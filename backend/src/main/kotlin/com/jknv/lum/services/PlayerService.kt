package com.jknv.lum.services

import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.entity.Player
import com.jknv.lum.repository.PlayerRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class PlayerService (
    private val playerRepository: PlayerRepository,
    private val accountService: AccountService,
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
}