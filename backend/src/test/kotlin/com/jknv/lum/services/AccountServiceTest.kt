package com.jknv.lum.services

import com.jknv.lum.model.dto.AccountDTO
import com.jknv.lum.model.dto.AdminDTO
import com.jknv.lum.model.dto.CoachDTO
import com.jknv.lum.model.dto.GuardianDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.request.account.AccountLoginRequest
import com.jknv.lum.model.request.account.AccountUpdateRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.AccountRepository
import io.mockk.core.ValueClassSupport.boxedValue
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import kotlin.test.Test
import kotlin.test.assertEquals


class AccountServiceTest {
    val accountRepository: AccountRepository = mockk()
    val authenticationManager: AuthenticationManager = mockk()
    val jwtService: JwtService = mockk()
    val bCryptPasswordEncoder: BCryptPasswordEncoder = mockk()

    val coachService: CoachService = mockk()
    val guardianService: GuardianService = mockk()
    val adminService: AdminService = mockk()

    val accountService: AccountService = AccountService(
        accountRepository,
        authenticationManager,
        bCryptPasswordEncoder,
        jwtService,
        coachService,
        guardianService,
        adminService,
    )
    lateinit var req: AccountCreateRequest
    lateinit var account: Account
    lateinit var accountDTO: AccountDTO

    @BeforeEach
    fun setup() {
        req = AccountCreateRequest(
            name = "name",
            username = "username",
            password = "password",
            role = Role.ADMIN,
        )
        account = req.toEntity()
        accountDTO = account.toDTO()
    }

    @Test
    fun createAccountTest() {
        every { accountRepository.save(any()) } returns account

        val result = accountService.createAccount(req)

        verify(exactly = 1) { accountRepository.save(any()) }
        assertEquals(account.username, result.username)
    }

    @Test
    fun createAccountWithRolesTest() {
        val adminDTO = AdminDTO(account.toSummary())
        val coachDTO = CoachDTO(account.toSummary())
        val guardianDTO = GuardianDTO(account.toSummary())

        every { accountRepository.save(any()) } returns account
        every { adminService.createAdmin(account) } returns adminDTO
        every { coachService.createCoach(account) } returns coachDTO
        every { guardianService.createGuardian(account) } returns guardianDTO

        val result = accountService.createAccountWithRoles(req)

        verify(exactly = 1) { accountRepository.save(any()) }
        verify(exactly = 1) { adminService.createAdmin(account) }
        verify(exactly = 1) { coachService.createCoach(account) }
        verify(exactly = 1) { guardianService.createGuardian(account) }
        assertEquals(accountDTO, result)
    }

    @Test
    fun getAccountByUsernameTest() {
        every { accountRepository.findByUsername("username") } returns account

        val result = accountService.getAccountByUsername("username")

        verify(exactly = 1) { accountRepository.findByUsername("username") }
        assertEquals(account, result)
    }

    @Test
    fun getAccounts() {
        every { accountRepository.findAll() } returns listOf(account)

        val accountList = accountService.getAccounts()

        assertEquals(accountList, listOf(accountDTO))
    }

    @Test
    fun updateAccountTest() {
        val update = AccountUpdateRequest(
            name = "newname",
            username = "newuser",
            password = "newpass",
            picture = ByteArray(0),
        )

        every { accountRepository.findByUsername("username") } returns account
        every { bCryptPasswordEncoder.encode("newpass") } returns "hashedpass"
        every { accountRepository.save(account) } returns account

        val result = accountService.updateAccount("username", update)

        val expectedDTO = AccountDTO(
            id = account.id,
            name = "newname",
            username = "newuser",
            role = account.role
        )

        verify(exactly = 1) { accountRepository.save(account) }
        assertEquals(expectedDTO, result)
        assertEquals("newname", account.name)
        assertEquals("newuser", account.username)
    }

    @Test
    fun deleteAccountTest() {
        val accountId = 1L

        justRun { accountService.deleteAccount(accountId) }
        accountService.deleteAccount(accountId)

        verify(exactly = 1) { accountRepository.deleteById(accountId) }
    }

    @Test
    fun verifyLoginTest() {
        val loginRequest = AccountLoginRequest(username = "username", password = "password")
        val auth: Authentication = mockk()
        every { auth.isAuthenticated } returns true
        every { authenticationManager.authenticate(any<UsernamePasswordAuthenticationToken>()) } returns auth
        every { jwtService.giveToken("username") } returns "token"

        val result = accountService.verifyLogin(loginRequest)

        assertEquals("token", result)
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
