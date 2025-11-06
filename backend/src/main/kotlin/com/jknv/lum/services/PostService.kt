package com.jknv.lum.services

import com.jknv.lum.model.dto.PostDTO
import com.jknv.lum.model.entity.Post
import com.jknv.lum.model.request.post.PostCreateRequest
import com.jknv.lum.repository.PostRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


@Service
@Transactional
class PostService (
    private val postRepository: PostRepository,
) {
    fun createPost(req: PostCreateRequest): PostDTO {
        val parentPost: Post? = req.parentId?.let { id ->
            getPostById(id)
        }

        return postRepository.save(req.toEntity(parentPost)).toDTO()
    }

    fun getPostById(id: Long): Post =
        postRepository.findById(id).orElseThrow { EntityNotFoundException("Post $id not found") }
}
