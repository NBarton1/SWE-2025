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
                postOf(accounts[0], "DK won"),
                postOf(accounts[1], "DK won again"),
                postOf(accounts[2], "DK won yet again"),
                postOf(accounts[2], "DK is awesome"),
                postOf(accounts[2], "DK is the winner"),
            )

            posts[2].parentPost = posts[1]
            posts[3].parentPost = posts[2]
            posts[4].parentPost = posts[2]

            posts.forEach { postRepository.save(it) }
            LOGGER.info("Posts seeded")
        }
    }

    fun postOf(account: Account, textContent: String) : Post =
        Post(
            account = account,
            textContent = "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"$textContent\"}]}]}",
        )
}
