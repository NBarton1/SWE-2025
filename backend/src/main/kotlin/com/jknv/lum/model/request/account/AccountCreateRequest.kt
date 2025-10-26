package com.jknv.lum.model.request.account

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.type.Role
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

data class AccountCreateRequest (
    val name: String,
    val username: String,
    val password: String,
    val role: Role = Role.GUARDIAN, // standard creation role
    private val bCryptPasswordEncoder: BCryptPasswordEncoder = BCryptPasswordEncoder(),
    ) {
    fun toEntity(): Account {
        return Account(
            name = name,
            username = username,
            password = bCryptPasswordEncoder.encode(password),
            role = role,
        )
    }
}
