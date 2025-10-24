package com.jknv.lum.services

import com.jknv.lum.model.entity.Team
import com.jknv.lum.repository.TeamInviteRepository
import com.jknv.lum.repository.TeamRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import java.util.Optional
import kotlin.test.Test
import kotlin.test.assertEquals

class TeamServiceTest {
    val teamRepository: TeamRepository = mockk()
    val teamInviteRepository: TeamInviteRepository = mockk()
    val teamService = TeamService(teamRepository, teamInviteRepository)

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
        every { teamRepository.findById(1) } returns Optional.of(team)

        val fetchedTeam = teamService.getTeam(1)

        verify(exactly = 1) { teamRepository.findById(1) }
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
