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
import java.security.Principal

@ExtendWith(MockKExtension::class)
class TeamControllerTest {
    var teamService: TeamService = mockk()
    var teamInviteService: TeamInviteService = mockk()
    var coachService: CoachService = mockk()
    var playerService: PlayerService = mockk()

    var teamController: TeamController = TeamController(teamService, teamInviteService, coachService, playerService)

    var details: AccountDetails = mockk()

    lateinit var req: TeamCreateRequest
    lateinit var team: Team
    lateinit var teamDTO: TeamDTO
    lateinit var coach: Coach

    @BeforeEach
    fun setUp() {
        req = TeamCreateRequest(name = "team")
        team = req.toEntity()
        teamDTO = team.toDTO()
        coach = Coach(account = Account(name = "Coach", username = "coach", password = "password", role = Role.COACH))
        every { details.id } returns coach.id
    }

    @Test
    fun createTeamTest() {
        every { teamService.createTeam(req) } returns teamDTO

        val result = teamController.create(req)

        assertEquals(HttpStatus.CREATED, result.statusCode)
        assertEquals(teamDTO, result.body)
        verify { teamService.createTeam(req) }
    }

    @Test
    fun getAllTeamsTest() {
        every { teamService.getTeams() } returns listOf(teamDTO)

        val result = teamController.getAll()

        assertEquals(HttpStatus.OK, result.statusCode)
        assertEquals(listOf(teamDTO), result.body)
        verify { teamService.getTeams() }
    }

    @Test
    fun addCoachTest() {
        val coachDTO = coach.toDTO()

        every { coachService.setCoachingTeam(team.id, details.id) } returns coachDTO

        val result = teamController.addCoach(team.id, details)

        assertEquals(HttpStatus.CREATED, result.statusCode)
        assertEquals(coachDTO, result.body)
        verify { coachService.setCoachingTeam(team.id, details.id) }
    }

    @Test
    fun invitePlayerTest() {
        val playerSummary = AccountDTO(1, "player", "player")
        val TeamDTO = team.toDTO()
        val inviteDTO = TeamInviteDTO(TeamDTO, playerSummary, InviteStatus.PENDING)

        every { teamInviteService.invitePlayerByCoach(playerSummary.id, details.id) } returns inviteDTO

        val result = teamController.invitePlayer(playerSummary.id, details)

        assertEquals(HttpStatus.OK, result.statusCode)
        assertEquals(inviteDTO, result.body)
        verify { teamInviteService.invitePlayerByCoach(playerSummary.id, details.id) }
    }

    @Test
    fun removePlayerTest() {
        val expectedDTO = PlayerDTO(
            account = AccountDTO(1, "dk", "dk"),
            guardian = AccountDTO(1, "dk", "dk"),
            team = null,
            hasPermission = false,
            position = null,
        )
        
        every { playerService.removePlayerFromTeam(1) } returns expectedDTO

        val response = teamController.removePlayer(1)

        verify(exactly = 1) { playerService.removePlayerFromTeam(1) }
        assertEquals(HttpStatus.OK, response.statusCode)
    }
}