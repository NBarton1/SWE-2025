package com.jknv.lum.model.dto

data class ContentDTO (
    var id: Long,
    var filename: String,
    var contentType: String,
    var fileSize: Long,
    var downloadUrl: String
)