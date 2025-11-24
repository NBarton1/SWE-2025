package com.jknv.lum.controller

import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.FlagService
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class FlagControllerTest {
    private val flagService: FlagService = mockk()

    val flagController = FlagController(flagService)

    val details: AccountDetails = mockk()

    val mockId: Long = 1L

    @BeforeEach
    fun setup() {
        every { details.id } returns mockId
    }

    @Test
    fun deleteLikeStatusTest() {
        justRun { flagService.deleteFlag(mockId, any()) }

        val response = flagController.deleteFlag(mockId, details)

        verify { flagService.deleteFlag(mockId, any()) }

        assertEquals(response.statusCode, HttpStatus.OK)
    }
}