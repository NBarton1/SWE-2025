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
    fun create(coach: Coach): Coach {
        return coachRepository.save(coach)
    }

    fun getCoachByUsername(username: String): Coach? {
        return coachRepository.getCoachByAccount_Username(username)
    }

    fun setTeam(coach: Coach, team: Team): Coach {
        coach.coachingTeam = team
        return coachRepository.save(coach)
    }

    fun getTeam(coach: Coach): Team? {
        return coach.coachingTeam
    }

    fun count(): Long {
        return coachRepository.count()
    }
}
