package com.jknv.lum.services


import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Team
import com.jknv.lum.repository.CoachRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class CoachService (
    private val coachRepository: CoachRepository,
) {
    fun createCoach(coach: Coach): Coach {
        return coachRepository.save(coach)
    }

    fun getCoachByUsername(username: String): Coach? {
        return coachRepository.getCoachByAccount_Username(username)
    }

    fun setCoachingTeam(coach: Coach, team: Team): Coach {
        coach.coachingTeam = team
        return coachRepository.save(coach)
    }

    fun getTeamByCoach(coach: Coach): Team? {
        return coach.coachingTeam
    }

    fun countCoaches(): Long {
        return coachRepository.count()
    }
}
