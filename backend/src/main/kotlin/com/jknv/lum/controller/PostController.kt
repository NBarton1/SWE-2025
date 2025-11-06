package com.jknv.lum.controller

import com.jknv.lum.model.dto.PostDTO
import com.jknv.lum.model.request.post.PostCreateRequest
import com.jknv.lum.services.PostService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
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
    fun createPost(@RequestBody req: PostCreateRequest): ResponseEntity<PostDTO> {
        val response = postService.createPost(req)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }
}
