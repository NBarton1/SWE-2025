package com.jknv.lum.repository

import com.jknv.lum.model.entity.Player
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface PlayerRepository : JpaRepository<Player, Long> {
    fun findPlayerByAccount_Id(accountId: Long): Optional<Player>
    fun findPlayerByAccount_Username(accountUsername: String): Optional<Player>
}