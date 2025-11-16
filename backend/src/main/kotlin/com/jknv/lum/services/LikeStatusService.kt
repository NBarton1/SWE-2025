package com.jknv.lum.services

import com.jknv.lum.components.EntityValidatorRegistry
import com.jknv.lum.model.dto.LikeStatusDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.LikeStatus
import com.jknv.lum.model.entity.Post
import com.jknv.lum.model.type.LikeType
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.repository.LikeRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service

@Service
class LikeStatusService(
    private val likeRepository: LikeRepository,
    private val accountRepository: AccountRepository,
    private val entityValidatorRegistry: EntityValidatorRegistry
) {

    fun createLikeStatus(accountId: Long, entityId: Long, likeType: LikeType, liked: Boolean): LikeStatusDTO {
        validateEntityExists(entityId, likeType)
        return createLikeStatusEntity(accountId, entityId, likeType, liked).toDTO()
    }

    internal fun createLikeStatusEntity(accountId: Long, entityId: Long, likeType: LikeType, liked: Boolean): LikeStatus {

        val account = accountRepository.findById(accountId).orElseThrow()

        val existing = getLikeStatusByAccount(account, entityId, likeType) ?:
            return likeRepository.save(
                LikeStatus(
                    account = account,
                    entityId = entityId,
                    liked = liked,
                    likeType = likeType,
                )
            )

        if (existing.liked == liked) return existing

        existing.liked = liked
        return likeRepository.save(existing)
    }

    internal fun isLikeStatusOwner(likeId: Long, accountId: Long): Boolean =
        accountId == getLikeStatusById(likeId).account.id

    internal fun getLikeStatusById(id: Long): LikeStatus =
        likeRepository.findById(id).orElseThrow { EntityNotFoundException("Like $id not found") }

    internal fun getLikeStatusByAccount(account: Account, entityId: Long, likeType: LikeType): LikeStatus? {
        return likeRepository.findByAccountAndEntityIdAndLikeType(account, entityId, likeType)
    }

    fun getLikeStatus(accountId: Long, entityId: Long, likeType: LikeType): LikeStatusDTO? {
        validateEntityExists(entityId, likeType)
        val account = accountRepository.findById(accountId).orElseThrow()
        return getLikeStatusByAccount(account, entityId, likeType)?.toDTO()
    }

    fun deleteLikeStatus(accountId: Long, likeId: Long) {
        if (!isLikeStatusOwner(likeId, accountId)) {
            throw EntityNotFoundException("Like $likeId not found")
        }

        likeRepository.deleteById(likeId)
    }

    fun getNumLikes(entityId: Long, likeType: LikeType): Long {
        return likeRepository.countLikeStatusesByEntityIdAndLikeTypeAndLiked(entityId, likeType, true)
    }

    fun getNumDislikes(entityId: Long, likeType: LikeType): Long {
        return likeRepository.countLikeStatusesByEntityIdAndLikeTypeAndLiked(entityId, likeType, false)
    }

    internal fun validateEntityExists(entityId: Long, likeType: LikeType) {
        entityValidatorRegistry.validateExists(likeType.entityClass, entityId)
    }
}