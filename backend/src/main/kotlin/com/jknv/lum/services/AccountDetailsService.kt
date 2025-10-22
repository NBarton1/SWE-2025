package com.jknv.lum.services

import com.jknv.lum.LOGGER
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
        val account = accountRepository.findByUsername(username)

        if (account == null) {
            LOGGER.info("No account with username: $username")
            throw UsernameNotFoundException(username)
        }

        val accountDetails = AccountDetails(account)
        LOGGER.info("Found account with username: $accountDetails")

        return accountDetails
    }
}