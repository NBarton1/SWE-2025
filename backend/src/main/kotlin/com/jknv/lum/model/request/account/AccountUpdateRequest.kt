package com.jknv.lum.model.request.account

data class AccountUpdateRequest(
    val name: String?,
    val username: String?,
    val email: String?,
    val password: String?,
)
