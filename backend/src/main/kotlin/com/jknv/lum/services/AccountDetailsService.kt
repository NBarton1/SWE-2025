package com.jknv.lum.services

import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.security.AccountDetails
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class AccountDetailsService(
    val accountRepository: AccountRepository,
) : UserDetailsService {


    override fun loadUserByUsername(username: String): UserDetails {
        val account = accountRepository.findAccountByUsername(username)
            ?: throw UsernameNotFoundException("User $username not found")

        return AccountDetails(account)
    }
}