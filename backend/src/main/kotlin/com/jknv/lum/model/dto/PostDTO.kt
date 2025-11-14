package com.jknv.lum.model.dto


// TODO: Figure out how to return parent/children
class PostDTO (
    val id: Long,
    var media: MutableList<ContentDTO>,
    val textContent: String,
    val likeCount: Int,
    val dislikeCount: Int,
)
