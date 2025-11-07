package com.jknv.lum.services

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.AccountRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.assertThrows
import org.springframework.security.core.userdetails.UsernameNotFoundException
import java.util.Optional
import kotlin.test.Test
import kotlin.test.assertEquals


class AccountDetailsServiceTest {
    val accountRepository: AccountRepository = mockk()
    val accountDetailsService = AccountDetailsService(accountRepository)

    lateinit var account: Account

    @BeforeEach
    fun setup() {
        account = Account(name = "name", username = "username", password = "password", role = Role.ADMIN)
    }

    @Test
    fun loadUserByUsernameTest() {
        every { accountRepository.findByUsername(any()) } answers {
            if (firstArg<String>() == account.username)
                Optional.of(account)
            else Optional.empty()
        }

        val accountDetails = accountDetailsService.loadUserByUsername(account.username)

        verify { accountRepository.findByUsername(account.username) }
        assertEquals(account, accountDetails.account)
        assertThrows<UsernameNotFoundException> { accountDetailsService.loadUserByUsername("") }
    }

    @Test
    fun loadUserByIdTest() {
        every { accountRepository.findById(any()) } answers {
            if (firstArg<Long>() == account.id)
                Optional.of(account)
            else Optional.empty()
        }

        val accountDetails = accountDetailsService.loadUserById(account.id)

        verify { accountRepository.findById(account.id) }
        assertEquals(account, accountDetails.account)
        assertThrows<UsernameNotFoundException> { accountDetailsService.loadUserById(account.id + 1) }
    }
}
