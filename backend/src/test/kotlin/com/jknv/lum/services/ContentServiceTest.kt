package com.jknv.lum.services

import com.jknv.lum.model.entity.Content
import com.jknv.lum.repository.ContentRepository
import io.mockk.every
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

        val targetFile = Path.of(storagePath, content.id.toString())
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
        val targetFile = Path.of(storagePath, content.id.toString())
        val fileBytes = "hello".toByteArray()
        Files.write(targetFile, fileBytes)

        val dto = content.toDTO()
        val result = contentService.download(dto)

        assertEquals(fileBytes.toList(), result.toList())

        Files.deleteIfExists(targetFile)
    }
}
