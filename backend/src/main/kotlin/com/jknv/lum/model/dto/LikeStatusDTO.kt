package com.jknv.lum.model.dto

import com.jknv.lum.model.type.LikeType

data class LikeStatusDTO (
    val id: Long,
    val account: AccountDTO,
    val likeType: LikeType,
    val entityId: Long,
    val liked: Boolean
)