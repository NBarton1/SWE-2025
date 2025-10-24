package com.jknv.lum.controller

import com.jknv.lum.config.PreAuthorizeGuardian
import com.jknv.lum.config.PreAuthorizePlayerOnly
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.entity.TeamInvite
import com.jknv.lum.model.request.player.PlayerPermissionUpdateRequest
import com.jknv.lum.model.request.player.PlayerCreateRequest
import com.jknv.lum.model.request.player.PlayerInviteRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.services.GuardianService
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
    private val guardianService: GuardianService,
    private val teamInviteService: TeamInviteService,
) {
    @PostMapping
    @PreAuthorizeGuardian
    fun createPlayer(@RequestBody req: PlayerCreateRequest, principal: Principal): ResponseEntity<Player> {
        val playerAccount = Account(name = req.name, username = req.username, password = req.password, role = Role.PLAYER)
        val guardian = guardianService.getGuardianByUsername(principal.name)
            ?: return ResponseEntity.notFound().build()

        val player = Player(account = playerAccount, guardian = guardian)
        return ResponseEntity.status(HttpStatus.CREATED).body(playerService.createPlayer(player))
    }

    @PatchMapping("/{playerId}/permission")
    @PreAuthorizeGuardian
    fun setPermission(
        @PathVariable playerId: Long,
        @RequestBody req: PlayerPermissionUpdateRequest,
        principal: Principal
    ): ResponseEntity<Player> {
        val player = playerService.getPlayerById(playerId)
            ?: return ResponseEntity.notFound().build()
        val guardian = guardianService.getGuardianByUsername(principal.name)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(playerService.updatePlayerPermission(player, guardian, req.hasPermission))
    }

    @GetMapping("/invites")
    @PreAuthorizePlayerOnly
    fun getInvites(principal: Principal): ResponseEntity<List<TeamInvite>> {
        val player = playerService.getPlayerByUsername(principal.name)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(teamInviteService.getInvitesByPlayer(player))
    }

    @PutMapping("/invites/{teamId}")
    @PreAuthorizePlayerOnly
    fun respondToInvite(
        @PathVariable teamId: Long,
        @RequestBody req: PlayerInviteRequest,
        principal: Principal
    ): ResponseEntity<Player> {
        return ResponseEntity.ok(playerService.respondToInvite(principal.name, teamId, req.isAccepted))
    }
}