package com.jknv.lum.services

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.AccountRepository
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.BeforeEach
import kotlin.test.Test
import kotlin.test.assertEquals


class AccountDetailsServiceTest {
    val accountRepository: AccountRepository = mockk()
    val accountDetailsService = AccountDetailsService(accountRepository)
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
    fun loadUserByUsernameTest() {
        every { accountRepository.findByUsername("username") } returns account

        val accountDetails = accountDetailsService.loadUserByUsername("username")

        assertEquals(account, accountDetails.account)
    }
}
