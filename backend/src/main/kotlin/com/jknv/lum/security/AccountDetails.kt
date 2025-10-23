package com.jknv.lum.security

import com.jknv.lum.model.entity.Account
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.Collections

class AccountDetails(
    val account: Account
) : UserDetails {
    override fun getAuthorities(): Collection<GrantedAuthority> {
        return Collections.singleton(SimpleGrantedAuthority("ROLE_"+account.role.name))
    }

    override fun getPassword(): String {
        return account.password
    }

    override fun getUsername(): String {
        return account.username
    }
}