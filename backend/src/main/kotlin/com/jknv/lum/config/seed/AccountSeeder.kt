package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Account
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
                Account(name = "Kyle R", username = "krichards", password = "password"),
                Account(name = "Joe F", username = "nbarton", password = "P455W0RD"),
                Account(name = "Nate B", username = "jfielding", password = "p@ssw9rd"),
                Account(name = "Vilnis J", username = "vjatnieks", password = "PaSsWoRd")
            )

            accounts.forEach { accountService.createAccount(it) }
            LOGGER.info("Accounts seeded")
        }
    }
}
