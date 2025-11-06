package com.jknv.lum.model.request.post

import com.jknv.lum.model.entity.Post

class PostCreateRequest (
    var content: String,
    var parentId: Long?,
) {
    fun toEntity(parent: Post?): Post {
        return Post(
            content = content,
            parentPost = parent,
        )
    }
}
