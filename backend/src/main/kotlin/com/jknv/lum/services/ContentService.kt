package com.jknv.lum.services

import com.jknv.lum.model.dto.ContentDTO
import com.jknv.lum.model.entity.Content
import com.jknv.lum.model.entity.Post
import com.jknv.lum.repository.ContentRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.StandardCopyOption

@Service
class ContentService(
    @param:Value($$"${lum.storage.path}")
    private val storagePath: String,
    private val contentRepository: ContentRepository,
) {
    fun uploadForPost(file: MultipartFile, post: Post?): Content {
        if (file.isEmpty) {
            throw IllegalArgumentException("file can not be empty")
        }

        val uploadPath = Paths.get(storagePath)
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath)
        }

        val originalFilename = file.originalFilename
            ?: throw IllegalArgumentException("Filename can not be empty")

        // TODO validate media type being uploaded
        val content = Content(
            filename = originalFilename,
            contentType = file.contentType ?: throw IllegalArgumentException("contentType must be provided"),
            fileSize = file.size,
            post = post,
        )

        val savedContent = contentRepository.save(content)

        val targetPath = uploadPath.resolve(content.id.toString())
        Files.copy(file.inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING)

        return savedContent
    }

    fun upload(file: MultipartFile): Content =
        uploadForPost(file, null)

    fun getContent(id: Long): ContentDTO = getContentById(id).toDTO()

    fun download(content: ContentDTO): ByteArray {

        val downloadPath = Paths.get(storagePath).resolve(content.id.toString())

        val fileBytes = Files.readAllBytes(downloadPath)

        return fileBytes
    }

    internal fun getContentById(id: Long): Content =
        contentRepository.findById(id).orElseThrow { EntityNotFoundException("Content $id not found") }
}