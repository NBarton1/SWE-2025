package com.jknv.lum.controller

import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.LikeStatusService
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class LikeStatusControllerTest {
    private val likeStatusService: LikeStatusService = mockk()

    val likeStatusController: LikeStatusController = LikeStatusController(likeStatusService)

    val details: AccountDetails = mockk()

    val mockId: Long = 1L

    @BeforeEach
    fun setup() {
        every { details.id } returns mockId
    }

    @Test
    fun deleteLikeStatusTest() {
        justRun { likeStatusService.deleteLikeStatus(mockId, any()) }

        val response = likeStatusController.deleteLikeStatus(mockId, details)

        verify { likeStatusService.deleteLikeStatus(mockId, any()) }

        assertEquals(response.statusCode, HttpStatus.OK)
    }
}