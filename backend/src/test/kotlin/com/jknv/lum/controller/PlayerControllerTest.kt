package com.jknv.lum.controller

import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.dto.TeamInviteDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.request.player.PlayerInviteRequest
import com.jknv.lum.model.request.player.PlayerPermissionUpdateRequest
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.PlayerService
import com.jknv.lum.services.TeamInviteService
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import java.security.Principal
import kotlin.test.assertEquals

class PlayerControllerTest {

    val playerService: PlayerService = mockk()
    val teamInviteService: TeamInviteService = mockk()
    val details: AccountDetails = mockk()

    val controller: PlayerController = PlayerController(playerService, teamInviteService)

    lateinit var req: AccountCreateRequest
    lateinit var guardian: Guardian
    lateinit var player: Player
    lateinit var playerDTO: PlayerDTO

    @BeforeEach
    fun setup() {
        req = AccountCreateRequest(name = "player", username = "player", password = "password")
        guardian = Guardian(account = Account(name = "guardian", username = "guardian", password = "password"))
        player = Player(id = 1, account = req.toEntity(), guardian = guardian)
        playerDTO = PlayerDTO(
            account = player.account.toDTO(),
            guardian = guardian.account.toDTO(),
            team = player.playingTeam?.toDTO(),
            hasPermission = player.hasPermission,
            position = player.position
        )
        every { details.id } returns guardian.account.id
    }

    @Test
    fun createPlayerTest() {
        every { playerService.createPlayer(any(), any()) } returns playerDTO

        val response = controller.createPlayer(req, details)

        assertEquals(HttpStatus.CREATED, response.statusCode)
        assertEquals(playerDTO, response.body)
        verify { playerService.createPlayer(any(), any()) }
    }

    @Test
    fun setPermissionTest() {
        val req = PlayerPermissionUpdateRequest(hasPermission = true)
        val expectedDTO = playerDTO.copy(hasPermission = true)

        every { playerService.updatePlayerPermission(any(), any(), any()) } returns expectedDTO

        val response = controller.setPermission(player.id, req, details)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(expectedDTO, response.body)
        verify { playerService.updatePlayerPermission(any(), any(), any()) }
    }

    @Test
    fun getInvitesTest() {
        val invites = listOf(
            TeamInviteDTO(
                team = mockk(),
                player = mockk(),
                status = mockk()
            )
        )

        every { teamInviteService.getInvitesByPlayer(any()) } returns invites

        val response = controller.getInvites(details)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(invites, response.body)
        verify { teamInviteService.getInvitesByPlayer(any()) }
    }

    @Test
    fun respondToInviteTest() {
        val req = PlayerInviteRequest(isAccepted = true)
        val expectedDTO = playerDTO.copy(hasPermission = true)

        every { teamInviteService.respondToInvite(any(), any(), any()) } returns expectedDTO

        val response = controller.respondToInvite(10, req, details)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(expectedDTO, response.body)
        verify { teamInviteService.respondToInvite(any(), any(), any()) }
    }
}
