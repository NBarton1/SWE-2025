package com.jknv.lum.services

import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.request.player.PlayerFilter
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.PlayerRepository
import io.mockk.awaits
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import jakarta.persistence.EntityNotFoundException
import org.junit.jupiter.api.assertThrows
import java.util.Optional
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class PlayerServiceTest {
    val playerRepository: PlayerRepository = mockk()
    val guardianService: GuardianService = mockk()
    val coachService: CoachService = mockk()

    val playerService = PlayerService(
        playerRepository,
        guardianService,
        coachService
    )

    val req: AccountCreateRequest = mockk()

    lateinit var account: Account
    lateinit var guardian: Guardian
    lateinit var player: Player

    @BeforeTest
    fun setUp() {
        account = Account(name = "player", username = "player", password = "password", role = Role.PLAYER)
        guardian = Guardian(account = Account(name = "guardian", username = "guardian", password = "password", role = Role.GUARDIAN))
        player = Player(account = account)

        every { req.toEntity() } returns account
    }

    @Test
    fun setPlayerGuardianTest() {
        every { playerRepository.findById(player.id) } returns Optional.of(player)
        every { guardianService.getGuardianById(guardian.id) } returns guardian
        every { playerRepository.save(player) } returns player

        val result = playerService.setPlayerGuardian(player.id, guardian.id)

        verify {
            playerRepository.findById(player.id)
            guardianService.getGuardianById(guardian.id)
            playerRepository.save(player)
        }

        assertEquals(player.toDTO(), result)
    }

    @Test
    fun updatePlayerTest() {
        every { playerRepository.save(player) } returns player

        val result = playerService.updatePlayer(player)

        verify { playerRepository.save(player) }

        assertEquals(result, player.toDTO())
    }

    @Test
    fun getPlayerByIdTest() {
        every { playerRepository.findById(any()) } answers {
            if (firstArg<Long>() == account.id)
                Optional.of(player)
            else Optional.empty()
        }

        val result = playerService.getPlayerById(account.id)

        verify { playerRepository.findById(account.id) }

        assertEquals(account, result.account)
        assertThrows<EntityNotFoundException> { playerService.getPlayerById(account.id + 1) }
    }

    @Test
    fun createPlayerTest() {
        every { playerRepository.save(any()) } returns player

        val result = playerService.createPlayer(account)

        verify { playerRepository.save(any()) }

        assertEquals(result, player.toDTO())
    }

    @Test
    fun getPlayersTest() {
        every { playerRepository.findAll() } returns listOf(player)

        val result = playerService.getPlayers()

        verify { playerRepository.findAll() }

        assertEquals(result, listOf(player.toDTO()))
    }

    @Test
    fun getPlayersWithFilterTest() {
        every { playerRepository.findAll() } returns listOf(player)

        val result = playerService.getPlayers(PlayerFilter(isOrphan = true))

        verify { playerRepository.findAll() }

        assertEquals(result, listOf(player.toDTO()))
    }

    @Test
    fun updatePlayerPermissionTest() {
        player.guardian = guardian

        every { playerRepository.findById(account.id) } returns Optional.of(player)
        every { guardianService.getGuardianById(guardian.account.id) } returns guardian
        every { playerRepository.save(player) } returns player

        val expected = PlayerDTO(
            account = account.toDTO(),
            guardian = guardian.account.toDTO(),
            team = player.playingTeam?.toDTO(),
            hasPermission = true,
            position = player.position,
        )

        val result = playerService.updatePlayerPermission(player.id, guardian.account.id, true)

        verify {
            playerRepository.findById(account.id)
            guardianService.getGuardianById(guardian.account.id)
            playerRepository.save(player)
        }

        assertEquals(expected, result)
    }

    @Test
    fun removePlayerFromTeamTest() {
        val mockId = 1L

        val team: Team = mockk()
        every { team.id } returns mockId

        player.playingTeam = team

        val coach: Coach = mockk()
        every { coach.id } returns mockId
        every { coach.coachingTeam } returns team

        every { coachService.getCoachById(mockId) } returns coach
        every { playerRepository.findById(account.id) } returns Optional.of(player)
        every { playerRepository.save(player) } returns player

        val expected = PlayerDTO(
            account = player.account.toDTO(),
            guardian = null,
            team = null,
            hasPermission = player.hasPermission,
            position = player.position,
        )

        val result = playerService.removePlayerFromTeam(account.id, mockId)

        verify {
            coachService.getCoachById(mockId)
            playerRepository.findById(account.id)
            playerRepository.save(player)
        }

        assertEquals(expected, result)
    }
}