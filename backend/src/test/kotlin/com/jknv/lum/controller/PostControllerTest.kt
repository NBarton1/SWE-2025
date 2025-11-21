package com.jknv.lum.controller

import com.jknv.lum.model.entity.Post
import com.jknv.lum.model.request.post.PostCreateRequest
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.PostService
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

class PostControllerTest {
    val postService: PostService = mockk()

    val postController = PostController(postService)

    val details: AccountDetails = mockk()

    lateinit var post: Post

    val mockId = 1L

    @BeforeEach
    fun setUp() {
        post = Post(textContent = "Donkey Kong won")

        every { details.id } returns mockId
    }

    @Test
    fun createPostTest() {
        val req: PostCreateRequest = mockk()

        every { postService.createPost(req, mockId) } returns post.toDTO()

        val response = postController.createPost(details, req)

        verify { postService.createPost(req, mockId) }

        assertEquals(response.statusCode, HttpStatus.CREATED)
        assertEquals(response.body, post.toDTO())
    }

    @Test
    fun getAllPostsTest() {
        every { postService.getAllPosts() } returns listOf(post.toDTO())

        val response = postController.getAllPosts()

        verify { postService.getAllPosts() }

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(response.body, listOf(post.toDTO()))
    }

    @Test
    fun deletePostTest() {
        justRun { postService.deletePost(post.id, mockId) }

        val response = postController.delete(details, post.id)

        verify { postService.deletePost(post.id, mockId) }

        assertEquals(response.statusCode, HttpStatus.OK)
    }
}