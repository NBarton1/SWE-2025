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

    fun countCoaches(): Long =
        coachRepository.count()

    fun setCoachingTeam(teamId: Long, accountId: Long): CoachDTO {
        val team = teamService.getTeamById(teamId)
        val coach = getCoachById(accountId)

        coach.coachingTeam = team
        return coachRepository.save(coach).toDTO()
    }

    internal fun getCoachByUsername(username: String): Coach =
        coachRepository.getCoachByAccountUsername(username).orElseThrow { EntityNotFoundException("Coach $username not found") }

    internal fun getCoachById(id: Long): Coach =
        coachRepository.getCoachById(id).orElseThrow { EntityNotFoundException("Coach $id not found") }
}
