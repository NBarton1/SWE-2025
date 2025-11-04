package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.repository.GuardianRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@Order(1)
class GuardianSeeder (
    private val guardianRepository: GuardianRepository,
    private val accountRepository: AccountRepository,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder,
) : CommandLineRunner {

    @Transactional
    override fun run(vararg args: String?) {
        if (guardianRepository.count() == 0L) {
            val guardians = listOf(
                guardianOf("Guardian G", "guardian")
            )

            guardians.forEach {
                it.account = accountRepository.save(it.account)
                guardianRepository.save(it)
            }
            LOGGER.info("Guardians seeded")
        }
    }

    fun guardianOf(name: String, username: String) : Guardian =
        Guardian(account = accountOf(name, username))

    fun accountOf(name: String, username: String) : Account =
        Account(
            name = name,
            username = username,
            password = bCryptPasswordEncoder.encode("password"),
            role = Role.GUARDIAN,
        )
}