package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Post
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.repository.PostRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@Order(6)
class PostSeeder (
    private val postRepository: PostRepository,
    private val accountRepository: AccountRepository,
) : CommandLineRunner {

    @Transactional
    override fun run(vararg args: String?) {
        if (postRepository.count() == 0L) {
            val accounts = accountRepository.findAll()

            val posts = listOf(
                postOf(accounts[0], "DK won", true),
                postOf(accounts[1], "DK won again", true),
                postOf(accounts[5], "DK sucks!!!", true),
                postOf(accounts[5], "DK team players are losers", true),
                postOf(accounts[2], "DK won yet again", true),
                postOf(accounts[2], "DK is awesome", true),
                postOf(accounts[2], "DK is the winner", true),
            )

            posts.forEach { postRepository.save(it) }

            posts[2].parentPost = posts[1]
            posts[3].parentPost = posts[2]
            posts[4].parentPost = posts[2]

            LOGGER.info("Posts seeded")
        }
    }

    fun postOf(account: Account, textContent: String, isApproved: Boolean) : Post =
        Post(
            account = account,
            textContent = "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"$textContent\"}]}]}",
            isApproved = isApproved
        )
}
