package com.jknv.lum.controller

import com.jknv.lum.config.PreAuthorizeGuardian
import com.jknv.lum.config.Require
import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.dto.TeamInviteDTO
import com.jknv.lum.model.request.player.PlayerFilter
import com.jknv.lum.model.request.player.PlayerPermissionUpdateRequest
import com.jknv.lum.model.request.player.PlayerInviteRequest
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.PlayerService
import com.jknv.lum.services.TeamInviteService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/players")
class PlayerController (
    private val playerService: PlayerService,
    private val teamInviteService: TeamInviteService,
) {
    @PostMapping("/{playerId}/adopt")
    @PreAuthorizeGuardian
    fun adoptPlayer(
        @PathVariable playerId: Long,
        @AuthenticationPrincipal details: AccountDetails
    ): ResponseEntity<PlayerDTO> {
        val response = playerService.setPlayerGuardian(playerId, details.id)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @PostMapping
    fun searchPlayers(
        @RequestBody(required = false) filter: PlayerFilter?
    ): ResponseEntity<List<PlayerDTO>> {
        val response = playerService.getPlayers(filter)
        return ResponseEntity.ok(response)
    }

    @PatchMapping("/{playerId}/permission")
    @Require.Guardian
    fun setPermission(
        @PathVariable playerId: Long,
        @RequestBody req: PlayerPermissionUpdateRequest,
        @AuthenticationPrincipal details: AccountDetails
    ): ResponseEntity<PlayerDTO> {
        val response = playerService.updatePlayerPermission(playerId, details.id, req.hasPermission)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/invites")
    @Require.PlayerOnly
    fun getInvites(@AuthenticationPrincipal details: AccountDetails): ResponseEntity<List<TeamInviteDTO>> {
        val response = teamInviteService.getInvitesByPlayer(details.id)
        return ResponseEntity.ok(response)
    }

    @PutMapping("/invites/{teamId}")
    @Require.PlayerOnly
    fun respondToInvite(
        @PathVariable teamId: Long,
        @RequestBody req: PlayerInviteRequest,
        @AuthenticationPrincipal details: AccountDetails
    ): ResponseEntity<TeamInviteDTO> {
        val response = teamInviteService.respondToInvite(details.id, teamId, req.isAccepted)
        return ResponseEntity.ok(response)
    }
}