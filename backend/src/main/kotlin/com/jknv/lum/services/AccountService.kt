package com.jknv.lum.services

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.AccountUpdateRequest
import com.jknv.lum.repository.AccountRepository
import jakarta.transaction.Transactional
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service

@Service
@Transactional
class AccountService(
    val accountRepository: AccountRepository,
    val bCryptPasswordEncoder: BCryptPasswordEncoder
) {

    fun createAccount(account: Account): Account {
        account.password = bCryptPasswordEncoder.encode(account.password)
        return accountRepository.save(account)
    }

    fun getAccount(id: Long): Account? {
        return accountRepository.findById(id).orElse(null)
    }

    fun getAccountByUsername(username: String): Account? {
        return accountRepository.findByUsername(username)
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

    fun countAccounts(): Long {
        return accountRepository.count()
    }
}