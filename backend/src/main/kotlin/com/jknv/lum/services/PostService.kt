package com.jknv.lum.services

import com.jknv.lum.LOGGER
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
    private val accountService: AccountService,
    private val contentService: ContentService,
) {
    fun createPost(req: PostCreateRequest, accountId: Long): PostDTO {
        val parentPost: Post? = req.parentId?.let { id -> getPostById(id) }
        val account = accountService.getAccountById(accountId)

        val createdPost = postRepository.save(req.toEntity(account, parentPost))

        req.media?.forEach { contentService.uploadContent(it, createdPost) }

        return createdPost.toDTO()
    }

    fun getAllPosts(): List<PostDTO> =
        postRepository.findAll().map { it.toDTO() }

    fun deletePost(postId: Long, accountId: Long) {
        if (! (isPostOwner(postId, accountId) || accountService.isAdmin(accountId)) )
            throw IllegalAccessException("You do not have access to delete post $postId")

        postRepository.deleteById(postId)
    }

    internal fun getPostById(id: Long): Post =
        postRepository.findById(id).orElseThrow { EntityNotFoundException("Post $id not found") }

    private fun isPostOwner(postId: Long, accountId: Long): Boolean =
        accountId == getPostById(postId).account?.id
}
