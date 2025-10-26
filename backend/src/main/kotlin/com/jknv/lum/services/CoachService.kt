package com.jknv.lum.services


import com.jknv.lum.model.dto.CoachDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.repository.CoachRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class CoachService (
    private val coachRepository: CoachRepository,
    private val teamService: TeamService,
) {
    fun createCoach(account: Account): CoachDTO =
        coachRepository.save(Coach(account = account)).toDTO()

    fun getCoaches(): List<CoachDTO> =
        coachRepository.findAll().map { it.toDTO() }

    internal fun getCoachByUsername(username: String): Coach? =
        coachRepository.getCoachByAccount_Username(username)

    fun countCoaches(): Long =
        coachRepository.count()

    fun setCoachingTeam(teamId: Long, username: String): CoachDTO {
        val team = teamService.getTeamById(teamId)
            ?: throw EntityNotFoundException("Team not found")
        val coach = getCoachByUsername(username)
            ?: throw EntityNotFoundException("Coach not found")

        coach.coachingTeam = team
        return coachRepository.save(coach).toDTO()
    }
}
