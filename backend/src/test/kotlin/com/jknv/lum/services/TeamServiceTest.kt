package com.jknv.lum.services

import com.jknv.lum.model.entity.Team
import com.jknv.lum.repository.TeamRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import kotlin.test.Test
import kotlin.test.assertEquals

class TeamServiceTest {
    val teamRepository: TeamRepository = mockk()
    val teamService = TeamService(teamRepository)

    lateinit var team: Team

    @BeforeEach
    fun setup() {
        team = Team(name = "name")
    }

    @Test
    fun createTest() {
        every { teamRepository.save(team) } returns team

        val savedTeam = teamService.createTeam(team)

        verify(exactly = 1) { teamRepository.save(team) }
        assertEquals(savedTeam, team)
    }

    @Test
    fun getTeamByIdTest() {
        every { teamRepository.getReferenceById(1) } returns team

        val fetchedTeam = teamService.getTeamById(1)

        verify(exactly = 1) { teamRepository.getReferenceById(1) }
        assertEquals(fetchedTeam, team)
    }

    @Test
    fun getTeamsTest() {
        every { teamRepository.findAll() } returns listOf(team)

        val teamList = teamService.getTeams()

        verify(exactly = 1) { teamRepository.findAll() }
        assertEquals(teamList, listOf(team))
    }

    @Test
    fun countTest() {
        val expectedCount = 1L

        every { teamRepository.count() } returns expectedCount

        val count = teamService.countTeams()

        verify(exactly = 1) { teamRepository.count() }
        assertEquals(count, expectedCount)
    }
}
