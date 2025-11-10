//package com.jknv.lum.controller
//
//import com.jknv.lum.model.entity.Content
//import com.jknv.lum.services.ContentService
//import io.mockk.every
//import io.mockk.mockk
//import io.mockk.verify
//import org.junit.jupiter.api.Assertions.assertEquals
//import org.junit.jupiter.api.BeforeEach
//import org.junit.jupiter.api.Test
//import org.springframework.http.HttpStatus
//import org.springframework.web.multipart.MultipartFile
//
//class ContentControllerTest {
//    val contentService: ContentService = mockk()
//
//    val contentController: ContentController = ContentController(contentService)
//
//    lateinit var content: Content
//
//    val mockId = 1L
//
//    @BeforeEach
//    fun setUp() {
//        content = Content(filename = "file", fileSize = 0xff, contentType = "text/plain")
//    }
//
//    @Test
//    fun uploadTest() {
//        val file: MultipartFile = mockk()
//
//        every { contentService.upload(file) } returns content
//
//        val response = contentController.upload(file)
//
//        verify { contentService.upload(file) }
//
//        assertEquals(response.statusCode, HttpStatus.OK)
//        assertEquals(response.body, content.toDTO())
//    }
//
//    @Test
//    fun downloadTest() {
//        val bytes = byteArrayOf(0)
//
//        every { contentService.getContent(mockId) } returns content.toDTO()
//        every { contentService.download(content.toDTO()) } returns bytes
//
//        val response = contentController.download(mockId)
//
//        verify {
//            contentService.getContent(mockId)
//            contentService.download(content.toDTO())
//        }
//
//        assertEquals(response.statusCode, HttpStatus.OK)
//        assertEquals(response.body, bytes)
//    }
//}
