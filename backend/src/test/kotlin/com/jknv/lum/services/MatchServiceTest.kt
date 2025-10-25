package com.jknv.lum.services

import com.jknv.lum.model.dto.MatchDTO
import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.match.MatchCreateRequest
import com.jknv.lum.model.request.match.MatchUpdateRequest
import com.jknv.lum.model.type.MatchType
import com.jknv.lum.repository.MatchRepository
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import java.time.LocalDateTime
import java.util.*
import kotlin.test.Test
import kotlin.test.assertEquals

class MatchServiceTest {
    val matchRepository: MatchRepository = mockk()
    val teamService: TeamService = mockk()

    val matchService = MatchService(
        matchRepository,
        teamService
    )

    lateinit var homeTeam: Team
    lateinit var awayTeam: Team
    lateinit var req: MatchCreateRequest
    lateinit var match: Match
    lateinit var matchDTO: MatchDTO

    @BeforeEach
    fun setup() {
        homeTeam = Team(name = "home")
        awayTeam = Team(name = "away")

        req = MatchCreateRequest(
            LocalDateTime.now(),
            MatchType.STANDARD,
            1,
            2
        )
        match = req.toEntity(homeTeam, awayTeam)
        matchDTO = match.toDTO()
    }

    @Test
    fun createMatchTest() {
        every { teamService.getTeamById(1) } returns homeTeam
        every { teamService.getTeamById(2) } returns awayTeam
        every { matchRepository.save(any()) } returns match

        val savedMatch = matchService.createMatch(req)

        verify(exactly = 1) { matchRepository.save(any()) }
        assertEquals(matchDTO, savedMatch)
    }

    @Test
    fun updateMatchTest() {
        val update = MatchUpdateRequest(
            date = LocalDateTime.now().plusDays(1),
            type = MatchType.PLAYOFF,
            homeTeamId = 1,
            awayTeamId = 2
        )

        every { matchRepository.findById(1) } returns Optional.of(match)
        every { teamService.getTeamById(1) } returns homeTeam
        every { teamService.getTeamById(2) } returns awayTeam
        every { matchRepository.save(any()) } returns match

        val updatedMatch = matchService.updateMatch(1, update)

        verify(exactly = 1) { matchRepository.save(match) }
        assertEquals(match.toDTO(), updatedMatch)
    }

    @Test
    fun deleteMatchTest() {
        val matchId = 1L

        justRun { matchService.deleteMatch(matchId) }

        matchService.deleteMatch(matchId)

        verify(exactly = 1) { matchRepository.deleteById(matchId) }
    }

    @Test
    fun getMatchesTest() {
        every { matchRepository.findAll() } returns listOf(match);

        val matches = matchService.getMatches()

        verify(exactly = 1) { matchRepository.findAll() }
        assertEquals(matches, listOf(matchDTO))
    }

    @Test
    fun getCountMatchesTest() {
        every { matchRepository.count() } returns 1

        val count = matchService.countMatches()

        verify(exactly = 1) { matchRepository.count() }
        assertEquals(1, count)
    }
}
