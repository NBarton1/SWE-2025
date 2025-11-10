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

    lateinit var req: MatchCreateRequest
    lateinit var match: Match
    lateinit var matchDTO: MatchDTO

    @BeforeEach
    fun setUp() {
        homeTeam = Team(name = "home")
        awayTeam = Team(name = "away")
        req = MatchCreateRequest(
            date = LocalDateTime.now(),
            type = MatchType.STANDARD,
            homeTeamId = homeTeam.id,
            awayTeamId = awayTeam.id,
        )
        match = req.toEntity(homeTeam, awayTeam)
        matchDTO = match.toDTO()
    }

    @Test
    fun createMatchTest() {
        every { matchService.createMatch(req) } returns matchDTO

        val result = matchController.createMatch(req)

        assertEquals(HttpStatus.CREATED, result.statusCode)
        assertEquals(matchDTO, result.body)
        verify { matchService.createMatch(req) }
    }

    @Test
    fun deleteMatchTest() {
        justRun { matchService.deleteMatch(match.id) }

        val result = matchController.deleteMatch(match.id)

        assertEquals(HttpStatus.OK, result.statusCode)
        verify { matchService.deleteMatch(match.id) }
    }

    @Test
    fun updateMatchTest() {
        val req = MatchUpdateRequest(null, MatchType.PLAYOFF, null, null)

        val updatedDTO = MatchDTO(
            id = match.id,
            date = req.date ?: match.date,
            type = req.type ?: match.type,
            homeTeam = homeTeam.toDTO(),
            awayTeam = awayTeam.toDTO(),
            state = MatchState.SCHEDULED,
        )

        every { matchService.updateMatch(match.id, req) } returns updatedDTO

        val result = matchController.updateMatch(match.id, req)

        assertEquals(HttpStatus.OK, result.statusCode)
        assertEquals(updatedDTO, result.body)
        verify { matchService.updateMatch(match.id, req) }
    }

    @Test
    fun getMatchTest() {
        every { matchService.getMatch(match.id) } returns matchDTO

        val result = matchController.getMatch(match.id)

        assertEquals(HttpStatus.OK, result.statusCode)
        assertEquals(matchDTO, result.body)
        verify { matchService.getMatch(match.id) }
    }

    @Test
    fun getMatchesTest() {
        every { matchService.getMatches() } returns listOf(matchDTO)

        val result = matchController.getMatches()

        assertEquals(HttpStatus.OK, result.statusCode)
        assertEquals(listOf(matchDTO), result.body)
        verify { matchService.getMatches() }
    }
}
