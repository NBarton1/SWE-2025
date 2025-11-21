package com.jknv.lum.services

import com.jknv.lum.LOGGER
import com.jknv.lum.model.dto.LikeStatusDTO
import com.jknv.lum.model.dto.PostDTO
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.entity.Post
import com.jknv.lum.model.request.post.PostCreateRequest
import com.jknv.lum.model.type.LikeType
import com.jknv.lum.model.type.Role
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
    private val likeStatusService: LikeStatusService,
) {
    fun createPost(req: PostCreateRequest, accountId: Long): PostDTO {
        val parentPost: Post? = req.parentId?.let { id -> getPostById(id) }
        val account = accountService.getAccountById(accountId)

        val post = req.toEntity(account, parentPost)

        if (parentPost?.isApproved == false) throw IllegalAccessException("Cannot reply to unapproved post")

        post.isApproved = account.role != Role.PLAYER

        val createdPost = postRepository.save(post)

        req.media?.forEach { contentService.uploadContent(it, createdPost) }

        return createdPost.toDTO()
    }

    fun createPostForMatch(match: Match): Post =
        postRepository.save(Post(match = match, isApproved = true))

    fun getAllVisibleRootPosts(accountId: Long): List<PostDTO> =
        postRepository.findByParentPostIsNull()
            .filter { isPostVisibleToAccount(it, accountId) }
            .map { it.toDTO() }

    internal fun getAllUnapprovedPostsFor(accountId: Long): List<PostDTO> =
        postRepository.findByIsApprovedIsFalseAndAccountId(accountId).map { it.toDTO() }

    fun getAllRootPosts(): List<PostDTO> =
        postRepository.findByParentPostIsNull().map { it.toDTO() }

    fun getVisibleChildren(id: Long, accountId: Long): List<PostDTO> =
        getPostById(id).children.filter { isPostVisibleToAccount(it, accountId) }.map { it.toDTO() }

    fun deletePost(postId: Long, accountId: Long) {
        val requester = accountService.getAccountById(accountId)
        if (! (isPostOwner(postId, accountId) || requester.role == Role.ADMIN) )
            throw IllegalAccessException("You do not have access to delete post $postId")

        postRepository.deleteById(postId)
        LOGGER.info("Post Delected $postId")
    }

    fun getFlaggedPosts(): List<PostDTO> =
        postRepository.findAll()
            .filter { it.flagCount > 0 }
            .sortedByDescending { it.flagCount }
            .map { it.toDTO() }

    fun likePost(postId: Long, accountId: Long, liked: Boolean): LikeStatusDTO {

        val post = getPostById(postId)
        if (!post.isApproved) throw IllegalAccessException("Cannot like unapproved post $post")

        return likeStatusService.createLikeStatus(accountId, postId, LikeType.POST, liked)
    }

    internal fun getPostById(id: Long): Post =
        postRepository.findById(id).orElseThrow { EntityNotFoundException("Post $id not found") }

    internal fun isPostOwner(postId: Long, accountId: Long): Boolean =
        accountId == getPostById(postId).account?.id


    internal fun isPostVisibleToAccount(post: Post, accountId: Long): Boolean {

        val account = accountService.getAccountById(accountId)

        val posterId = post.account?.id

        return post.isApproved ||
                isPostOwner(post.id, accountId) ||
                account.role == Role.ADMIN ||
                account.guardian?.isGuardianOf(posterId) ?: false
    }

    fun getUnapprovedPostsForGuardiansChildren(guardianId: Long): HashMap<Long, List<PostDTO>> {
        val guardian = accountService.getAccountById(guardianId).guardian

        val childrenPostMap = HashMap<Long, List<PostDTO>>()

        guardian?.children?.forEach { child ->
            childrenPostMap[child.id] = getAllUnapprovedPostsFor(child.id)
        }

        return childrenPostMap
    }


    fun approveChildPost(guardianId: Long, postId: Long): PostDTO {
        val account = accountService.getAccountById(guardianId)

        val post = getPostById(postId)

        val isGuardianForChild = account.guardian?.isGuardianOf(post.account?.id) ?: false
        if (isGuardianForChild || account.role == Role.ADMIN) {
            post.isApproved = true
        } else {
            throw IllegalAccessException("Unable to approve post $postId")
        }

        return post.toDTO()
    }

    fun disapproveChildPost(guardianId: Long, postId: Long): PostDTO {
        val account = accountService.getAccountById(guardianId)

        val guardian = account.guardian ?: throw EntityNotFoundException("Guardian $guardianId not found")

        val post = getPostById(postId)

        val isGuardianForChild = guardian.isGuardianOf(post.account?.id)
        if (isGuardianForChild || account.role == Role.ADMIN) {
            postRepository.deleteById(postId)
        } else {
            throw IllegalAccessException("Unable to disapprove post $postId")
        }

        return post.toDTO()
    }

}
