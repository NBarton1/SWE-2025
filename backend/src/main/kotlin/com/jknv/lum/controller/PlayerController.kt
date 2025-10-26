package com.jknv.lum.controller

import com.jknv.lum.config.PreAuthorizeGuardian
import com.jknv.lum.config.PreAuthorizePlayerOnly
import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.dto.TeamInviteDTO
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.request.player.PlayerPermissionUpdateRequest
import com.jknv.lum.model.request.player.PlayerInviteRequest
import com.jknv.lum.services.PlayerService
import com.jknv.lum.services.TeamInviteService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/api/players")
class PlayerController (
    private val playerService: PlayerService,
    private val teamInviteService: TeamInviteService,
) {
    @PostMapping
    @PreAuthorizeGuardian
    fun createPlayer(
        @RequestBody req: AccountCreateRequest,
        principal: Principal
    ): ResponseEntity<PlayerDTO> {
        val response = playerService.createPlayer(req, principal.name)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @PatchMapping("/{playerId}/permission")
    @PreAuthorizeGuardian
    fun setPermission(
        @PathVariable playerId: Long,
        @RequestBody req: PlayerPermissionUpdateRequest,
        principal: Principal
    ): ResponseEntity<PlayerDTO> {
        val response = playerService.updatePlayerPermission(playerId, principal.name, req.hasPermission)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/invites")
    @PreAuthorizePlayerOnly
    fun getInvites(principal: Principal): ResponseEntity<List<TeamInviteDTO>> {
        val response = teamInviteService.getInvitesByPlayer(principal.name)
        return ResponseEntity.ok(response)
    }

    @PutMapping("/invites/{teamId}")
    @PreAuthorizePlayerOnly
    fun respondToInvite(
        @PathVariable teamId: Long,
        @RequestBody req: PlayerInviteRequest,
        principal: Principal
    ): ResponseEntity<PlayerDTO> {
        val response = teamInviteService.respondToInvite(principal.name, teamId, req.isAccepted)
        return ResponseEntity.ok(response)
    }
}