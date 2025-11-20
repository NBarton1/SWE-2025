package com.jknv.lum.config.seed

import com.jknv.lum.model.dto.FlagDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Flag
import com.jknv.lum.model.entity.Post
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.repository.FlagRepository
import com.jknv.lum.repository.PostRepository
import com.jknv.lum.services.FlagService
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@Order(7)
class FlagSeeder(
    private val flagRepository: FlagRepository,
    private val accountRepository: AccountRepository,
    private val postRepository: PostRepository,
    private val flagService: FlagService
) : CommandLineRunner {

    @Transactional
    override fun run(vararg args: String?) {
        if (flagRepository.count() == 0L) {
            flagService.createFlagByIds(4, 1)
            flagService.createFlagByIds(4, 2)
            flagService.createFlagByIds(4, 3)
            flagService.createFlagByIds(3, 5)
        }
    }
}