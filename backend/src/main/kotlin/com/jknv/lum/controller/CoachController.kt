package com.jknv.lum.controller

import com.jknv.lum.model.dto.LikeStatusDTO
import com.jknv.lum.model.type.LikeType
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.LikeStatusService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping

@RestController
@RequestMapping("/api/coaches")
class CoachController(
    private val likeStatusService: LikeStatusService
) {
    @PostMapping("/{id}/like")
    fun setLikeStatus(
        @PathVariable id: Long,
        @AuthenticationPrincipal details: AccountDetails,
        @RequestBody liked: Boolean
    ): ResponseEntity<LikeStatusDTO> {
        val likeStatus = likeStatusService.createLikeStatus(details.id, id, LikeType.COACH, liked)
        return ResponseEntity.ok(likeStatus)
    }

    @GetMapping("/{id}/like")
    fun getLikeStatus(
        @PathVariable id: Long,
        @AuthenticationPrincipal details: AccountDetails
    ): ResponseEntity<LikeStatusDTO> {
        val likeStatus = likeStatusService.getLikeStatus(details.id, id, LikeType.COACH)
        return ResponseEntity.ok(likeStatus)
    }

    @GetMapping("/{id}/likes")
    fun getLikeCount(
        @PathVariable id: Long,
    ): ResponseEntity<Long> {
        val reactions = likeStatusService.getNumLikeStatuses(id, LikeType.COACH, true)
        return ResponseEntity.ok(reactions)
    }

    @GetMapping("/{id}/dislikes")
    fun getDislikeCount(
        @PathVariable id: Long,
    ): ResponseEntity<Long> {
        val reactions = likeStatusService.getNumLikeStatuses(id, LikeType.COACH, false)
        return ResponseEntity.ok(reactions)
    }
}
