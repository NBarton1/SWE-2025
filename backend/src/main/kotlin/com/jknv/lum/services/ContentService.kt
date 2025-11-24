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

    @param:Value("\${lum.storage.path}")
    private val storagePath: String,
    private val contentRepository: ContentRepository,
) {
    fun upload(file: MultipartFile): ContentDTO =
        uploadContent(file).toDTO()

    fun getUnapprovedContent(): List<ContentDTO> =
        contentRepository.findAll()
            .filter { !it.isApproved }
            .map { it.toDTO() }

    fun getContent(id: Long): ContentDTO =
        getContentById(id).toDTO()

    fun download(content: ContentDTO): ByteArray {
        val downloadPath = Paths.get(storagePath).resolve(content.filename)
        val fileBytes = Files.readAllBytes(downloadPath)

        return fileBytes
    }

    fun approveContent(id: Long): ContentDTO {
        val content = getContentById(id)
        content.isApproved = true

        return updateContent(content)
    }

    fun deleteContentById(id: Long) =
        contentRepository.deleteById(id)

    internal fun createContent(content: Content): Content =
        contentRepository.save(content)

    internal fun updateContent(content: Content): ContentDTO =
        contentRepository.save(content).toDTO()

    internal fun getContentById(id: Long): Content =
        contentRepository.findById(id).orElseThrow { EntityNotFoundException("Content $id not found") }

    internal fun uploadContent(file: MultipartFile, post: Post? = null): Content {
        if (file.isEmpty) {
            throw IllegalArgumentException("file can not be empty")
        }

        val uploadPath = Paths.get(storagePath)
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath)
        }

        val originalFilename = file.originalFilename?.takeIf { it.isNotBlank() }
            ?: throw IllegalArgumentException("Filename can not be empty")

        val contentType = file.contentType?.takeIf { it.isNotBlank() }
            ?: throw IllegalArgumentException("Content type must be provided")

        // TODO validate media type being uploaded
        val content = createContent(
            Content(
                filename = originalFilename,
                contentType = contentType,
                fileSize = file.size,
                post = post,
                isApproved = post != null
            )
        )

        post?.media?.add(content)

        val targetPath = uploadPath.resolve(content.filename)
        Files.copy(file.inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING)

        return content
    }
}