package com.jknv.lum.controller

import com.jknv.lum.config.PreAuthorizeCoach
import com.jknv.lum.config.PreAuthorizePlayerOnly
import com.jknv.lum.model.dto.CoachDTO
import com.jknv.lum.model.dto.TeamDTO
import com.jknv.lum.model.dto.TeamInviteDTO
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.entity.TeamInvite
import com.jknv.lum.model.request.team.TeamCreateRequest
import com.jknv.lum.repository.TeamRepository
import com.jknv.lum.services.AccountService
import com.jknv.lum.services.CoachService
import com.jknv.lum.services.PlayerService
import com.jknv.lum.services.TeamInviteService
import com.jknv.lum.services.TeamService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/api/teams")
class TeamController (
    private val teamService: TeamService,
    private val teamInviteService: TeamInviteService,
    private val coachService: CoachService,
    private val playerService: PlayerService
) {
    @PostMapping
    @PreAuthorizeCoach
    fun create(@RequestBody req: TeamCreateRequest): ResponseEntity<TeamDTO> {
        val response = teamService.createTeam(req)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @GetMapping
    fun getAll(): ResponseEntity<List<TeamDTO>> {
        val response = teamService.getTeams()
        return ResponseEntity.ok(response)
    }

    @PutMapping("/coach/{teamId}")
    @PreAuthorizeCoach
    fun addCoach(@PathVariable teamId: Long, principal: Principal): ResponseEntity<CoachDTO> {
        val response = coachService.setCoachingTeam(teamId, principal.name)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @PostMapping("/invite/{playerId}")
    @PreAuthorizeCoach
    fun invitePlayer(@PathVariable playerId: Long, principal: Principal): ResponseEntity<TeamInviteDTO> {
        val response = teamInviteService.invitePlayerByCoach(playerId, principal.name)
        return ResponseEntity.ok(response)
    }

    @DeleteMapping("/remove/{playerId}")
    @PreAuthorizeCoach
    fun removePlayer(@PathVariable playerId: Long): ResponseEntity<Void> {
        playerService.removePlayerFromTeam(playerId)
        return ResponseEntity.ok().build()
    }
}
