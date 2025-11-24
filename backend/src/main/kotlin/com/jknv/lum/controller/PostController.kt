package com.jknv.lum.controller

import com.jknv.lum.LOGGER
import com.jknv.lum.config.Require
import com.jknv.lum.model.dto.FlagDTO
import com.jknv.lum.model.dto.LikeStatusDTO
import com.jknv.lum.model.dto.PostDTO
import com.jknv.lum.model.request.post.PostCreateRequest
import com.jknv.lum.model.type.LikeType
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.FlagService
import com.jknv.lum.services.LikeStatusService
import com.jknv.lum.services.PostService
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/posts")
class PostController(
    private val postService: PostService,
    private val likeStatusService: LikeStatusService,
    private val flagService: FlagService
) {

    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun createPost(
        @AuthenticationPrincipal details: AccountDetails,
        @ModelAttribute req: PostCreateRequest
    ): ResponseEntity<PostDTO> {
        val response = postService.createPost(req, details.id)
        return ResponseEntity.ok(response)
    }

    @GetMapping
    fun getAllRootPosts(
        @AuthenticationPrincipal details: AccountDetails,
    ): ResponseEntity<List<PostDTO>> {
        val response = postService.getAllVisibleRootPosts(details.id)
        return ResponseEntity.status(HttpStatus.OK).body(response)
    }

    @DeleteMapping("/{id}")
    fun delete(
        @AuthenticationPrincipal details: AccountDetails,
        @PathVariable id: Long,
    ): ResponseEntity<Void> {
        postService.deletePost(id, details.id)
        return ResponseEntity.ok().build()
    }


    @PostMapping("/{id}/like")
    fun setLikeStatus(
        @PathVariable id: Long,
        @AuthenticationPrincipal details: AccountDetails,
        @RequestBody liked: Boolean
    ): ResponseEntity<LikeStatusDTO> {
        val likeStatus = postService.likePost(id, details.id, liked)
        return ResponseEntity.ok(likeStatus)
    }

    @GetMapping("/{id}/like")
    fun getLikeStatus(
        @PathVariable id: Long,
        @AuthenticationPrincipal details: AccountDetails
    ): ResponseEntity<LikeStatusDTO> {
        val likeStatus = likeStatusService.getLikeStatus(details.id, id, LikeType.POST)
        return ResponseEntity.ok(likeStatus)
    }

    @GetMapping("/{id}/likes")
    fun getLikeCount(
        @PathVariable id: Long,
    ): ResponseEntity<Long> {
        val reactions = likeStatusService.getNumLikeStatuses(id, LikeType.POST, true)
        return ResponseEntity.ok(reactions)
    }

    @GetMapping("/{id}/dislikes")
    fun getDislikeCount(
        @PathVariable id: Long,
    ): ResponseEntity<Long> {
        val reactions = likeStatusService.getNumLikeStatuses(id, LikeType.POST, false)
        return ResponseEntity.ok(reactions)
    }

    @PostMapping("/{id}/flags")
    fun flagPost(
        @PathVariable id: Long,
        @AuthenticationPrincipal details: AccountDetails,
    ): ResponseEntity<FlagDTO> {
        val flag = flagService.createFlagByIds(id, details.id)
        return ResponseEntity.ok(flag)
    }

    @GetMapping("/{id}/flags")
    fun getFlagCountForPost(
        @PathVariable id: Long,
    ): ResponseEntity<Long> {
        val count = flagService.getNumFlags(id)
        return ResponseEntity.ok(count)
    }

    @GetMapping("/{id}/flag")
    fun getFlagForPost(
        @PathVariable id: Long,
        @AuthenticationPrincipal details: AccountDetails,
    ): ResponseEntity<FlagDTO> {
        val flag = flagService.getFlagById(details.id, id)
        return ResponseEntity.ok(flag)
    }

    @GetMapping("/flags")
    @Require.Admin
    fun getFlaggedPosts(): ResponseEntity<List<PostDTO>> {
        val response = postService.getFlaggedPosts()
        return ResponseEntity.ok(response)
    }

    @GetMapping("/{id}/children")
    fun getChildren(
        @PathVariable id: Long,
        @AuthenticationPrincipal details: AccountDetails,
    ): ResponseEntity<List<PostDTO>> {
        val children = postService.getVisibleChildren(id, details.id)
        return ResponseEntity.ok(children)
    }

    @Require.Guardian
    @GetMapping("/unapproved")
    fun getUnapproved(
        @AuthenticationPrincipal details: AccountDetails,
    ): ResponseEntity<HashMap<Long, List<PostDTO>>> {
        val unapprovedPosts = postService.getUnapprovedPostsForGuardiansChildren(details.id)
        return ResponseEntity.ok(unapprovedPosts)
    }

    @Require.GuardianOrAdmin
    @PatchMapping("/{id}/approve")
    fun approvePost(
        @PathVariable id: Long,
        @AuthenticationPrincipal details: AccountDetails,
    ): ResponseEntity<PostDTO> {
        val approved = postService.approveChildPost(details.id, id)
        return ResponseEntity.ok(approved)
    }

    @Require.GuardianOrAdmin
    @DeleteMapping("/{id}/disapprove")
    fun disapprovePost(
        @PathVariable id: Long,
        @AuthenticationPrincipal details: AccountDetails,
    ): ResponseEntity<Void> {
        postService.disapproveChildPost(details.id, id)
        return ResponseEntity.ok().build()
    }

}
