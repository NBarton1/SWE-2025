package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.services.AccountService
import com.jknv.lum.services.GuardianService
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component

@Component
@Order(1)
class GuardianSeeder (
    private val accountService: AccountService,
    private val guardianService: GuardianService,
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        if (guardianService.countGuardians() == 0L) {
            val accounts = listOf(
                toRequest(name = "Guardian G", username = "guardian"),
            )

            accounts.forEach { accountService.createAccountWithRoles(it) }
            LOGGER.info("Guardians seeded")
        }
    }

    fun toRequest(name: String, username: String) : AccountCreateRequest =
        AccountCreateRequest(
            name = name,
            username = username,
            password = "password",
            role = Role.GUARDIAN,
        )
}