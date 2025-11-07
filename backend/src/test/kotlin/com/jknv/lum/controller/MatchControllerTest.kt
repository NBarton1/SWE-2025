package com.jknv.lum.controller

import com.jknv.lum.model.dto.MatchDTO
import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.match.MatchCreateRequest
import com.jknv.lum.model.request.match.MatchUpdateRequest
import com.jknv.lum.model.type.MatchState
import com.jknv.lum.model.type.MatchType
import com.jknv.lum.services.MatchService
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import java.time.LocalDateTime

class MatchControllerTest {
    var matchService: MatchService = mockk()

    var matchController: MatchController = MatchController(matchService)

    lateinit var homeTeam: Team
    lateinit var awayTeam: Team

    lateinit var match: Match

    @BeforeEach
    fun setUp() {
        homeTeam = Team(id = 0, name = "home")
        awayTeam = Team(id = 1, name = "away")

        match = Match(
            date = LocalDateTime.now(),
            type = MatchType.STANDARD,
            homeTeam = homeTeam,
            awayTeam = awayTeam,
        )
    }

    @Test
    fun createMatchTest() {
        val req: MatchCreateRequest = mockk()

        every { matchService.createMatch(req) } returns match.toDTO()

        val response = matchController.createMatch(req)

        verify { matchService.createMatch(req) }

        assertEquals(HttpStatus.CREATED, response.statusCode)
        assertEquals(match.toDTO(), response.body)
    }

    @Test
    fun deleteMatchTest() {
        justRun { matchService.deleteMatch(match.id) }

        val response = matchController.deleteMatch(match.id)

        verify { matchService.deleteMatch(match.id) }

        assertEquals(HttpStatus.OK, response.statusCode)
    }

    @Test
    fun updateMatchTest() {
        val req: MatchUpdateRequest = mockk()

        val expected = MatchDTO(
            id = match.id,
            date = match.date,
            type = match.type,
            homeTeam = homeTeam.toDTO(),
            awayTeam = awayTeam.toDTO(),
            state = MatchState.LIVE,
            homeScore = match.homeScore + 7,
            awayScore = match.awayScore + 3,
        )

        every { matchService.updateMatch(match.id, req) } returns expected

        val response = matchController.updateMatch(match.id, req)

        verify { matchService.updateMatch(match.id, req) }

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(expected, response.body)
    }

    @Test
    fun getMatchTest() {
        every { matchService.getMatch(match.id) } returns match.toDTO()

        val response = matchController.getMatch(match.id)

        verify { matchService.getMatch(match.id) }

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(match.toDTO(), response.body)
    }

    @Test
    fun getMatchesTest() {
        every { matchService.getMatches() } returns listOf(match.toDTO())

        val response = matchController.getMatches()

        verify { matchService.getMatches() }

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(listOf(match.toDTO()), response.body)
    }
}
