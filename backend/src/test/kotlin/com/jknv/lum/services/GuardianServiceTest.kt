package com.jknv.lum.services

import com.jknv.lum.model.dto.GuardianDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.GuardianRepository
import io.mockk.every
import io.mockk.mockk
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class GuardianServiceTest {
    val guardianRepository: GuardianRepository = mockk()
    val guardianService = GuardianService(guardianRepository)

    lateinit var guardian: Guardian
    lateinit var guardianDTO: GuardianDTO

    @BeforeTest
    fun setUp() {
        guardian = Guardian(
            account = Account(name = "guardian", username = "guardian", password = "password", role = Role.ADMIN)
        )
        guardianDTO = guardian.toDTO()
    }

    @Test
    fun createGuardianTest() {
        every { guardianRepository.save(any()) } returns guardian

        val result = guardianService.createGuardian(guardian.account)

        assertEquals(result, guardianDTO)
    }

    @Test
    fun getGuardiansTest() {
        every { guardianRepository.findAll() } returns listOf(guardian)

        val result = guardianService.getGuardians()

        assertEquals(result, listOf(guardianDTO))
    }

    @Test
    fun getGuardianByUsernameTest() {
        every { guardianRepository.findByAccountUsername("guardian") } returns guardian

        val result = guardianService.getGuardianByUsername("guardian")

        assertEquals(result, guardian)
    }

    @Test
    fun countGuardiansTest() {
        every { guardianRepository.count() } returns 1

        val count = guardianService.countGuardians()

        assertEquals(count, 1)
    }
}