package com.jknv.lum.services

import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.repository.GuardianRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class GuardianService (
    private val guardianRepository: GuardianRepository
) {
    fun createGuardian(guardian: Guardian): Guardian {
        return guardianRepository.save(guardian)
    }

    fun getGuardianById(guardianId: Long): Guardian? {
        return guardianRepository.findById(guardianId).orElse(null)
    }

    fun getGuardianByUsername(username: String): Guardian? {
        return guardianRepository.findByAccount_Username(username)
    }

    fun getGuardians(): List<Guardian> {
        return guardianRepository.findAll()
    }
}