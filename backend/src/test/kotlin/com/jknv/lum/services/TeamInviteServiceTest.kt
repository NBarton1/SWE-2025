package com.jknv.lum.services

import com.jknv.lum.model.dto.AccountDTO
import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.dto.TeamDTO
import com.jknv.lum.model.dto.TeamInviteDTO
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.entity.TeamInvite
import com.jknv.lum.model.type.InviteStatus
import com.jknv.lum.repository.TeamInviteRepository
import io.mockk.*
import jakarta.persistence.EntityNotFoundException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.Optional
import kotlin.test.assertEquals

class TeamInviteServiceTest {
    val teamInviteRepository: TeamInviteRepository = mockk()
    val playerService: PlayerService = mockk()
    val coachService: CoachService = mockk()

    val teamInviteService: TeamInviteService = TeamInviteService(teamInviteRepository, playerService, coachService)

    val team: Team = mockk()
    val teamDTO: TeamDTO = mockk()
    val player: Player = mockk()
    val playerDTO: PlayerDTO = mockk()
    val accountDTO: AccountDTO = mockk()

    lateinit var invite: TeamInvite

    val playerId = 1L
    val teamId = 1L

    @BeforeEach
    fun setup() {
        invite = TeamInvite(team = team, player = player)

        every { team.id } returns teamId
        every { team.toDTO() } returns teamDTO

        every { player.id } returns playerId
        every { player.account.toDTO() } returns accountDTO
        every { player.hasPermission } returns true
    }

    @Test
    fun createInviteTest() {
        every { teamInviteRepository.save(any()) } returns invite

        val result = teamInviteService.createInvite(team, player)

        verify { teamInviteRepository.save(any()) }

        assertEquals(invite.toDTO(), result)
    }

    @Test
    fun getInviteByIdTest() {
        val pk = TeamInvite.PK(teamId = team.id, playerId = player.id)

        every { teamInviteRepository.findTeamInviteById(any()) } answers {
            if (firstArg<TeamInvite.PK>() == pk)
                Optional.of(invite)
            else Optional.empty()
        }

        val result = teamInviteService.getInviteById(team.id, player.id)

        verify { teamInviteRepository.findTeamInviteById(pk) }

        assertEquals(invite, result)
        assertThrows<EntityNotFoundException> { teamInviteService.getInviteById(team.id, player.id + 1) }
        assertThrows<EntityNotFoundException> { teamInviteService.getInviteById(team.id + 1, player.id) }
    }

    @Test
    fun updateInviteTest() {
        every { teamInviteRepository.save(invite) } returns invite

        val result = teamInviteService.updateInvite(invite)

        verify { teamInviteRepository.save(invite) }

        assertEquals(invite.toDTO(), result)
    }

    @Test
    fun invitePlayerByCoachTest() {
        val coachId = 1L

        val coach: Coach = mockk()
        every { coach.id } returns coachId
        every { coach.coachingTeam } returns team

        every { coachService.getCoachById(coachId) } returns coach
        every { playerService.getPlayerById(playerId) } returns player
        every { teamInviteRepository.save(any()) } returns invite

        val result = teamInviteService.invitePlayerByCoach(player.id, coach.id)

        verify {
            coachService.getCoachById(coachId)
            playerService.getPlayerById(playerId)
            teamInviteRepository.save(any())
        }

        assertEquals(invite.toDTO(), result)
    }

    @Test
    fun getInvitesByPlayerTest() {
        every { playerService.getPlayerById(playerId) } returns player
        every { teamInviteRepository.findTeamInvitesByPlayer(player) } returns listOf(invite)

        val result = teamInviteService.getInvitesByPlayer(player.id)

        verify {
            playerService.getPlayerById(playerId)
            teamInviteRepository.findTeamInvitesByPlayer(player)
        }

        assertEquals(listOf(invite.toDTO()), result)
    }

    @Test
    fun countInvitesTest() {
        val expected = 1L

        every { teamInviteRepository.count() } returns expected

        val count = teamInviteService.countInvites()

        verify { teamInviteRepository.count() }

        assertEquals(expected, count)
    }

    @Test
    fun acceptInviteTest() {
        every { playerService.getPlayerById(playerId) } returns player
        every { teamInviteRepository.findTeamInviteById(any()) } returns Optional.of(invite)
        every { teamInviteRepository.save(invite) } returns invite
        every { playerService.updatePlayer(player) } returns playerDTO
        justRun { player.playingTeam = team }

        val expected = TeamInviteDTO(
            team = teamDTO,
            player = accountDTO,
            status = InviteStatus.ACCEPTED,
        )

        val result = teamInviteService.respondToInvite(player.id, team.id, true)

        verify {
            playerService.getPlayerById(playerId)
            teamInviteRepository.findTeamInviteById(any())
            teamInviteRepository.save(invite)
            playerService.updatePlayer(player)
            player.playingTeam = team
        }

        assertEquals(expected, result)
        assertEquals(expected, invite.toDTO())
    }

    @Test
    fun declineInviteTest() {
        every { playerService.getPlayerById(playerId) } returns player
        every { teamInviteRepository.findTeamInviteById(any()) } returns Optional.of(invite)
        every { teamInviteRepository.save(invite) } returns invite

        val expected = TeamInviteDTO(
            team = teamDTO,
            player = accountDTO,
            status = InviteStatus.DECLINED,
        )

        val result = teamInviteService.respondToInvite(player.id, team.id, false)

        verify {
            playerService.getPlayerById(playerId)
            teamInviteRepository.findTeamInviteById(any())
            teamInviteRepository.save(invite)
        }

        assertEquals(expected, result)
        assertEquals(expected, invite.toDTO())
    }
}
