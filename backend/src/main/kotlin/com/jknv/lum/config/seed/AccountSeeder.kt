package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.type.Role
import com.jknv.lum.services.AccountService
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class AccountSeeder (
    private val accountService: AccountService
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        if (accountService.countAccounts() == 0L) {
            val accounts = listOf(
                Account(name = "Kyle R", username = "krichards", password = "password", role = Role.ADMIN),
                Account(name = "Joe F", username = "jfielding", password = "password", role = Role.COACH),
                Account(name = "Nate B", username = "nbarton", password = "password", role = Role.GUARDIAN),
                Account(name = "Vilnis J", username = "vjatnieks", password = "password", role = Role.PLAYER),
            )

            accounts.forEach { accountService.createAccount(it) }
            LOGGER.info("Accounts seeded")
        }
    }
}
