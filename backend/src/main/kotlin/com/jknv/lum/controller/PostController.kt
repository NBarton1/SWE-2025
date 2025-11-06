package com.jknv.lum.controller

import com.jknv.lum.model.dto.PostDTO
import com.jknv.lum.model.request.post.PostCreateRequest
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.PostService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/posts")
class PostController(
    private val postService: PostService
) {

    @PostMapping
    fun createPost(
        @AuthenticationPrincipal details: AccountDetails,
        @RequestBody req: PostCreateRequest
    ): ResponseEntity<PostDTO> {
        val response = postService.createPost(req, details.id)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
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
