package com.jknv.lum.controller

import com.jknv.lum.config.PreAuthorizeCoach
import com.jknv.lum.model.dto.CoachDTO
import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.dto.TeamDTO
import com.jknv.lum.model.dto.TeamInviteDTO
import com.jknv.lum.model.request.team.TeamCreateRequest
import com.jknv.lum.repository.TeamRepository
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.AccountService
import com.jknv.lum.services.CoachService
import com.jknv.lum.services.PlayerService
import com.jknv.lum.services.TeamInviteService
import com.jknv.lum.services.TeamService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
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

    @GetMapping("/{teamId}")
    fun getTeam(@PathVariable teamId: Long): ResponseEntity<TeamDTO> {
        val response = teamService.getTeam(teamId)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/{teamId}/players")
    fun getPlayersByTeam(@PathVariable teamId: Long): ResponseEntity<List<PlayerDTO>> {
        val response = teamService.getPlayersByTeam(teamId)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/{teamId}/coaches")
    fun getCoachesByTeam(@PathVariable teamId: Long): ResponseEntity<List<CoachDTO>> {
        val response = teamService.getCoachesByTeam(teamId)
        return ResponseEntity.ok(response)
    }

    @PutMapping("/{teamId}/coaches")
    @PreAuthorizeCoach
    fun addCoach(
        @PathVariable teamId: Long,
        @AuthenticationPrincipal details: AccountDetails
    ): ResponseEntity<CoachDTO> {
        val response = coachService.setCoachingTeam(teamId, details.id)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @PostMapping("/{playerId}/invite")
    @PreAuthorizeCoach
    fun invitePlayer(
        @PathVariable playerId: Long,
        @AuthenticationPrincipal details: AccountDetails): ResponseEntity<TeamInviteDTO> {
        val response = teamInviteService.invitePlayerByCoach(playerId, details.id)
        return ResponseEntity.ok(response)
    }

    @DeleteMapping("/{playerId}")
    @PreAuthorizeCoach
    fun removePlayer(@PathVariable playerId: Long): ResponseEntity<PlayerDTO> {
        val response = playerService.removePlayerFromTeam(playerId)
        return ResponseEntity.ok(response)
    }
}
