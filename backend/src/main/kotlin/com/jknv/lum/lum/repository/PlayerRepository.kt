package com.jknv.lum.repository

import com.jknv.lum.model.entity.Player
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PlayerRepository : JpaRepository<Player, Int> {
    fun findPlayerByAccount_Id(accountId: Long): Player?
    fun findPlayerByAccount_Username(accountUsername: String): Player?
}