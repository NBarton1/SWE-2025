package com.jknv.lum.controller

import com.jknv.lum.LOGGER
import com.jknv.lum.config.PreAuthorizeCoach
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
        val newTeam = teamService.create(team)
        return ResponseEntity.status(HttpStatus.CREATED).body(newTeam)
    }

    @GetMapping
    fun getAll(): ResponseEntity<List<Team>> {
        return ResponseEntity.ok(teamService.getTeams())
    }

    @PostMapping("/invite/{id}")
    @PreAuthorizeCoach
    fun invitePlayer(@PathVariable id: Long, principal: Principal): ResponseEntity<TeamInvite> {
        LOGGER.info("Getting coach")
        val coach = coachService.getCoachByUsername(principal.name)
            ?: return ResponseEntity.notFound().build()
        LOGGER.info("Getting player")
        val player = accountService.getAccount(id)
            ?: return ResponseEntity.notFound().build()

        LOGGER.info("Getting team")
        val team = coachService.getTeam(coach)
            ?: return ResponseEntity.notFound().build()

        LOGGER.info("Sending invite")
        return ResponseEntity.ok(teamService.invite(team, player))
    }
}
