package com.jknv.lum.repository

import com.jknv.lum.model.entity.Player
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface PlayerRepository : JpaRepository<Player, Long> {
    fun findPlayerByAccountId(accountId: Long): Optional<Player>
    fun findPlayerByAccountUsername(accountUsername: String): Optional<Player>
}