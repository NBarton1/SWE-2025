package com.jknv.lum.services

import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.MatchCreateRequest
import com.jknv.lum.model.request.MatchUpdateRequest
import com.jknv.lum.repository.MatchRepository
import com.jknv.lum.repository.TeamRepository
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import java.time.LocalDateTime
import kotlin.test.Test
import kotlin.test.assertEquals

class MatchServiceTest {
    val teamService: TeamService = mockk()
    val matchRepository: MatchRepository = mockk()
    val matchService = MatchService(matchRepository, teamService)

    lateinit var match: Match
    lateinit var homeTeam: Team
    lateinit var awayTeam: Team

    @BeforeEach
    fun setup() {
        homeTeam = Team(name = "home")
        awayTeam = Team(name = "away")

        match = Match(
            id = 1,
            date = LocalDateTime.now(),
            type = 0,
            homeTeam = homeTeam,
            awayTeam = awayTeam
        )
    }

    @Test
    fun saveMatchTest() {
        every { matchRepository.save(any()) } returns match
        every { teamService.getTeamById(1) } returns homeTeam
        every { teamService.getTeamById(2) } returns awayTeam

        val req = MatchCreateRequest(
            date = LocalDateTime.now(),
            type = 0,
            homeTeamId = 1,
            awayTeamId = 2
        )

        val savedMatch = matchService.createMatch(req)

        verify(exactly = 1) { matchRepository.save(any()) }
        assertEquals(match, savedMatch)
    }

    @Test
    fun getMatchByIdTest() {
        every { matchRepository.getReferenceById(1) } returns match;

        val result = matchService.getMatchById(1);

        verify(exactly = 1) { matchRepository.getReferenceById(1) };
        assertEquals(match, result)
    }

    @Test
    fun deleteMatchTest() {
        val matchId = 1L

        justRun { matchService.deleteMatch(matchId) }

        matchService.deleteMatch(matchId)

        verify(exactly = 1) { matchRepository.deleteById(matchId) }
    }

    @Test
    fun updateMatch() {
        every { matchRepository.save(any()) } returns match
        every { teamService.getTeamById(1) } returns homeTeam
        every { teamService.getTeamById(2) } returns awayTeam

        val req = MatchUpdateRequest(
            id = 1,
            date = match.date,
            type = match.type,
            homeTeamId = 1,
            awayTeamId = 2
        )

        val savedMatch = matchService.updateMatch(req)

        verify(exactly = 1) { matchRepository.save(any()) }
        assertEquals(match, savedMatch)
    }

    @Test
    fun getMatchesTest() {
        val match1 = Match(
            id = 2,
            date = LocalDateTime.now(),
            type = 0,
            homeTeam = Team(name = "home"),
            awayTeam = Team(name = "away")
        )

        every { matchRepository.findAll() } returns listOf(match, match1);

        val matches = matchService.getMatches()

        verify(exactly = 1) { matchRepository.findAll() }
        assertEquals(matches, listOf(match, match1))
    }
}
