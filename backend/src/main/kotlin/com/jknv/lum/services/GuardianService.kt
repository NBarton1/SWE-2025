package com.jknv.lum.services

import com.jknv.lum.model.dto.GuardianDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.repository.GuardianRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class GuardianService (
    private val guardianRepository: GuardianRepository
) {
    fun createGuardian(account: Account): GuardianDTO =
        guardianRepository.save(Guardian(account = account)).toDTO()

    internal fun getGuardianByUsername(username: String): Guardian? =
        guardianRepository.findByAccount_Username(username)

    fun getGuardians(): List<GuardianDTO> =
        guardianRepository.findAll().map { it.toDTO() }

    fun countGuardians(): Long =
        guardianRepository.count()
}
