package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.type.Role
import com.jknv.lum.services.AccountService
import com.jknv.lum.services.CoachService
import com.jknv.lum.services.TeamService
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component

@Component
@Order(3)
class CoachSeeder (
    private val coachService: CoachService,
    private val accountService: AccountService,
    private val teamService: TeamService
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        if (coachService.count() == 0L) {
            val Coachs = listOf(
                Coach(
                    account = accountService.getAccountByUsername("coach") ?: return,
                    coachingTeam = teamService.getTeams()[0]
                )
            )

            Coachs.forEach { coachService.create(it) }
            LOGGER.info("Coaches seeded")
        }
    }
}
