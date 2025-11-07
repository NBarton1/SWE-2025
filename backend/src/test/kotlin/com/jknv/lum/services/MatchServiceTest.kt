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
import jakarta.persistence.EntityNotFoundException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.assertThrows
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

    val req: MatchCreateRequest = mockk()

    lateinit var homeTeam: Team
    lateinit var awayTeam: Team

    lateinit var match: Match

    @BeforeEach
    fun setup() {
        homeTeam = Team(id = 0, name = "home")
        awayTeam = Team(id = 1, name = "away")

        match = Match(date = LocalDateTime.now(), type = MatchType.STANDARD, homeTeam = homeTeam, awayTeam = awayTeam)

        every { req.toEntity(homeTeam, awayTeam) } returns match
        every { req.homeTeamId } returns homeTeam.id
        every { req.awayTeamId } returns awayTeam.id
    }

    @Test
    fun getMatchByIdTest() {
        every { matchRepository.findById(any()) } answers {
            if (firstArg<Long>() == match.id)
                Optional.of(match)
            else Optional.empty()
        }

        val result = matchService.getMatchById(match.id)

        verify { matchRepository.findById(match.id) }

        assertEquals(result, match)
        assertThrows<EntityNotFoundException> { matchService.getMatchById(match.id + 1) }
    }

    @Test
    fun createMatchTest() {
        every { teamService.getTeamById(homeTeam.id) } returns homeTeam
        every { teamService.getTeamById(awayTeam.id) } returns awayTeam
        every { matchRepository.save(match) } returns match

        val result = matchService.createMatch(req)

        verify {
            teamService.getTeamById(homeTeam.id)
            teamService.getTeamById(awayTeam.id)
            matchRepository.save(match)
        }

        assertEquals(match.toDTO(), result)
    }

    @Test
    fun updateMatchTest() {
        val update = MatchUpdateRequest(
            homeScore = match.homeScore + 7,
            awayScore = match.awayScore + 3,
            timeLeft = match.clockBase - 30,
            toggleClock = true
        )

        every { matchRepository.findById(match.id) } returns Optional.of(match)
        every { teamService.getTeamById(homeTeam.id) } returns homeTeam
        every { teamService.getTeamById(awayTeam.id) } returns awayTeam
        every { matchRepository.save(match) } returns match

        val expected = MatchDTO(
            id = match.id,
            date = update.date ?: match.date,
            type = update.type ?: match.type,
            state = update.state ?: match.state,
            homeScore = update.homeScore ?: match.homeScore,
            awayScore = update.awayScore ?: match.awayScore,
            homeTeam = homeTeam.toDTO(),
            awayTeam = awayTeam.toDTO(),
            clockTimestamp = update.timeLeft ?: match.clockBase,
            timeRunning = update.toggleClock ?: false
        )

        val result = matchService.updateMatch(match.id, update)

        verify {
            matchRepository.findById(match.id)
            matchRepository.save(match)
        }

        assertEquals(expected, result)
        assertEquals(expected, match.toDTO())
    }

    @Test
    fun deleteMatchTest() {
        justRun { matchService.deleteMatch(match.id) }

        matchService.deleteMatch(match.id)

        verify { matchRepository.deleteById(match.id) }
    }

    @Test
    fun getMatchesTest() {
        every { matchRepository.findAll() } returns listOf(match)

        val matches = matchService.getMatches()

        verify { matchRepository.findAll() }

        assertEquals(matches, listOf(match.toDTO()))
    }

    @Test
    fun getCountMatchesTest() {
        val expected = 1L

        every { matchRepository.count() } returns expected

        val count = matchService.countMatches()

        verify { matchRepository.count() }

        assertEquals(expected, count)
    }
}
