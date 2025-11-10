package com.jknv.lum.repository

import com.jknv.lum.model.entity.Coach
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface CoachRepository : JpaRepository<Coach, Int> {
    fun getCoachById(accountId: Long): Optional<Coach>
    fun getCoachByAccountUsername(accountUsername: String): Optional<Coach>
}
