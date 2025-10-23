package com.jknv.lum.services

import com.jknv.lum.model.Account
import com.jknv.lum.request.AccountUpdateRequest
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.request.AccountLoginRequest
import jakarta.transaction.Transactional
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service

@Service
@Transactional
class AccountService(
    private val accountRepository: AccountRepository,
    private val authenticationManager: AuthenticationManager,
    private val jwtService: JwtService,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder
) {

    fun createAccount(account: Account): Account {
        account.password = bCryptPasswordEncoder.encode(account.password)
        return accountRepository.save(account)
    }

    fun getAccount(id: Long): Account? {
        return accountRepository.findById(id).orElse(null)
    }

    fun getAccounts(): List<Account> {
        return accountRepository.findAll()
    }

    fun updateAccount(id: Long, updateInfo: AccountUpdateRequest): Account? {

        val account = getAccount(id) ?: return null
        account.updateFromRequest(updateInfo, bCryptPasswordEncoder)
        return accountRepository.save(account)
    }

    fun deleteAccount(id: Long) {
        accountRepository.deleteById(id)
    }

    fun verifyLogin(loginRequest: AccountLoginRequest): String? {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(
                loginRequest.username,
                loginRequest.password
            )
        )

        if (authentication.isAuthenticated) {
            return jwtService.giveToken(loginRequest.username)
        }

        return null
    }
}