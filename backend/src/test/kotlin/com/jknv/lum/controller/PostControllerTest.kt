package com.jknv.lum.controller

import com.jknv.lum.model.dto.FlagDTO
import com.jknv.lum.model.dto.LikeStatusDTO
import com.jknv.lum.model.dto.PostDTO
import com.jknv.lum.model.entity.Post
import com.jknv.lum.model.request.post.PostCreateRequest
import com.jknv.lum.model.type.LikeType
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.FlagService
import com.jknv.lum.services.LikeStatusService
import com.jknv.lum.services.PostService
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class PostControllerTest {
    val postService: PostService = mockk()
    val likeStatusService: LikeStatusService = mockk()
    val flagService: FlagService = mockk()

    val postController = PostController(postService, likeStatusService, flagService)

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

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(response.body, post.toDTO())
    }

    @Test
    fun getAllRootPosts() {
        every { postService.getAllVisibleRootPosts(mockId) } returns listOf(post.toDTO())

        val response = postController.getAllRootPosts(details)

        verify { postService.getAllVisibleRootPosts(mockId) }

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

    @Test
    fun setLikeStatusTest() {
        val expected: LikeStatusDTO = mockk()

        every { postService.likePost(post.id, mockId, any()) } returns expected

        val response = postController.setLikeStatus(post.id, details, true)

        verify { postService.likePost(post.id, mockId, any()) }

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(response.body, expected)
    }

    @Test
    fun getLikeStatusTest() {
        val expected: LikeStatusDTO = mockk()

        every { likeStatusService.getLikeStatus(mockId, post.id, LikeType.POST) } returns expected

        val response = postController.getLikeStatus(post.id, details)

        verify { likeStatusService.getLikeStatus(mockId, post.id, LikeType.POST) }

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(response.body, expected)
    }

    @Test
    fun getLikeCountTest() {
        val expected = 1L

        every { likeStatusService.getNumLikeStatuses(post.id, LikeType.POST, true) } returns expected

        val response = postController.getLikeCount(post.id)

        verify { likeStatusService.getNumLikeStatuses(post.id, LikeType.POST, true) }

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(response.body, expected)
    }

    @Test
    fun getDislikeCountTest() {
        val expected = 1L

        every { likeStatusService.getNumLikeStatuses(post.id, LikeType.POST, false) } returns expected

        val response = postController.getDislikeCount(post.id)

        verify { likeStatusService.getNumLikeStatuses(post.id, LikeType.POST, false) }

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(response.body, expected)
    }

    @Test
    fun flagPostTest() {
        val expected: FlagDTO = mockk()

        every { flagService.createFlagByIds(post.id, mockId) } returns expected

        val response = postController.flagPost(post.id, details)

        verify { flagService.createFlagByIds(post.id, mockId) }

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(response.body, expected)
    }

    @Test
    fun getFlagCountForPostTest() {
        val expected = 1L

        every { flagService.getNumFlags(post.id) } returns expected

        val response = postController.getFlagCountForPost(post.id)

        verify { flagService.getNumFlags(post.id) }

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(response.body, expected)
    }

    @Test
    fun getFlagForPostTest() {
        val expected: FlagDTO = mockk()

        every { flagService.getFlagById(post.id, mockId) } returns expected

        val response = postController.getFlagForPost(post.id, details)

        verify { flagService.getFlagById(post.id, mockId) }

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(response.body, expected)
    }

    @Test
    fun getFlaggedPostsTest() {
        val expected: List<PostDTO> = mockk()

        every { postService.getFlaggedPosts() } returns expected

        val response = postController.getFlaggedPosts()

        verify { postService.getFlaggedPosts() }

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(response.body, expected)
    }

    @Test
    fun getChildrenTest() {
        val expected: List<PostDTO> = mockk()

        every { postService.getVisibleChildren(post.id, mockId) } returns expected

        val response = postController.getChildren(post.id, details)

        verify { postService.getVisibleChildren(post.id, mockId) }

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(response.body, expected)
    }

    @Test
    fun getUnapprovedTest() {
        val expected: HashMap<Long, List<PostDTO>> = mockk()

        every { postService.getUnapprovedPostsForGuardiansChildren(mockId) } returns expected

        val response = postController.getUnapproved(details)

        verify { postService.getUnapprovedPostsForGuardiansChildren(mockId) }

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(response.body, expected)
    }

    @Test
    fun approvePostTest() {
        val expected: PostDTO = mockk()

        every { postService.approveChildPost(mockId, post.id) } returns expected

        val response = postController.approvePost(post.id, details)

        verify { postService.approveChildPost(mockId, post.id) }

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(response.body, expected)
    }

    @Test
    fun disapprovePostTest() {
        justRun { postService.disapproveChildPost(mockId, post.id) }

        val response = postController.disapprovePost(post.id, details)

        verify { postService.disapproveChildPost(mockId, post.id) }

        assertEquals(response.statusCode, HttpStatus.OK)
    }
}