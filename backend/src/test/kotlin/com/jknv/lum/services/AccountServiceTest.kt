package com.jknv.lum.services

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.request.account.AccountUpdateRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.AccountRepository
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import java.util.*
import kotlin.test.Test
import kotlin.test.assertEquals


class AccountServiceTest {
    val accountRepository: AccountRepository = mockk()
    val authenticationManager: AuthenticationManager = mockk()
    val jwtService: JwtService = mockk()
    val bCryptPasswordEncoder: BCryptPasswordEncoder = mockk()

    val coachService: CoachService = mockk()
    val guardianService: GuardianService = mockk()

    val accountService: AccountService = AccountService(
        accountRepository,
        authenticationManager,
        bCryptPasswordEncoder,
        jwtService,
        coachService,
        guardianService,
    )
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
    fun getAccountTest() {
        every { accountRepository.findById(1) } returns Optional.ofNullable(account)

        val accountFound = accountService.getAccountById(1)

        assertEquals(account, accountFound)
    }

    @Test
    fun getAccounts() {
        every { accountRepository.findAll() } returns listOf(account)

        val accountList = accountService.getAccounts()

        assertEquals(accountList, listOf(account))
    }

    @Test
    fun updateAccountTest() {
        every { bCryptPasswordEncoder.encode(any()) } returns "password"
        every {accountRepository.save(any())} returns account
        every { accountService.getAccountById(1) } returns account

        val req = AccountUpdateRequest(
            name = "name1",
            username = "name1",
            password = "name1",
            picture = ByteArray(0),
        )

        val updatedAccount = accountService.updateAccount(1, req)

        assertEquals(account, updatedAccount)
    }

    @Test
    fun deleteAccountTest() {
        val accountId = 1L

        justRun { accountService.deleteAccount(accountId) }
        accountService.deleteAccount(accountId)

        verify(exactly = 1) { accountRepository.deleteById(accountId) }
    }

    @Test
    fun countAccountsTest() {
        val expectedCount = 1L

        every { accountRepository.count() } returns expectedCount

        val count = accountService.countAccounts()

        verify(exactly = 1) { accountRepository.count() }

        assertEquals(expectedCount, count)
    }
}
