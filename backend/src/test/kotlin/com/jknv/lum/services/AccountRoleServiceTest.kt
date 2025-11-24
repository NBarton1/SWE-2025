package com.jknv.lum.services

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.type.Role
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import kotlin.test.Test

class AccountRoleServiceTest {
    private val coachService: CoachService = mockk()
    private val guardianService: GuardianService = mockk()
    private val adminService: AdminService = mockk()
    private val playerService: PlayerService = mockk()

    val roleService = AccountRoleService(coachService, guardianService, adminService, playerService)

    lateinit var account: Account

    @BeforeEach
    fun setUp() {
        account = Account(name = "name", username = "user", password = "password", role = Role.ADMIN)

        every { adminService.createAdmin(account) } returns mockk()
        every { coachService.createCoach(account) } returns mockk()
        every { guardianService.createGuardian(account) } returns mockk()
        every { playerService.createPlayer(account) } returns mockk()
    }

    @Test
    fun createAccountTest() {
        roleService.createAccount(account)

        verify {
            adminService.createAdmin(account)
            coachService.createCoach(account)
            guardianService.createGuardian(account)
        }
    }

    @Test
    fun updateRoleTest() {
        roleService.updateRole(account, Role.PLAYER)

        verify { playerService.createPlayer(account) }
    }
}