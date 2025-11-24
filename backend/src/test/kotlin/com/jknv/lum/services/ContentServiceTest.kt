package com.jknv.lum.services

import com.jknv.lum.model.entity.Content
import com.jknv.lum.repository.ContentRepository
import io.mockk.every
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.mock.web.MockMultipartFile
import java.nio.file.Files
import java.nio.file.Path
import jakarta.persistence.EntityNotFoundException
import org.junit.jupiter.api.assertThrows
import java.util.Optional
import kotlin.test.assertEquals

class ContentServiceTest {
    val storagePath = "test"
    val contentRepository: ContentRepository = mockk()

    val contentService: ContentService = ContentService(storagePath, contentRepository)

    lateinit var content: Content

    @BeforeEach
    fun setup() {
        val path = Path.of(storagePath)
        if (!Files.exists(path)) Files.createDirectories(path)

        content = Content(
            filename = "filename",
            contentType = "png",
            fileSize = 0xff
        )
    }

    @Test
    fun getUnapprovedContentTest() {
        val approvedContent: Content = mockk()
        every { approvedContent.isApproved } returns true

        content.isApproved = false

        every { contentRepository.findAll() } returns listOf(content, approvedContent)

        val result = contentService.getUnapprovedContent()

        verify { contentRepository.findAll()}

        assertEquals(result, listOf(content.toDTO()))
    }

    @Test
    fun getContentByIdTest() {
        every { contentRepository.findById(any()) } answers {
            if (firstArg<Long>() == content.id)
                Optional.of(content)
            else Optional.empty()
        }

        val result = contentService.getContentById(content.id)

        verify { contentRepository.findById(content.id) }

        assertEquals(result, content)
        assertThrows<EntityNotFoundException> { contentService.getContentById(content.id + 1) }
    }

    @Test
    fun contentUploadTest() {
        val fileBytes = ByteArray(content.fileSize.toInt()) { 0 } // dummy data with same size as content
        val multipartFile = MockMultipartFile(
            "file",
            content.filename,
            content.contentType,
            fileBytes
        )

        every { contentRepository.save(any()) } returns content

        val saved = contentService.upload(multipartFile)

        assertEquals(content.id, saved.id)

        val targetFile = Path.of(storagePath, content.filename)
        assert(Files.exists(targetFile))
        assertEquals(fileBytes.toList(), Files.readAllBytes(targetFile).toList())

        Files.deleteIfExists(targetFile)
    }

    @Test
    fun getContentTest() {
        every { contentRepository.findById(content.id) } returns Optional.of(content)

        val result = contentService.getContent(content.id)

        verify { contentRepository.findById(content.id) }

        assertEquals(result, content.toDTO())
    }

    @Test
    fun contentDownloadTest() {
        val targetFile = Path.of(storagePath, content.filename)
        val fileBytes = "hello".toByteArray()
        Files.write(targetFile, fileBytes)

        val dto = content.toDTO()
        val result = contentService.download(dto)

        assertEquals(fileBytes.toList(), result.toList())

        Files.deleteIfExists(targetFile)
    }

    @Test
    fun approveContentTest() {
        every { contentRepository.findById(content.id) } returns Optional.of(content)
        every { contentRepository.save(content) } returns content

        val result = contentService.approveContent(content.id)

        verify {
            contentRepository.findById(content.id)
            contentRepository.save(any())
        }

        assertEquals(result, content.toDTO())
    }

    @Test
    fun deleteContentTest() {
        justRun { contentRepository.deleteById(content.id) }

        contentService.deleteContentById(content.id)

        verify { contentRepository.deleteById(content.id) }
    }

    @Test
    fun updateContentTest() {
        every { contentRepository.save(content) } returns content

        val result = contentService.updateContent(content)

        verify { contentRepository.save(content) }

        assertEquals(result, content.toDTO())
    }
}
