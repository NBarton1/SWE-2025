package com.jknv.lum.controller

import com.jknv.lum.model.dto.LikeStatusDTO
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.type.LikeType
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.LikeStatusService
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class CoachControllerTest {
    private val likeStatusService: LikeStatusService = mockk()

    val coachController = CoachController(likeStatusService)

    val details: AccountDetails = mockk()

    lateinit var coach: Coach

    val mockId: Long = 1L

    @BeforeEach
    fun setup() {
        coach = Coach(account = mockk())

        every { details.id } returns mockId
    }

    @Test
    fun setLikeStatusTest() {
        val expected: LikeStatusDTO = mockk()

        every { likeStatusService.createLikeStatus(mockId, coach.id, LikeType.COACH, any()) } returns expected

        val response = coachController.setLikeStatus(coach.id, details, true)

        assertEquals(expected, response.body)
        assertEquals(HttpStatus.OK, response.statusCode)
    }

    @Test
    fun getLikeStatusTest() {
        val expected: LikeStatusDTO = mockk()

        every { likeStatusService.getLikeStatus(mockId, coach.id, LikeType.COACH) } returns expected

        val response = coachController.getLikeStatus(coach.id, details)

        verify { likeStatusService.getLikeStatus(mockId, coach.id, LikeType.COACH) }

        assertEquals(expected, response.body)
        assertEquals(HttpStatus.OK, response.statusCode)
    }

    @Test
    fun getLikeCountTest() {
        val expected = 3L

        every { likeStatusService.getNumLikeStatuses(coach.id, LikeType.COACH, true) } returns expected

        val response = coachController.getLikeCount(coach.id)

        verify { likeStatusService.getNumLikeStatuses(coach.id, LikeType.COACH, true) }

        assertEquals(expected, response.body)
        assertEquals(HttpStatus.OK, response.statusCode)
    }

    @Test
    fun getDislikeCountTest() {
        val expected = 3L

        every { likeStatusService.getNumLikeStatuses(coach.id, LikeType.COACH, false) } returns expected

        val response = coachController.getDislikeCount(coach.id)

        verify { likeStatusService.getNumLikeStatuses(coach.id, LikeType.COACH, false) }

        assertEquals(expected, response.body)
        assertEquals(HttpStatus.OK, response.statusCode)
    }
}