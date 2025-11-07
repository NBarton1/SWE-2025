package com.jknv.lum.services

import com.jknv.lum.model.dto.AccountDTO
import com.jknv.lum.model.dto.AdminDTO
import com.jknv.lum.model.dto.CoachDTO
import com.jknv.lum.model.dto.GuardianDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Content
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.request.account.AccountLoginRequest
import com.jknv.lum.model.request.account.AccountUpdateRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.security.AccountDetails
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import jakarta.persistence.EntityNotFoundException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.assertThrows
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.Authentication
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import java.util.Optional
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

    val req: AccountCreateRequest = mockk()
    lateinit var account: Account
    lateinit var details: AccountDetails

    @BeforeEach
    fun setup() {
        account = Account(name = "name", username = "username", password = "password", role = Role.ADMIN)
        details = AccountDetails(account)

        every { req.toEntity() } returns account
    }

    @Test
    fun createAccountTest() {
        every { accountRepository.save(account) } returns account

        val result = accountService.createAccount(req)

        verify { accountRepository.save(account) }

        assertEquals(account.username, result.username)
    }

    @Test
    fun getAccountByUsernameTest() {
        every { accountRepository.findByUsername(any()) } answers {
            if (firstArg<String>() == account.username)
                Optional.of(account)
            else Optional.empty()
        }

        val result = accountService.getAccountByUsername(account.username)

        verify { accountRepository.findByUsername(account.username) }

        assertEquals(account, result)
        assertThrows<EntityNotFoundException> { accountService.getAccountByUsername("") }
    }

    @Test
    fun getAccountByIdTest() {
        every { accountRepository.findById(any()) } answers {
            if (firstArg<Long>() == account.id)
                Optional.of(account)
            else Optional.empty()
        }

        val result = accountService.getAccountById(account.id)

        verify { accountRepository.findById(account.id) }

        assertEquals(account, result)
        assertThrows<EntityNotFoundException> { accountService.getAccountById(account.id + 1) }
    }

    @Test
    fun createAccountWithRolesTest() {
        every { accountRepository.save(account) } returns account
        every { adminService.createAdmin(account) } returns AdminDTO(account.toDTO())
        every { coachService.createCoach(account) } returns CoachDTO(account.toDTO())
        every { guardianService.createGuardian(account) } returns GuardianDTO(account.toDTO())

        val result = accountService.createAccountWithRoles(req)

        verify {
            accountRepository.save(account)
            adminService.createAdmin(account)
            coachService.createCoach(account)
            guardianService.createGuardian(account)
        }

        assertEquals(account.toDTO(), result)
    }

    @Test
    fun getAccountTest() {
        every { accountRepository.findById(account.id) } returns Optional.of(account)

        val result = accountService.getAccount(account.id)

        verify { accountRepository.findById(account.id) }

        assertEquals(result, account.toDTO())
    }

    @Test
    fun getAccountsTest() {
        every { accountRepository.findAll() } returns listOf(account)

        val result = accountService.getAccounts()

        verify { accountRepository.findAll() }

        assertEquals(result, listOf(account.toDTO()))
    }

    @Test
    fun updateAccountTest() {
        val update = AccountUpdateRequest(
            name = "newname",
            username = "newusername",
            password = "newpassword",
        )

        every { accountRepository.findById(account.id) } returns Optional.of(account)
        every { bCryptPasswordEncoder.encode(update.password) } returns update.password
        every { accountRepository.save(account) } returns account

        val expected = AccountDTO(
            id = account.id,
            name = update.name ?: account.name,
            username = update.username ?: account.username,
            email = update.email ?: account.email,
            role = account.role,
            picture = account.picture?.toDTO()
        )

        val result = accountService.updateAccount(account.id, update)

        verify {
            accountRepository.findById(account.id)
            bCryptPasswordEncoder.encode(update.password)
            accountRepository.save(account)
        }

        assertEquals(expected, result)
        assertEquals(expected, account.toDTO())
    }

    @Test
    fun updatePictureTest() {
        val picture = Content(
            filename = "filename",
            fileSize = 0xff,
            contentType = "png"
        )

        every { accountRepository.save(account) } returns account

        val expected = AccountDTO(
            id = account.id,
            name = account.name,
            username = account.username,
            email = account.email,
            role = account.role,
            picture = picture.toDTO()
        )

        val result = accountService.updatePictureForAccount(account, picture)

        verify { accountRepository.save(account) }

        assertEquals(expected, result)
        assertEquals(expected, account.toDTO())
    }

    @Test
    fun deleteAccountTest() {
        justRun { accountService.deleteAccount(account.id) }
        accountService.deleteAccount(account.id)

        verify { accountRepository.deleteById(account.id) }
    }

    @Test
    fun verifyLoginTest() {
        val loginRequest = AccountLoginRequest(account.username, account.password)
        val auth: Authentication = mockk()

        val expected = "token"

        every { authenticationManager.authenticate(any()) } returns auth
        every { auth.isAuthenticated } returns true
        every { auth.principal } returns details
        every { jwtService.giveToken(account.id) } returns expected

        val result = accountService.verifyLogin(loginRequest)

        verify {
            authenticationManager.authenticate(any())
            auth.isAuthenticated
            auth.principal
            jwtService.giveToken(account.id)
        }

        assertEquals(expected, result)
    }


    @Test
    fun countAccountsTest() {
        val expected = 1L

        every { accountRepository.count() } returns expected

        val result = accountService.countAccounts()

        verify { accountRepository.count() }

        assertEquals(expected, result)
    }
}
