package com.jknv.lum.services

import com.jknv.lum.model.dto.AdminDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Admin
import com.jknv.lum.repository.AdminRepository
import jakarta.persistence.Inheritance
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
@Inheritance
class AdminService (
    private val adminRepository: AdminRepository
) {
    fun createAdmin(account: Account): AdminDTO =
        adminRepository.save(Admin(account = account)).toDTO()

    internal fun isAdmin(id: Long): Boolean =
        adminRepository.existsById(id)

    fun countAdmins(): Long =
        adminRepository.count()
}