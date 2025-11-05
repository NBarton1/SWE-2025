package com.jknv.lum.controller

import com.jknv.lum.config.PreAuthorizeAdmin
import com.jknv.lum.model.dto.MatchDTO
import com.jknv.lum.model.request.match.MatchUpdateRequest
import com.jknv.lum.services.MatchService
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.simp.annotation.SubscribeMapping
import org.springframework.stereotype.Controller

@Controller
class LiveMatchController(
    private val matchService: MatchService,
    private val simpMessagingTemplate: SimpMessagingTemplate,
) {

    @MessageMapping("/match/live-update/{matchId}")
    fun liveUpdate(
        @DestinationVariable matchId: Long,
        @Payload req: MatchUpdateRequest
    ) {
        val updatedMatch = matchService.updateMatch(matchId, req)
        simpMessagingTemplate.convertAndSend("/topic/match/${matchId}", updatedMatch)
    }
}
