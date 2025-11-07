package com.jknv.lum.services

import com.jknv.lum.model.dto.CoachDTO
import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.team.TeamCreateRequest
import com.jknv.lum.repository.TeamRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import jakarta.persistence.EntityNotFoundException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.assertThrows
import java.util.Optional
import kotlin.test.Test
import kotlin.test.assertEquals

class TeamServiceTest {
    val teamRepository: TeamRepository = mockk()
    val teamService = TeamService(teamRepository)

    val req: TeamCreateRequest = mockk()

    lateinit var team: Team

    @BeforeEach
    fun setup() {
        team = Team(name = "name")

        every { req.toEntity() } returns team
    }

    @Test
    fun getTeamByIdTest() {
        every { teamRepository.findById(any()) } answers {
            if (firstArg<Long>() == team.id)
                Optional.of(team)
            else Optional.empty()
        }

        val result = teamService.getTeamById(team.id)

        verify { teamRepository.findById(team.id) }

        assertEquals(result, team)
        assertThrows<EntityNotFoundException> { teamService.getTeamById(team.id + 1) }
    }

    @Test
    fun createTeamTest() {
        every { teamRepository.save(team) } returns team

        val result = teamService.createTeam(req)

        verify { teamRepository.save(team) }

        assertEquals(team.toDTO(), result)
    }

    @Test
    fun getTeamsTest() {
        every { teamRepository.findAll() } returns listOf(team)

        val teamList = teamService.getTeams()

        verify { teamRepository.findAll() }

        assertEquals(teamList, listOf(team.toDTO()))
    }

    @Test
    fun getTeamTest() {
        every { teamRepository.findById(team.id) } returns Optional.of(team)

        val result = teamService.getTeam(team.id)

        verify { teamRepository.findById(team.id) }

        assertEquals(result, team.toDTO())
    }

    @Test
    fun getPlayersByTeamTest() {
        val player: Player = mockk()
        val playerDTO: PlayerDTO = mockk()
        every { player.toDTO() } returns playerDTO

        team.players.add(player)

        every { teamRepository.findById(team.id) } returns Optional.of(team)

        val result = teamService.getPlayersByTeam(team.id)

        verify { teamRepository.findById(team.id) }

        assertEquals(result, listOf(playerDTO))
    }

    @Test
    fun getCoachesByTeamTest() {
        val coach: Coach = mockk()
        val coachDTO: CoachDTO = mockk()
        every { coach.toDTO() } returns coachDTO

        team.coaches.add(coach)

        every { teamRepository.findById(team.id) } returns Optional.of(team)

        val result = teamService.getCoachesByTeam(team.id)

        verify { teamRepository.findById(team.id) }

        assertEquals(result, listOf(coachDTO))
    }

    @Test
    fun countTest() {
        val expected = 1L

        every { teamRepository.count() } returns expected

        val count = teamService.countTeams()

        verify { teamRepository.count() }

        assertEquals(count, expected)
    }
}
