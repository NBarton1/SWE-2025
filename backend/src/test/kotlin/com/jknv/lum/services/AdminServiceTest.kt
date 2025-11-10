package com.jknv.lum.services

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Admin
import com.jknv.lum.repository.AdminRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class AdminServiceTest {
    private val adminRepository: AdminRepository = mockk()
    private val adminService = AdminService(adminRepository)

    private lateinit var account: Account
    private lateinit var admin: Admin

    @BeforeTest
    fun setUp() {
        account = Account(name = "name", username = "username", password = "pass")
        admin = Admin(account = account)
    }

    @Test
    fun createAdminTest() {
        every { adminRepository.save(any()) } returns admin

        val result = adminService.createAdmin(account)

        verify { adminRepository.save(any()) }
        assertEquals(admin.toDTO(), result)
    }

    @Test
    fun countAdminsTest() {
        val expected = 1L

        every { adminRepository.count() } returns expected

        val result = adminService.countAdmins()

        verify { adminRepository.count() }
        assertEquals(result, expected)
    }
}
