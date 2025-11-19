package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Team
import com.jknv.lum.repository.TeamRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@Order(1)
class TeamSeeder (
    private val teamRepository: TeamRepository
) : CommandLineRunner {

    @Transactional
    override fun run(vararg args: String?) {
        if (teamRepository.count() == 0L) {
            val teams = listOf(
                Team(name="DK"),
                Team(name="Eagles"),
                Team(name="Chickens")
            )

            teams.forEach { teamRepository.save(it) }
            LOGGER.info("Teams seeded")
        }
    }
}
