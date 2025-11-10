package com.jknv.lum.controller

import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.dto.TeamInviteDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.entity.TeamInvite
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.request.player.PlayerInviteRequest
import com.jknv.lum.model.request.player.PlayerPermissionUpdateRequest
import com.jknv.lum.model.type.InviteStatus
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.PlayerService
import com.jknv.lum.services.TeamInviteService
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import kotlin.test.assertEquals

class PlayerControllerTest {
    val playerService: PlayerService = mockk()
    val teamInviteService: TeamInviteService = mockk()

    val playerController: PlayerController = PlayerController(playerService, teamInviteService)

    val details: AccountDetails = mockk()
    val guardian: Guardian = mockk()
    val account: Account = mockk()

    lateinit var player: Player

    val mockId = 1L

    @BeforeEach
    fun setup() {
        player = Player(account = account, guardian = guardian)

        every { guardian.id } returns mockId
        every { details.id } returns guardian.id
    }

    @Test
    fun adoptPlayerTest() {
        val playerDTO: PlayerDTO = mockk()

        every { playerService.setPlayerGuardian(player.id, mockId) } returns playerDTO

        val response = playerController.adoptPlayer(player.id, details)

        verify { playerService.setPlayerGuardian(player.id, mockId) }

        assertEquals(HttpStatus.CREATED, response.statusCode)
        assertEquals(playerDTO, response.body)
    }

    @Test
    fun getPlayersTest() {
        val playerDTO: PlayerDTO = mockk()

        every { playerService.getPlayers(any()) } returns listOf(playerDTO)

        val response = playerController.searchPlayers(null)

        verify { playerService.getPlayers() }

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(listOf(playerDTO), response.body)
    }

    @Test
    fun setPermissionTest() {
        val req = PlayerPermissionUpdateRequest(hasPermission = true)

        val expected = PlayerDTO(
            account = mockk(),
            guardian = mockk(),
            team = player.playingTeam?.toDTO(),
            hasPermission = req.hasPermission,
            position = player.position,
        )

        every { playerService.updatePlayerPermission(player.id, mockId, req.hasPermission) } returns expected

        val response = playerController.setPermission(player.id, req, details)

        verify { playerService.updatePlayerPermission(player.id, mockId, req.hasPermission) }

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(expected, response.body)
    }

    @Test
    fun getInvitesTest() {
        every { details.id } returns player.id

        val invite = TeamInviteDTO(
            team = mockk(),
            player = mockk(),
            status = mockk()
        )

        every { teamInviteService.getInvitesByPlayer(player.id) } returns listOf(invite)

        val response = playerController.getInvites(details)

        verify { teamInviteService.getInvitesByPlayer(player.id) }

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(listOf(invite), response.body)
    }

    @Test
    fun respondToInviteTest() {
        every { details.id } returns player.id

        val req = PlayerInviteRequest(isAccepted = true)

        val expectedDTO = TeamInviteDTO(
            team = mockk(),
            player = mockk(),
            status = if (req.isAccepted) InviteStatus.ACCEPTED else InviteStatus.DECLINED,
        )

        every { teamInviteService.respondToInvite(player.id, any(), req.isAccepted) } returns expectedDTO

        val response = playerController.respondToInvite(mockId, req, details)

        verify { teamInviteService.respondToInvite(player.id, mockId, req.isAccepted) }

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(expectedDTO, response.body)
    }
}
