package com.jknv.lum.controller

import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.match.MatchCreateRequest
import com.jknv.lum.model.request.match.MatchUpdateRequest
import com.jknv.lum.model.type.MatchType
import com.jknv.lum.services.TeamService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime


@SpringBootTest
@Transactional
class MatchControllerTest {
    @Autowired
    lateinit var matchController: MatchController

    @Autowired
    lateinit var teamService: TeamService

    lateinit var homeTeam: Team
    lateinit var awayTeam: Team
    lateinit var matchCreateRequest: MatchCreateRequest

    @BeforeEach
    fun setup() {
        homeTeam = teamService.createTeam(Team(name = "Home Team"))
        awayTeam = teamService.createTeam(Team(name = "Away Team"))
        matchCreateRequest = MatchCreateRequest(
            homeTeamId = homeTeam.id!!,
            awayTeamId = awayTeam.id!!,
            date = LocalDateTime.now(),
            type = MatchType.STANDARD,
        )
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun createMatchTest() {
        val response = matchController.createMatch(matchCreateRequest)

        assertEquals(201, response.statusCode.value())
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun deleteMatchTest() {
        val createResponse = matchController.createMatch(matchCreateRequest)

        assertEquals(201, createResponse.statusCode.value())

        val deleteResponse = matchController.deleteMatch(createResponse.body?.id!!)

        assertEquals(200, deleteResponse.statusCode.value())
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun updateMatchTest() {
        val createResponse = matchController.createMatch(matchCreateRequest)

        assertEquals(201, createResponse.statusCode.value())

        val request1 = MatchUpdateRequest(
            homeTeamId = homeTeam.id!!,
            awayTeamId = awayTeam.id!!,
            date = LocalDateTime.now(),
            type = MatchType.STANDARD,
        )

        val updateResponse = matchController.updateMatch(createResponse.body?.id!!, request1)

        assertEquals(200, updateResponse.statusCode.value())
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun getMatchesTest() {
        val response = matchController.getMatches()

        assertEquals(200, response.statusCode.value())
    }
}
