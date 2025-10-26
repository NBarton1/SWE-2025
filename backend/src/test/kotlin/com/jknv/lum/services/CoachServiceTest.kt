package com.jknv.lum.services

import com.jknv.lum.model.dto.CoachDTO
import com.jknv.lum.model.dto.TeamDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.CoachRepository
import io.mockk.every
import io.mockk.excludeRecords
import io.mockk.mockk
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class CoachServiceTest {
    val coachRepository: CoachRepository = mockk()
    val teamService: TeamService = mockk()
    val coachService = CoachService(coachRepository, teamService)

    lateinit var coach: Coach
    lateinit var coachDTO: CoachDTO

    @BeforeTest
    fun setUp() {
        coach = Coach(
            account = Account(name = "coach", username = "coach", password = "password", role = Role.ADMIN)
        )
        coachDTO = coach.toDTO()
    }

    @Test
    fun createCoachTest() {
        every { coachRepository.save(any()) } returns coach

        val result = coachService.createCoach(coach.account)

        assertEquals(result, coachDTO)
    }

    @Test
    fun getCoachesTest() {
        every { coachRepository.findAll() } returns listOf(coach)

        val result = coachService.getCoaches()

        assertEquals(result, listOf(coachDTO))
    }

    @Test
    fun getCoachByUsernameTest() {
        every { coachRepository.getCoachByAccount_Username("coach") } returns coach

        val result = coachService.getCoachByUsername("coach")

        assertEquals(result, coach)
    }

    @Test
    fun countCoachesTest() {
        every { coachRepository.count() } returns 1

        val count = coachService.countCoaches()

        assertEquals(count, 1)
    }

    @Test
    fun setCoachingTeamTest() {
        val team = Team(name = "team")
        val expectedDTO = CoachDTO(account = coach.account.toSummary(), team = team.toSummary())

        every { teamService.getTeamById(any()) } returns team
        every { coachRepository.getCoachByAccount_Username(coach.account.username) } returns coach
        every { coachRepository.save(coach) } returns coach

        val result = coachService.setCoachingTeam(team.id, coach.account.username)

        assertEquals(result, expectedDTO)
    }
}