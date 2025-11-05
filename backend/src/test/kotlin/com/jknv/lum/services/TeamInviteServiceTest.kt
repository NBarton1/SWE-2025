package com.jknv.lum.services

import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.dto.TeamInviteDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.entity.TeamInvite
import com.jknv.lum.model.entity.TeamInvitePK
import com.jknv.lum.model.type.InviteStatus
import com.jknv.lum.repository.TeamInviteRepository
import io.mockk.*
import jakarta.persistence.EntityNotFoundException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class TeamInviteServiceTest {

    private val teamInviteRepository: TeamInviteRepository = mockk()
    private val teamService: TeamService = mockk()
    private val playerService: PlayerService = mockk()
    private val coachService: CoachService = mockk()

    var teamInviteService: TeamInviteService = TeamInviteService(
        teamInviteRepository,
        teamService,
        playerService,
        coachService
    )

    private lateinit var team: Team
    private lateinit var player: Player
    private lateinit var invite: TeamInvite
    private lateinit var inviteDTO: TeamInviteDTO
    private lateinit var playerDTO: PlayerDTO

    @BeforeEach
    fun setup() {
        team = Team(name = "team")
        player = Player(
            account = Account(id = 2, name = "player", username = "player", password = "password"),
            guardian = Guardian(account = Account(name = "guardian", username = "guardian", password = "password")),
            hasPermission = true
        )
        invite = TeamInvite(team = team, player = player)
        inviteDTO = invite.toDTO()
        playerDTO = player.toDTO()
    }

    @Test
    fun createInviteTest() {
        every { teamService.getTeamById(team.id) } returns team
        every { playerService.getPlayerById(player.id) } returns player
        every { teamInviteRepository.save(any()) } returns invite

        val result = teamInviteService.createInvite(team.id, player.id)

        verify { teamInviteRepository.save(any()) }
        assertEquals(inviteDTO, result)
    }

    @Test
    fun invitePlayerByCoachTest() {
        val coach = Coach(
            account = Account(name = "coach", username = "coach", password = "password"),
            coachingTeam = team
        )

        every { coachService.getCoachById(coach.id) } returns coach
        every { playerService.getPlayerById(player.id) } returns player
        every { teamService.getTeamById(team.id) } returns team
        every { teamInviteRepository.save(any()) } returns invite

        val result = teamInviteService.invitePlayerByCoach(player.id, coach.id)

        verify { teamInviteRepository.save(invite) }
        assertEquals(inviteDTO, result)
    }

    @Test
    fun updateInviteTest() {
        every { teamInviteRepository.save(invite) } returns invite

        val result = teamInviteService.updateInvite(invite)

        verify { teamInviteRepository.save(invite) }
        assertEquals(inviteDTO, result)
    }

    @Test
    fun getInvitesByPlayerTest() {
        every { playerService.getPlayerById(player.account.id) } returns player
        every { teamInviteRepository.findTeamInvitesByPlayer(player) } returns listOf(invite)

        val result = teamInviteService.getInvitesByPlayer(player.account.id)

        assertEquals(listOf(inviteDTO), result)
    }

    @Test
    fun getInviteByIdTest() {
        every { teamInviteRepository.findTeamInviteById(TeamInvitePK(team.id, player.id)) } returns invite

        val result = teamInviteService.getInviteById(player.id, team.id)

        assertEquals(invite, result)
    }

    @Test
    fun countInvitesTest() {
        every { teamInviteRepository.count() } returns 1

        val count = teamInviteService.countInvites()

        assertEquals(1, count)
    }

    @Test
    fun respondToInviteTest() {
        every { playerService.getPlayerById(player.account.id) } returns player
        every { teamInviteService.getInviteById(player.id, team.id) } returns invite
        every { teamInviteService.updateInvite(invite) } returns inviteDTO
        every { playerService.updatePlayer(player) } returns playerDTO

        val result = teamInviteService.respondToInvite(player.account.id, team.id, true)

        assertEquals(InviteStatus.ACCEPTED, invite.status)
        assertEquals(playerDTO, result)
    }
}
