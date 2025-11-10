package com.jknv.lum.controller

import com.jknv.lum.model.dto.*
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.team.TeamCreateRequest
import com.jknv.lum.model.type.InviteStatus
import com.jknv.lum.model.type.Role
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.CoachService
import com.jknv.lum.services.PlayerService
import com.jknv.lum.services.TeamInviteService
import com.jknv.lum.services.TeamService
import io.mockk.every
import io.mockk.junit5.MockKExtension
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.HttpStatus

@ExtendWith(MockKExtension::class)
class TeamControllerTest {
    val teamService: TeamService = mockk()
    val teamInviteService: TeamInviteService = mockk()
    val coachService: CoachService = mockk()
    val playerService: PlayerService = mockk()

    val teamController: TeamController = TeamController(teamService, teamInviteService, coachService, playerService)

    val details: AccountDetails = mockk()

    lateinit var account: Account
    lateinit var team: Team

    @BeforeEach
    fun setUp() {
        account = Account(name = "name", username = "username", password = "password", role = Role.COACH)
        team = Team(name = "team")

        every { details.id } returns account.id
    }

    @Test
    fun createTeamTest() {
        val req: TeamCreateRequest = mockk()

        every { teamService.createTeam(req) } returns team.toDTO()

        val response = teamController.create(req)

        verify { teamService.createTeam(req) }

        assertEquals(HttpStatus.CREATED, response.statusCode)
        assertEquals(team.toDTO(), response.body)
    }

    @Test
    fun getAllTeamsTest() {
        every { teamService.getTeams() } returns listOf(team.toDTO())

        val response = teamController.getAll()

        verify { teamService.getTeams() }

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(listOf(team.toDTO()), response.body)
    }

    @Test
    fun getTeamTest() {
        every { teamService.getTeam(team.id) } returns team.toDTO()

        val response = teamController.getTeam(team.id)

        verify { teamService.getTeam(team.id) }

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(team.toDTO(), response.body)
    }

    @Test
    fun getPlayersByTeamTest() {
        val playerDTO: PlayerDTO = mockk()

        every { teamService.getPlayersByTeam(team.id) } returns listOf(playerDTO)

        val response = teamController.getPlayersByTeam(team.id)

        verify { teamService.getPlayersByTeam(team.id) }

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(listOf(playerDTO), response.body)
    }

    @Test
    fun getCoachesByTeamTest() {
        val coachDTO: CoachDTO = mockk()

        every { teamService.getCoachesByTeam(team.id) } returns listOf(coachDTO)

        val response = teamController.getCoachesByTeam(team.id)

        verify { teamService.getCoachesByTeam(team.id) }

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(listOf(coachDTO), response.body)
    }

    @Test
    fun addCoachTest() {
        val expected = CoachDTO(
            account = account.toDTO(),
            team = team.toDTO()
        )

        every { coachService.setCoachingTeam(team.id, details.id) } returns expected

        val response = teamController.addCoach(team.id, details)

        verify { coachService.setCoachingTeam(team.id, details.id) }

        assertEquals(HttpStatus.CREATED, response.statusCode)
        assertEquals(expected, response.body)
    }

    @Test
    fun invitePlayerTest() {
        account.role = Role.PLAYER

        val expected = TeamInviteDTO(
            team = team.toDTO(),
            player = account.toDTO(),
            status = InviteStatus.PENDING,
        )

        every { teamInviteService.invitePlayerByCoach(account.id, details.id) } returns expected

        val response = teamController.invitePlayer(account.id, details)

        verify { teamInviteService.invitePlayerByCoach(account.id, details.id) }

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(expected, response.body)
    }

    @Test
    fun removePlayerTest() {
        account.role = Role.PLAYER

        val expected = PlayerDTO(
            account = account.toDTO(),
            guardian = mockk(),
            team = null,
            hasPermission = false,
            position = null,
        )

        every { playerService.removePlayerFromTeam(account.id, details.id) } returns expected

        val response = teamController.removePlayer(account.id, details)

        verify { playerService.removePlayerFromTeam(account.id, details.id) }

        assertEquals(HttpStatus.OK, response.statusCode)
    }
}