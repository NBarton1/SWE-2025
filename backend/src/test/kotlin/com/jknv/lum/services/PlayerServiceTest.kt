package com.jknv.lum.services

import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.PlayerRepository
import io.mockk.every
import io.mockk.mockk
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class PlayerServiceTest {
    val playerRepository: PlayerRepository = mockk()
    val accountService: AccountService = mockk()
    val guardianService: GuardianService = mockk()
    val playerService = PlayerService(playerRepository, accountService, guardianService)

    lateinit var req: AccountCreateRequest
    lateinit var guardian: Guardian
    lateinit var player: Player
    lateinit var playerDTO: PlayerDTO

    @BeforeTest
    fun setUp() {
        req = AccountCreateRequest(name = "player", username = "player", password = "password", role = Role.PLAYER)
        guardian = Guardian(account = Account(name = "guardian", username = "guardian", password = "password", role = Role.GUARDIAN))
        player = Player(account = req.toEntity(), guardian = guardian,)
        playerDTO = player.toDTO()
    }

    @Test
    fun createPlayerTest() {
        every { playerRepository.save(player) } returns player
        every { guardianService.getGuardianByUsername(guardian.account.username) } returns guardian
        every { accountService.createAccount(req) } returns player.account

        val result = playerService.createPlayer(req, guardian.account.username)

        assertEquals(result, playerDTO)
    }

    @Test
    fun updatePlayerTest() {
        every { playerRepository.save(player) } returns player

        val result = playerService.updatePlayer(player)

        assertEquals(result, playerDTO)
    }

    @Test
    fun getPlayerByIdTest() {
        every { playerRepository.findPlayerByAccount_Id(player.account.id) } returns player

        val result = playerService.getPlayerById(player.account.id)

        assertEquals(result, player)
    }

    @Test
    fun getPlayerByUsernameTest() {
        every { playerRepository.findPlayerByAccount_Username(player.account.username) } returns player

        val result = playerService.getPlayerByUsername(player.account.username)

        assertEquals(result, player)
    }

    @Test
    fun getPlayersTest() {
        every { playerRepository.findAll() } returns listOf(player)

        val result = playerService.getPlayers()

        assertEquals(result, listOf(playerDTO))
    }

    @Test
    fun countPlayersTest() {
        every { playerRepository.count() } returns 1

        val count = playerService.countPlayers()

        assertEquals(count, 1)
    }

    @Test
    fun updatePlayerPermissionTest() {
        val expectedDTO = PlayerDTO(
            account = player.account.toSummary(),
            guardian = guardian.account.toSummary(),
            team = player.playingTeam?.toSummary(),
            hasPermission = true,
            position = player.position,
        )

        every { playerRepository.findPlayerByAccount_Id(player.account.id) } returns player
        every { guardianService.getGuardianByUsername(guardian.account.username) } returns guardian
        every { playerRepository.save(player) } returns player

        val result = playerService.updatePlayerPermission(player.id, guardian.account.username, true)

        assertEquals(expectedDTO, result)
    }

    @Test
    fun removePlayerFromTeamTest() {
        val expectedDTO = PlayerDTO(
            account = player.account.toSummary(),
            guardian = guardian.account.toSummary(),
            team = null,
            hasPermission = false,
            position = player.position,
        )

        every { playerRepository.findPlayerByAccount_Id(player.account.id) } returns player
        every { playerRepository.save(player) } returns player

        val result = playerService.removePlayerFromTeam(player.account.id)

        assertEquals(expectedDTO, result)
    }
}