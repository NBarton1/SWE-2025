package com.jknv.lum.repository

import com.jknv.lum.model.entity.Guardian
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface GuardianRepository: JpaRepository<Guardian, Long> {
    fun findByAccountUsername(accountUsername: String): Optional<Guardian>
}