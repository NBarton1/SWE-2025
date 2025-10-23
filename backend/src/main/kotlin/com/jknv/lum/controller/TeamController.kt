package com.jknv.lum.controller

import com.jknv.lum.config.PreAuthorizeCoach
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.entity.TeamInvite
import com.jknv.lum.services.AccountService
import com.jknv.lum.services.CoachService
import com.jknv.lum.services.TeamService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/api/teams")
class TeamController (
    private val teamService: TeamService,
    private val accountService: AccountService,
    private val coachService: CoachService,
) {
    @PostMapping
    @PreAuthorizeCoach
    fun create(@RequestBody team: Team): ResponseEntity<Team> {
        return ResponseEntity.status(HttpStatus.CREATED).body(teamService.create(team))
    }

    @GetMapping
    fun getAll(): ResponseEntity<List<Team>> {
        return ResponseEntity.ok(teamService.getTeams())
    }

    @PostMapping("/coach/{teamId}")
    @PreAuthorizeCoach
    fun addCoach(@PathVariable teamId: Long, principal: Principal): ResponseEntity<Coach> {
        var coach = coachService.getCoachByUsername(principal.name)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).build()
        var team = teamService.getTeam(teamId)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).build()

        return ResponseEntity.ok(coachService.setTeam(coach, team))
    }

    @PostMapping("/invite/{playerId}")
    @PreAuthorizeCoach
    fun invitePlayer(@PathVariable playerId: Long, principal: Principal): ResponseEntity<TeamInvite> {
        val coach = coachService.getCoachByUsername(principal.name)
            ?: return ResponseEntity.notFound().build()
        val player = accountService.getAccount(playerId)
            ?: return ResponseEntity.notFound().build()

        val team = coachService.getTeam(coach)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(teamService.invite(team, player))
    }
}
