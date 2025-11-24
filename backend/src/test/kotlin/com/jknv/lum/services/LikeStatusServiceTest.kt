package com.jknv.lum.services

import com.jknv.lum.components.EntityValidatorRegistry
import com.jknv.lum.model.entity.LikeStatus
import com.jknv.lum.model.type.LikeType
import com.jknv.lum.repository.LikeRepository
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import kotlin.test.Test
import kotlin.test.assertEquals
import java.util.Optional

class LikeStatusServiceTest {
    private val likeRepository: LikeRepository = mockk()
    private val accountService: AccountService = mockk()
    private val entityValidatorRegistry: EntityValidatorRegistry = mockk()

    private val likeStatusService = LikeStatusService(
        likeRepository,
        accountService,
        entityValidatorRegistry
    )

    lateinit var likeStatus: LikeStatus

    val mockId: Long = 1L

    @BeforeEach
    fun setup() {
        likeStatus = LikeStatus(
            account = mockk(),
            entityId = mockId,
            likeType = LikeType.COACH,
            liked = true
        )

        every { likeStatus.account.id } returns mockId
        every { likeStatus.account.toDTO() } returns mockk()

        justRun { entityValidatorRegistry.validateExists(any(), any()) }
    }

    @Test
    fun updateLikeStatusTest() {
        every { accountService.getAccountById(mockId) } returns likeStatus.account
        every { likeRepository.findByAccountAndEntityIdAndLikeType(
            likeStatus.account,
            likeStatus.entityId,
            likeStatus.likeType)
        } returns likeStatus
        every { likeRepository.save(likeStatus) } returns likeStatus

        val result = likeStatusService.createLikeStatus(
            mockId,
            likeStatus.entityId,
            likeStatus.likeType,
            !likeStatus.liked
        )

        verify {
            accountService.getAccountById(mockId)
            likeRepository.findByAccountAndEntityIdAndLikeType(
                likeStatus.account,
                likeStatus.entityId,
                likeStatus.likeType
            )
            likeRepository.save(likeStatus)
        }

        assertEquals(likeStatus.toDTO(), result)
    }

    @Test
    fun createLikeStatusTest() {
        every { accountService.getAccountById(mockId) } returns likeStatus.account
        every { likeRepository.findByAccountAndEntityIdAndLikeType(
            likeStatus.account,
            likeStatus.entityId,
            likeStatus.likeType)
        } returns null
        every { likeRepository.save(any()) } returns likeStatus

        val result = likeStatusService.createLikeStatus(
            mockId,
            likeStatus.entityId,
            likeStatus.likeType,
            !likeStatus.liked
        )

        verify {
            accountService.getAccountById(mockId)
            likeRepository.findByAccountAndEntityIdAndLikeType(
                likeStatus.account,
                likeStatus.entityId,
                likeStatus.likeType
            )
            likeRepository.save(any())
        }

        assertEquals(likeStatus.toDTO(), result)
    }

    @Test
    fun getLikeStatusTest() {
        every { accountService.getAccountById(mockId) } returns likeStatus.account
        every { likeRepository.findByAccountAndEntityIdAndLikeType(
            likeStatus.account,
            likeStatus.entityId,
            likeStatus.likeType
        )} returns likeStatus

        val result = likeStatusService.getLikeStatus(mockId, likeStatus.entityId, likeStatus.likeType)

        verify {
            accountService.getAccountById(mockId)
            likeRepository.findByAccountAndEntityIdAndLikeType(
                likeStatus.account,
                likeStatus.entityId,
                likeStatus.likeType
            )
        }

        assertEquals(likeStatus.toDTO(), result)
    }

    @Test
    fun deleteLikeStatusTest() {
        every { likeRepository.findById(mockId) } returns Optional.of(likeStatus)
        justRun { likeRepository.deleteById(mockId) }

        likeStatusService.deleteLikeStatus(mockId, likeStatus.entityId)

        verify {
            likeRepository.findById(mockId)
            likeRepository.deleteById(mockId)
        }
    }

    @Test
    fun getNumLikeStatusesTest() {
        val expected = 3L

        every { likeRepository.countLikeStatusesByEntityIdAndLikeTypeAndLiked(
            likeStatus.entityId,
            likeStatus.likeType,
            any()
        )} returns expected

        val result = likeStatusService.getNumLikeStatuses(likeStatus.entityId, likeStatus.likeType, true)

        assertEquals(expected, result)
    }
}