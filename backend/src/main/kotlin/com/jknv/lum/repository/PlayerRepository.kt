package com.jknv.lum.repository

import com.jknv.lum.model.entity.Player
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PlayerRepository : JpaRepository<Player, Long> {
    fun findPlayerByAccountId(accountId: Long): Player?
    fun findPlayerByAccountUsername(accountUsername: String): Player?
}