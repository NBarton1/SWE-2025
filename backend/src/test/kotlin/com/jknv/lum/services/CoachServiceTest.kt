package com.jknv.lum.services

import com.jknv.lum.model.dto.CoachDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.CoachRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import jakarta.persistence.EntityNotFoundException
import org.junit.jupiter.api.assertThrows
import java.util.Optional
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class CoachServiceTest {
    val coachRepository: CoachRepository = mockk()
    val teamService: TeamService = mockk()
    val coachService = CoachService(coachRepository, teamService)

    lateinit var account: Account
    lateinit var coach: Coach

    @BeforeTest
    fun setUp() {
        account = Account(name = "coach", username = "coach", password = "password", role = Role.COACH)
        coach = Coach(account = account)
    }

    @Test
    fun getCoachByUsernameTest() {
        every { coachRepository.getCoachByAccountUsername(any()) } answers {
            if (firstArg<String>() == account.username)
                Optional.of(coach)
            else Optional.empty()
        }

        val accountDetails = coachService.getCoachByUsername(account.username)

        verify { coachRepository.getCoachByAccountUsername(account.username) }

        assertEquals(account, accountDetails.account)
        assertThrows<EntityNotFoundException> { coachService.getCoachByUsername("") }
    }

    @Test
    fun getCoachByIdTest() {
        every { coachRepository.getCoachById(any()) } answers {
            if (firstArg<Long>() == account.id)
                Optional.of(coach)
            else Optional.empty()
        }

        val accountDetails = coachService.getCoachById(account.id)

        verify { coachRepository.getCoachById(account.id) }

        assertEquals(account, accountDetails.account)
        assertThrows<EntityNotFoundException> { coachService.getCoachById(account.id + 1) }
    }

    @Test
    fun createCoachTest() {
        every { coachRepository.save(any()) } returns coach

        val result = coachService.createCoach(account)

        verify { coachRepository.save(any()) }

        assertEquals(result, coach.toDTO())
    }

    @Test
    fun getCoachesTest() {
        every { coachRepository.findAll() } returns listOf(coach)

        val result = coachService.getCoaches()

        verify { coachRepository.findAll() }

        assertEquals(result, listOf(coach.toDTO()))
    }

    @Test
    fun countCoachesTest() {
        val expected = 1L

        every { coachRepository.count() } returns expected

        val count = coachService.countCoaches()

        verify { coachRepository.count() }

        assertEquals(count, expected)
    }

    @Test
    fun setCoachingTeamTest() {
        val team = Team(name = "team")

        every { teamService.getTeamById(team.id) } returns team
        every { coachRepository.getCoachById(account.id) } returns Optional.of(coach)
        every { coachRepository.save(coach) } returns coach

        val expected = CoachDTO(
            account = account.toDTO(),
            team = team.toDTO()
        )

        val result = coachService.setCoachingTeam(team.id, coach.account.id)

        verify {
            teamService.getTeamById(team.id)
            coachRepository.getCoachById(account.id)
            coachRepository.save(coach)
        }

        assertEquals(expected, result)
        assertEquals(expected, coach.toDTO())
    }
}