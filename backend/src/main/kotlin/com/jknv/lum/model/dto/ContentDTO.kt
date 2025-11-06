package com.jknv.lum.model.dto

data class ContentDTO (
    var id: Long,
    var originalFilename: String,
    var contentType: String,
    var fileSize: Long,
)