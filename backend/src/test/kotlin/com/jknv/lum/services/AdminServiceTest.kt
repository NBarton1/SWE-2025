package com.jknv.lum.services

import com.jknv.lum.model.dto.AdminDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Admin
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.AdminRepository
import io.mockk.every
import io.mockk.mockk
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class AdminServiceTest {
    val adminRepository: AdminRepository = mockk()
    val adminService = AdminService(adminRepository)

    lateinit var admin: Admin
    lateinit var adminDTO: AdminDTO

    @BeforeTest
    fun setUp() {
        admin = Admin(
            account = Account(name = "admin", username = "admin", password = "password", role = Role.ADMIN)
        )
        adminDTO = admin.toDTO()
    }

    @Test
    fun createAdminTest() {
        every { adminRepository.save(any()) } returns admin

        val result = adminService.createAdmin(admin.account)

        assertEquals(result, adminDTO)
    }

    @Test
    fun countAdminsTest() {
        every { adminRepository.count() } returns 1

        val count = adminService.countAdmins()

        assertEquals(count, 1)
    }
}