package com.jknv.lum.services

import com.jknv.lum.model.dto.TeamDTO
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.team.TeamCreateRequest
import com.jknv.lum.repository.TeamRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import java.util.Optional
import kotlin.test.Test
import kotlin.test.assertEquals

class TeamServiceTest {
    private val teamRepository: TeamRepository = mockk()
    private val teamService = TeamService(teamRepository)

    private lateinit var req: TeamCreateRequest
    private lateinit var team: Team
    private lateinit var teamDTO: TeamDTO

    @BeforeEach
    fun setup() {
        req = TeamCreateRequest(name = "name")
        team = req.toEntity()
        teamDTO = team.toDTO()
    }

    @Test
    fun createTeamTest() {
        every { teamRepository.save(team) } returns team

        val result = teamService.createTeam(req)

        verify(exactly = 1) { teamRepository.save(team) }
        assertEquals(teamDTO, result)
    }

    @Test
    fun getTeamByIdTest() {
        every { teamRepository.findById(1) } returns Optional.of(team)

        val fetchedTeam = teamService.getTeamById(1)

        verify(exactly = 1) { teamRepository.findById(1) }
        assertEquals(fetchedTeam, team)
    }

    @Test
    fun getTeamsTest() {
        every { teamRepository.findAll() } returns listOf(team)

        val teamList = teamService.getTeams()

        verify(exactly = 1) { teamRepository.findAll() }
        assertEquals(teamList, listOf(teamDTO))
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
