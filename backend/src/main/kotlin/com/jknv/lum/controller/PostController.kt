package com.jknv.lum.controller

import com.jknv.lum.model.dto.LikeStatusDTO
import com.jknv.lum.model.dto.PostDTO
import com.jknv.lum.model.request.post.PostCreateRequest
import com.jknv.lum.model.type.LikeType
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.LikeStatusService
import com.jknv.lum.services.PostService
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/posts")
class PostController(
    private val postService: PostService,
    private val likeStatusService: LikeStatusService
) {

    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun createPost(
        @AuthenticationPrincipal details: AccountDetails,
        @RequestParam("media", required = false) media: List<MultipartFile>?,
        @RequestParam("textContent") textContent: String,
        @RequestParam("parentId", required = false) parentId: Long?
    ): ResponseEntity<PostDTO> {
        val req = PostCreateRequest(media, textContent, parentId)

        val response = postService.createPost(req, details.id)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @GetMapping
    fun getAllPosts(): ResponseEntity<List<PostDTO>> {
        val response = postService.getAllPosts()
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
        val likeStatus = likeStatusService.createLikeStatus(details.id, id, LikeType.POST, liked)
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
