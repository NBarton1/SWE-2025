package com.jknv.lum.controller

import com.jknv.lum.LOGGER
import com.jknv.lum.config.PreAuthorizeAdmin
import com.jknv.lum.model.request.match.MatchUpdateRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.MatchService
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.stereotype.Controller
import java.security.Principal

@Controller
class LiveMatchController(
    private val matchService: MatchService,
    private val simpMessagingTemplate: SimpMessagingTemplate,
) {

    @MessageMapping("/match/live-update/{matchId}")
    fun liveUpdate(
        @DestinationVariable matchId: Long,
        @Payload req: MatchUpdateRequest,
        principal: Principal,
    ) {
        // TODO: workaround for now, @AuthenticationPrincipal not working
        if (!(principal as UsernamePasswordAuthenticationToken).authorities.any { it.authority == "ROLE_ADMIN" }) {
            throw IllegalAccessError("Only admin allowed")
        }

        val updatedMatch = matchService.updateMatch(matchId, req)
        simpMessagingTemplate.convertAndSend("/topic/match/${matchId}", updatedMatch)
    }
}
