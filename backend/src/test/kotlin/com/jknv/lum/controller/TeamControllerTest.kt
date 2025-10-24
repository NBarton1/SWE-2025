package com.jknv.lum.controller

import com.jknv.lum.config.PreAuthorizeCoach
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.entity.TeamInvite
import com.jknv.lum.model.type.Role
import com.jknv.lum.services.CoachService
import com.jknv.lum.services.TeamService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.ResponseEntity
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import java.security.Principal
import kotlin.test.assertTrue


@SpringBootTest
@Transactional
class TeamControllerTest {
    @Autowired
    lateinit var teamController: TeamController

    @Autowired
    lateinit var teamService: TeamService

    @Autowired
    lateinit var coachService: CoachService

    lateinit var team: Team

    @BeforeEach
    fun setup() {
        team = teamService.create(Team(name = "Home Team"))
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun addCoachTest() {
        val account = Account(
            name = "name",
            username = "username",
            password = "password",
            role = Role.ADMIN,
        )

        val coach = Coach(account = account)

        coachService.create(coach)

        val principal = Principal { "username" }

        val res = teamController.addCoach(team.id!!, principal)

        assertEquals(200, res.statusCode.value())
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun addInvalidCoachTest() {
        val principal = Principal { "username" }

        val res = teamController.addCoach(team.id!!, principal)

        assertTrue(res.statusCode.isError)
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun inviteInvalidPlayerTest() {
        val account = Account(
            name = "name",
            username = "username",
            password = "password",
            role = Role.ADMIN,
        )

        val coach = Coach(account = account)

        coachService.create(coach)

        val principal = Principal { "username" }

        val res = teamController.addCoach(team.id!!, principal)

        assertEquals(200, res.statusCode.value())

        val inviteRes = teamController.invitePlayer(0, Principal { "username" })

        assertTrue(inviteRes.statusCode.isError)
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun inviteInvalidPlayerTest1() {
        val inviteRes = teamController.invitePlayer(0, Principal { "username" })

        assertTrue(inviteRes.statusCode.isError)
    }

//    @PostMapping("/invite/{playerId}")
//    @PreAuthorizeCoach
//    fun invitePlayer(@PathVariable playerId: Long, principal: Principal): ResponseEntity<TeamInvite> {
//        val coach = coachService.getCoachByUsername(principal.name)
//            ?: return ResponseEntity.notFound().build()
//        val player = accountService.getAccount(playerId)
//            ?: return ResponseEntity.notFound().build()
//
//        val team = coachService.getTeam(coach)
//            ?: return ResponseEntity.notFound().build()
//
//        return ResponseEntity.ok(teamService.invite(team, player))
//    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun getMatchesTest() {
        val response = teamController.getAll()

        assertEquals(200, response.statusCode.value())
    }
}