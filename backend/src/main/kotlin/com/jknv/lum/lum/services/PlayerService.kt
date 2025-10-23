package com.jknv.lum.services

import com.jknv.lum.model.entity.Player
import com.jknv.lum.repository.PlayerRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class PlayerService (
    private val playerRepository: PlayerRepository,
) {
    fun create(player: Player): Player {
        return playerRepository.save(player)
    }

    fun getPlayer(playerId: Long): Player? {
        return playerRepository.findPlayerByAccount_Id(playerId)
    }

    fun getPlayerByUsername(username: String): Player? {
        return playerRepository.findPlayerByAccount_Username(username)
    }

    fun getPlayers(): List<Player> {
        return playerRepository.findAll()
    }
}