package com.jknv.lum.services

import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.entity.Team
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
    val matchService = MatchService(matchRepository)

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
            type = MatchType.STANDARD,
            homeTeam = homeTeam,
            awayTeam = awayTeam
        )
    }

    @Test
    fun saveMatchTest() {
        every { matchRepository.save(any()) } returns match

        val savedMatch = matchService.create(match)

        verify(exactly = 1) { matchRepository.save(any()) }
        assertEquals(match, savedMatch)
    }

    @Test
    fun getMatchByIdTest() {
        every { matchRepository.findById(1) } returns Optional.of(match)

        val result = matchService.getMatchById(1);

        verify(exactly = 1) { matchRepository.findById(1) };
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
    fun getMatchesTest() {
        val match1 = Match(
            id = 2,
            date = LocalDateTime.now(),
            type = MatchType.STANDARD,
            homeTeam = Team(name = "home"),
            awayTeam = Team(name = "away")
        )

        every { matchRepository.findAll() } returns listOf(match, match1);

        val matches = matchService.getMatches()

        verify(exactly = 1) { matchRepository.findAll() }
        assertEquals(matches, listOf(match, match1))
    }
}
