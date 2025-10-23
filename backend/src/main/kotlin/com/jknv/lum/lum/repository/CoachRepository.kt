package com.jknv.lum.repository

import com.jknv.lum.model.entity.Coach
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CoachRepository : JpaRepository<Coach, Int> {
    fun getCoachByAccount_Username(accountUsername: String): Coach?
}
