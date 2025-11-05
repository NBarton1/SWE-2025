package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.repository.CoachRepository
import com.jknv.lum.repository.GuardianRepository
import com.jknv.lum.repository.TeamRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@Order(2)
class CoachSeeder (
    private val coachRepository: CoachRepository,
    private val teamRepository: TeamRepository,
    private val accountRepository: AccountRepository,
    private val guardianRepository: GuardianRepository,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder,
) : CommandLineRunner {

    @Transactional
    override fun run(vararg args: String?) {
        if (coachRepository.count() == 0L) {
            val teams = teamRepository.findAll()

            val coaches = listOf(
                coachOf("Coach C", "coach", teams[1]),
                coachOf("Donkey Kong", "DK", teams[0], 9999, -1),
                coachOf("Coach D", "coach1"),
            )

            coaches.forEach {
                it.account = accountRepository.save(it.account)
                coachRepository.save(it)
                guardianRepository.save(Guardian(account = it.account))
            }
            LOGGER.info("Coaches seeded")
        }
    }

    fun coachOf(name: String, username: String, team: Team? = null, likes: Int = 0, dislikes: Int = 0) : Coach =
        Coach(
            account = accountOf(name, username),
            coachingTeam = team,
            likes = likes,
            dislikes = dislikes,
        )

    fun accountOf(name: String, username: String) : Account =
        Account(
            name = name,
            username = username,
            password = bCryptPasswordEncoder.encode("password"),
            role = Role.COACH,
        )
}