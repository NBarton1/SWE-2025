package com.jknv.lum.services

import com.jknv.lum.LOGGER
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.security.AccountDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class AccountDetailsService(
    val accountRepository: AccountRepository,
) : UserDetailsService {


    override fun loadUserByUsername(username: String): AccountDetails {
        val account = accountRepository.findByUsername(username).orElseThrow { UsernameNotFoundException("User $username not found") }

        val accountDetails = AccountDetails(account)
        LOGGER.info("Found account with username: $username")

        return accountDetails
    }

    fun loadUserById(id: Long): AccountDetails {
        val account = accountRepository.findById(id).orElseThrow {
            UsernameNotFoundException("User not found with id: $id")
        }
        return AccountDetails(account)
    }
}