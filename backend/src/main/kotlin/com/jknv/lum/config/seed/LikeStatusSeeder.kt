package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.LikeStatus
import com.jknv.lum.model.type.LikeType
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.repository.LikeRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@Order(4)
class LikeStatusSeeder(
    private val likeRepository: LikeRepository,
    private val accountRepository: AccountRepository
) : CommandLineRunner {

    @Transactional
    override fun run(vararg args: String?) {
        if (likeRepository.count() == 0L) {
            val accounts = accountRepository.findAll()

            // DK should have all likes
            accounts.forEach { account ->
                val likeStatus = likeStatusOf(account, 3, LikeType.COACH, true)
                likeRepository.save(likeStatus)
            }

            val postLikeStatuses = listOf(
                likeStatusOf(accounts[2], 1, LikeType.POST, true),
                likeStatusOf(accounts[2], 2, LikeType.POST, true),
                likeStatusOf(accounts[1], 1, LikeType.POST, true),
                likeStatusOf(accounts[0], 2, LikeType.POST, false),
                likeStatusOf(accounts[0], 1, LikeType.POST, false),
                likeStatusOf(accounts[3], 2, LikeType.POST, false),
                likeStatusOf(accounts[3], 2, LikeType.POST, false),
            )

            val accountLikeStatuses = listOf(
                likeStatusOf(accounts[0], 2, LikeType.COACH, true),
                likeStatusOf(accounts[0], 4, LikeType.COACH, true),
                likeStatusOf(accounts[1], 2, LikeType.COACH, false),
                likeStatusOf(accounts[4], 2, LikeType.COACH, false),
                likeStatusOf(accounts[4], 5, LikeType.COACH, false),
                likeStatusOf(accounts[1], 4, LikeType.COACH, true),
            )

            likeRepository.saveAll(postLikeStatuses)
            likeRepository.saveAll(accountLikeStatuses)

            LOGGER.info("Like statuses seeded")
        }
    }

    fun likeStatusOf(account: Account, entityId: Long, likeType: LikeType, liked: Boolean) : LikeStatus =
        LikeStatus(
            account = account,
            entityId = entityId,
            likeType = likeType,
            liked = liked
        )
}