package com.jknv.lum.services

import com.jknv.lum.model.dto.LikeStatusDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.entity.Post
import com.jknv.lum.model.request.post.PostCreateRequest
import com.jknv.lum.model.type.LikeType
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.PostRepository
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import kotlin.test.Test
import kotlin.test.assertEquals
import java.util.Optional

class PostServiceTest {
    val postRepository: PostRepository = mockk()
    val accountService: AccountService = mockk()
    val contentService: ContentService = mockk()
    val likeStatusService: LikeStatusService = mockk()

    val postService: PostService = PostService(
        postRepository,
        accountService,
        contentService,
        likeStatusService
    )

    lateinit var post: Post
    lateinit var account: Account

    @BeforeEach
    fun setUp() {
        account = Account(name = "name", username = "user", password = "pass", role = Role.PLAYER)
        post = Post(isApproved = true, account = account)
    }

    @Test
    fun createPostTest() {
        val req = PostCreateRequest(
            media = null,
            textContent = "",
            parentId = post.id,
        )

        val newPost = Post(parentPost = post)
        post.children.add(newPost)

        every { postRepository.findById(post.id) } returns Optional.of(post)
        every { accountService.getAccountById(account.id) } returns account
        every { postRepository.save(any()) } returns newPost
        justRun { contentService.uploadContent(any()) }

        val result = postService.createPost(req, account.id)

        verify {
            postRepository.findById(post.id)
            accountService.getAccountById(account.id)
            postRepository.save(any())
        }

        assertEquals(newPost.toDTO(), result)
    }

    @Test
    fun createPostForMatchTest() {
        val match: Match = mockk()
        post.match = match

        every { postRepository.save(any()) } returns post

        val result = postService.createPostForMatch(match)

        verify { postRepository.save(any()) }

        assertEquals(post, result)
    }

    @Test
    fun getAllVisibleRootPostsTest() {
        every { postRepository.findByParentPostIsNull() } returns listOf(post)
        every { accountService.getAccountById(account.id)} returns account

        val result = postService.getAllVisibleRootPosts(account.id)

        verify {
            postRepository.findByParentPostIsNull()
            accountService.getAccountById(account.id)
        }

        assertEquals(listOf(post.toDTO()), result)
    }

    @Test
    fun getVisibleChildrenTest() {
        every { postRepository.findById(post.id) } returns Optional.of(post)

        val result = postService.getVisibleChildren(post.id, account.id)

        verify { postRepository.findById(post.id) }

        assertEquals(listOf(), result)
    }

    @Test
    fun deletePostTest() {
        every { accountService.getAccountById(account.id) } returns account

        every { postRepository.findById(post.id) } returns Optional.of(post)
        justRun { postRepository.deleteById(post.id) }

        postService.deletePost(post.id, account.id)

        verify { postRepository.deleteById(post.id) }
    }

    @Test
    fun getFlaggedPostsTest() {
        val flaggedPost = Post(flagCount = 1)

        every { postRepository.findAll() } returns listOf(post, flaggedPost)

        val result = postService.getFlaggedPosts()

        verify { postRepository.findAll() }

        assertEquals(listOf(flaggedPost.toDTO()), result)
    }

    @Test
    fun likePostTest() {
        val likeStatus: LikeStatusDTO = mockk()

        every { postRepository.findById(post.id) } returns Optional.of(post)
        every { likeStatusService.createLikeStatus(post.id, account.id, LikeType.POST, any()) } returns likeStatus

        val result = postService.likePost(post.id, account.id, true)

        verify {
            postRepository.findById(post.id)
            likeStatusService.createLikeStatus(post.id, account.id, LikeType.POST, any())
        }

        assertEquals(likeStatus, result)
    }

    @Test
    fun getUnapprovedPostsForGuardiansChildrenTest() {
        account.player = mockk()
        every { account.player?.id } returns account.id

        val guardianAccount: Account = mockk()
        val guardian: Guardian = mockk()
        every { guardianAccount.guardian } returns guardian
        every { guardian.id } returns account.id + 1
        every { guardian.children } returns (account.player?.let { mutableSetOf(it) } ?: mutableSetOf())

        every { accountService.getAccountById(any()) } returns guardianAccount
        every { postRepository.findByIsApprovedIsFalseAndAccountId(account.id) } returns mutableListOf()

        val result = postService.getUnapprovedPostsForGuardiansChildren(guardian.id)

        assertEquals(hashMapOf(Pair(account.id, listOf())), result)
    }

    @Test
    fun approveChildPostTest() {
        account.role = Role.ADMIN

        every { accountService.getAccountById(account.id) } returns account
        every { postRepository.findById(post.id) } returns Optional.of(post)
        every { postRepository.save(post) } returns post

        val result = postService.approveChildPost(post.id, account.id)

        verify {
            accountService.getAccountById(account.id)
            postRepository.findById(post.id)
            postRepository.save(post)
        }

        assertEquals(post.toDTO(), result)
    }

    @Test
    fun disapproveChildPostTest() {
        account.role = Role.ADMIN

        every { accountService.getAccountById(account.id) } returns account
        every { postRepository.findById(post.id) } returns Optional.of(post)
        justRun { postRepository.delete(post) }

        postService.disapproveChildPost(post.id, account.id)

        verify {
            accountService.getAccountById(account.id)
            postRepository.findById(post.id)
            postRepository.delete(post)
        }
    }
}