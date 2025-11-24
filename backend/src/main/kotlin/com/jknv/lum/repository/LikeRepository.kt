package com.jknv.lum.repository

import com.jknv.lum.model.dto.LikeStatusDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.LikeStatus
import com.jknv.lum.model.type.LikeType
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface LikeRepository : JpaRepository<LikeStatus, Long> {
    fun countLikeStatusesByEntityIdAndLikeTypeAndLiked(entityId: Long, likeType: LikeType, liked: Boolean): Long
    fun findByAccountAndEntityIdAndLikeType(
        account: Account,
        entityId: Long,
        likeType: LikeType
    ): LikeStatus?
}