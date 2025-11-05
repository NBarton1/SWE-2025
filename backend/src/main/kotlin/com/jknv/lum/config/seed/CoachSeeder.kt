package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.services.AccountService
import com.jknv.lum.services.CoachService
import com.jknv.lum.services.TeamService
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component

@Component
@Order(2)
class CoachSeeder (
    private val accountService: AccountService,
    private val coachService: CoachService,
    private val teamService: TeamService,
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        if (coachService.countCoaches() == 0L) {
            val accounts = listOf(
                toRequest(name = "Coach C", username = "coach"),
                toRequest(name = "Donkey Kong", username = "DK"),
            )

            accounts.forEach { accountService.createAccountWithRoles(it) }

            val coaches = coachService.getCoaches()
            val teams = teamService.getTeams()
            val coaching = listOf(
                Pair(0, 0),
                Pair(0, 1),
                Pair(1, 1),
            )
            coaching.forEach { (teamIdx, coachIdx) -> coachService.setCoachingTeam(teams[teamIdx].id, coaches[coachIdx].account.id) }
            LOGGER.info("Coaches seeded")
        }
    }

    fun toRequest(name: String, username: String) : AccountCreateRequest =
        AccountCreateRequest(
            name = name,
            username = username,
            password = "password",
            role = Role.COACH,
        )
}