package com.jknv.lum.controller

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.request.AccountLoginRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.services.AccountService
import com.jknv.lum.services.CoachService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.security.core.AuthenticationException
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.transaction.annotation.Transactional


@SpringBootTest
@Transactional
class AccountControllerTest {
    @Autowired
    lateinit var accountController: AccountController

    @Autowired
    lateinit var accountService: AccountService

    lateinit var account: Account

    @BeforeEach
    fun setup() {
        account = Account(
            name = "name",
            username = "username",
            password = "password",
            role = Role.ADMIN,
        )
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun validLoginTest() {
        accountService.createAccount(account)

        val req = AccountLoginRequest(
            username = "username",
            password = "password",
        )

        val res = accountController.login(req)

        assertEquals(HttpStatus.ACCEPTED, res.statusCode)
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun invalidLoginTest() {
        val req = AccountLoginRequest(
            username = "username",
            password = "password",
        )

        assertThrows(AuthenticationException::class.java) {
            accountController.login(req)
        }
    }
}
