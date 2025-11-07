package com.jknv.lum.services

import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.GuardianRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import jakarta.persistence.EntityNotFoundException
import org.junit.jupiter.api.assertThrows
import java.util.Optional
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class GuardianServiceTest {
    val guardianRepository: GuardianRepository = mockk()
    val guardianService = GuardianService(guardianRepository)

    lateinit var account: Account
    lateinit var guardian: Guardian

    @BeforeTest
    fun setUp() {
        account = Account(name = "guardian", username = "guardian", password = "password", role = Role.GUARDIAN)
        guardian = Guardian(account = account)
    }

    @Test
    fun getGuardianByUsernameTest() {
        every { guardianRepository.findByAccountUsername(any()) } answers {
            if (firstArg<String>() == account.username)
                Optional.of(guardian)
            else Optional.empty()
        }

        val result = guardianService.getGuardianByUsername(account.username)

        verify { guardianRepository.findByAccountUsername(account.username) }

        assertEquals(account, result.account)
        assertThrows<EntityNotFoundException> { guardianService.getGuardianByUsername("") }
    }

    @Test
    fun getGuardianByIdTest() {
        every { guardianRepository.findById(any()) } answers {
            if (firstArg<Long>() == account.id)
                Optional.of(guardian)
            else Optional.empty()
        }

        val result = guardianService.getGuardianById(account.id)

        verify { guardianRepository.findById(account.id) }

        assertEquals(account, result.account)
        assertThrows<EntityNotFoundException> { guardianService.getGuardianById(account.id + 1) }
    }

    @Test
    fun createGuardianTest() {
        every { guardianRepository.save(any()) } returns guardian

        val result = guardianService.createGuardian(account)

        verify { guardianRepository.save(any()) }

        assertEquals(guardian.toDTO(), result)
    }

    @Test
    fun getGuardiansTest() {
        every { guardianRepository.findAll() } returns listOf(guardian)

        val result = guardianService.getGuardians()

        verify { guardianRepository.findAll() }

        assertEquals(result, listOf(guardian.toDTO()))
    }

    @Test
    fun getDependentsOfTest() {
        val player = Player(
            account = Account(name = "player", username = "player", password = "password", role = Role.PLAYER),
            guardian = guardian
        )
        guardian.children.add(player)

        every { guardianRepository.findById(account.id) } returns Optional.of(guardian)

        val result = guardianService.getDependentsOf(account.id)

        verify { guardianRepository.findById(account.id) }

        assertEquals(listOf(player.toDTO()), result)
    }


    @Test
    fun countGuardiansTest() {
        val expected = 1L

        every { guardianRepository.count() } returns expected

        val count = guardianService.countGuardians()

        verify { guardianRepository.count() }

        assertEquals(count, expected)
    }
}