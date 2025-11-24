package com.jknv.lum.services

import com.jknv.lum.model.dto.FlagDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Flag
import com.jknv.lum.model.entity.Post
import com.jknv.lum.repository.FlagRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
@Transactional
class FlagService(
    private val flagRepository: FlagRepository,
    private val postService: PostService,
    private val accountService: AccountService,
) {


    fun createFlagByIds(postId: Long, accountId: Long): FlagDTO {
        val post = postService.getPostById(postId)

        if (!post.isApproved) throw IllegalAccessException("Cannot flag unapproved post $post")

        val account = accountService.getAccountById(accountId)

        post.flagCount++
        return createFlag(post, account)
    }

    fun getNumFlags(postId: Long): Long {
        return flagRepository.countFlagsByPostId(postId)
    }

    fun deleteFlag(postId: Long, accountId: Long) {
        val post = postService.getPostById(postId)
        post.flagCount--
        flagRepository.deleteById(Flag.PK(postId, accountId))
    }

    internal fun createFlag(post: Post, account: Account): FlagDTO =
        flagRepository.save(Flag(post = post, account = account)).toDTO()

    fun getFlagById(postId: Long, accountId: Long): FlagDTO {
        return flagRepository
            .getFlagById(Flag.PK(accountId, postId))
            .orElseThrow()
            .toDTO()
    }
}