package com.jknv.lum.controller

import com.jknv.lum.model.dto.MatchDTO
import com.jknv.lum.model.request.match.MatchUpdateRequest
import com.jknv.lum.services.MatchService
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Test
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority

class LiveMatchControllerTest {
    val matchService: MatchService = mockk()
    val simpMessagingTemplate: SimpMessagingTemplate = mockk()

    val liveMatchController = LiveMatchController(matchService, simpMessagingTemplate)

    val mockId = 1L

    @Test
    fun liveUpdateTest() {
        val req: MatchUpdateRequest = mockk()
        val updatedMatch: MatchDTO = mockk()

        val principal = UsernamePasswordAuthenticationToken(
            "adminUser",
            "password",
            listOf(SimpleGrantedAuthority("ROLE_ADMIN"))
        )

        every { matchService.updateMatch(mockId, req) } returns updatedMatch
        justRun { simpMessagingTemplate.convertAndSend("/topic/match/$mockId", updatedMatch) }

        liveMatchController.liveUpdate(mockId, req, principal)

        verify {
            matchService.updateMatch(mockId, req)
            simpMessagingTemplate.convertAndSend("/topic/match/$mockId", updatedMatch)
        }
    }

}
