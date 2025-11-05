package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Admin
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.repository.AdminRepository
import com.jknv.lum.repository.CoachRepository
import com.jknv.lum.repository.GuardianRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@Order(3)
class AdminSeeder (
    private val adminRepository: AdminRepository,
    private val coachRepository: CoachRepository,
    private val guardianRepository: GuardianRepository,
    private val accountRepository: AccountRepository,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder,
) : CommandLineRunner {

    @Transactional
    override fun run(vararg args: String?) {
        if (adminRepository.count() == 0L) {
            val admins = listOf(
                adminOf("Admin G", "admin")
            )

            admins.forEach {
                it.account = accountRepository.save(it.account)
                adminRepository.save(it)
                coachRepository.save(Coach(account = it.account))
                guardianRepository.save(Guardian(account = it.account))
            }
            LOGGER.info("Admins seeded")
        }
    }

    fun adminOf(name: String, username: String) : Admin =
        Admin(account = accountOf(name, username))

    fun accountOf(name: String, username: String) : Account =
        Account(
            name = name,
            username = username,
            password = bCryptPasswordEncoder.encode("password"),
            role = Role.ADMIN,
        )
}