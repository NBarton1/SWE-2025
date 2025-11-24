package com.jknv.lum.services

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Flag
import com.jknv.lum.model.entity.Post
import com.jknv.lum.repository.FlagRepository
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import kotlin.test.Test
import kotlin.test.assertEquals
import java.util.Optional

class FlagServiceTest {
    private val flagRepository: FlagRepository = mockk()
    private val postService: PostService = mockk()
    private val accountService: AccountService = mockk()

    val flagService = FlagService(
        flagRepository,
        postService,
        accountService
    )

    lateinit var post: Post
    lateinit var account: Account
    lateinit var flag: Flag

    val mockId: Long = 1L

    @BeforeEach
    fun setUp() {
        post = Post(isApproved = true)
        every { postService.getPostById(post.id) } returns post

        account = mockk()
        every { accountService.getAccountById(mockId) } returns account
        every { account.id } returns mockId
        every { account.toDTO() } returns mockk()

        flag = Flag(post = post, account = account)
    }

    @Test
    fun createFlagByIdsTest() {
        every { flagRepository.save(any()) } returns flag

        val result = flagService.createFlagByIds(post.id, account.id)

        verify {
            postService.getPostById(post.id)
            accountService.getAccountById(mockId)
            flagRepository.save(any())
        }

        assertEquals(result, flag.toDTO())
    }

    @Test
    fun getNumFlagsTest() {
        val expected = 1L

        every { flagRepository.countFlagsByPostId(post.id) } returns expected

        val result = flagService.getNumFlags(post.id)

        verify { flagRepository.countFlagsByPostId(post.id) }

        assertEquals(expected, result)
    }

    @Test
    fun deleteFlagTest() {
        justRun { flagRepository.deleteById(Flag.PK(post.id, mockId)) }

        flagService.deleteFlag(post.id, account.id)

        verify {
            postService.getPostById(post.id)
            flagRepository.deleteById(Flag.PK(post.id, mockId))
        }
    }

    @Test
    fun getFlagByIdTest() {
        every { flagRepository.getFlagById(Flag.PK(post.id, mockId))} returns Optional.of(flag)

        val result = flagService.getFlagById(post.id, account.id)

        verify { flagRepository.getFlagById(Flag.PK(post.id, mockId)) }

        assertEquals(result, flag.toDTO())
    }
}