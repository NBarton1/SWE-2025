package com.jknv.lum.controller

import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.LikeStatusService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/api/likes")
class LikeStatusController(
    private val likeStatusService: LikeStatusService
) {

    @DeleteMapping("/{id}")
    fun deleteLikeStatus(
        @PathVariable id: Long,
        @AuthenticationPrincipal details: AccountDetails,
    ): ResponseEntity<Void> {
        likeStatusService.deleteLikeStatus(details.id, id)
        return ResponseEntity.ok().build()
    }
}
