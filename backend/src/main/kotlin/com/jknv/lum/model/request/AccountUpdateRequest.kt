package com.jknv.lum.model.request

data class AccountUpdateRequest(
    val name: String?,
    val username: String?,
    val password: String?,
    val picture: ByteArray?,
)
