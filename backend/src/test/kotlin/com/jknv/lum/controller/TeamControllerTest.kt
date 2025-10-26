package com.jknv.lum.controller

import com.jknv.lum.model.dto.*
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.team.TeamCreateRequest
import com.jknv.lum.model.type.InviteStatus
import com.jknv.lum.model.type.Role
import com.jknv.lum.services.CoachService
import com.jknv.lum.services.TeamInviteService
import com.jknv.lum.services.TeamService
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
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

    var teamController: TeamController = TeamController(teamService, teamInviteService, coachService)

    var principal: Principal = Principal { "coach" }

    lateinit var req: TeamCreateRequest
    lateinit var team: Team
    lateinit var teamDTO: TeamDTO

    @BeforeEach
    fun setUp() {
        req = TeamCreateRequest(name = "team")
        team = req.toEntity()
        teamDTO = team.toDTO()
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
        val coach = Coach(account = Account(name = "coach", username = principal.name, password = "password", role = Role.COACH),)
        val coachDTO = coach.toDTO()

        every { coachService.setCoachingTeam(team.id, principal.name) } returns coachDTO

        val result = teamController.addCoach(team.id, principal)

        assertEquals(HttpStatus.CREATED, result.statusCode)
        assertEquals(coachDTO, result.body)
        verify { coachService.setCoachingTeam(team.id, principal.name) }
    }

    @Test
    fun invitePlayerTest() {
        val playerSummary = AccountSummary(1, "player", "player")
        val teamSummary = team.toSummary()
        val inviteDTO = TeamInviteDTO(teamSummary, playerSummary, InviteStatus.PENDING)

        every { teamInviteService.invitePlayerByCoach(playerSummary.id, principal.name) } returns inviteDTO

        val result = teamController.invitePlayer(playerSummary.id, principal)

        assertEquals(HttpStatus.OK, result.statusCode)
        assertEquals(inviteDTO, result.body)
        verify { teamInviteService.invitePlayerByCoach(playerSummary.id, principal.name) }
    }
}