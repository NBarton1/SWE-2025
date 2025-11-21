package com.jknv.lum.model.dto

import java.time.LocalDateTime


// TODO: Figure out how to return parent/children
class PostDTO (
    val id: Long,
    val account: AccountDTO?,
    var media: MutableList<ContentDTO>,
    val textContent: String,
    val creationTime: LocalDateTime?,
    val flagCount: Int,
    val match: MatchDTO?,
    val isApproved: Boolean,
)
