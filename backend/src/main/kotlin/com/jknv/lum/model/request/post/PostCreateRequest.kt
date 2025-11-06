package com.jknv.lum.model.request.post

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Post
import org.springframework.web.multipart.MultipartFile

class PostCreateRequest (
    var media: List<MultipartFile>?,
    var textContent: String,
    var parentId: Long?,
) {
    fun toEntity(account: Account, parent: Post?): Post {
        return Post(
            textContent = textContent,
            parentPost = parent,
            account = account
        )
    }
}
