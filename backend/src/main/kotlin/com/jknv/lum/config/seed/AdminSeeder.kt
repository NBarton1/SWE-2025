package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.services.AccountService
import com.jknv.lum.services.AdminService
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component

@Component
@Order(3)
class AdminSeeder (
    private val accountService: AccountService,
    private val adminService: AdminService,
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        if (adminService.countAdmins() == 0L) {
            val accounts = listOf(
                toRequest(name = "Admin A", username = "admin"),
            )

            accounts.forEach { accountService.createAccountWithRoles(it) }
            LOGGER.info("Admins seeded")
        }
    }

    fun toRequest(name: String, username: String) : AccountCreateRequest =
        AccountCreateRequest(
            name = name,
            username = username,
            password = "password",
            role = Role.ADMIN,
        )
}