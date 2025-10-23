package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.type.Role
import com.jknv.lum.services.AccountService
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component

@Component
@Order(1)
class AccountSeeder (
    private val accountService: AccountService
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        if (accountService.countAccounts() == 0L) {
            val accounts = listOf(
                Account(name = "Admin A", username = "admin", password = "password", role = Role.ADMIN),
                Account(name = "Coach C", username = "coach", password = "password", role = Role.COACH),
                Account(name = "Guardian G", username = "guardian", password = "password", role = Role.GUARDIAN),
                Account(name = "Player P", username = "player", password = "password", role = Role.PLAYER),
            )

            accounts.forEach { accountService.createAccount(it) }
            LOGGER.info("Accounts seeded")
        }
    }
}
