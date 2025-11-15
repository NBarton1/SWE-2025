package com.jknv.lum.controller

import com.jknv.lum.model.dto.PostDTO
import com.jknv.lum.model.request.post.PostCreateRequest
import com.jknv.lum.security.AccountDetails
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
    private val postService: PostService
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
}
