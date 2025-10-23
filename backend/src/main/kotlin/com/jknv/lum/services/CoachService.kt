package com.jknv.lum.services


import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Team
import jakarta.persistence.EntityManager
import com.jknv.lum.repository.CoachRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class CoachService (
    val coachRepository: CoachRepository,
    val entityManager: EntityManager
) {
    fun create(coach: Coach): Coach {
        coach.account = entityManager.merge(coach.account)
        return coachRepository.save(coach)
    }

    fun getCoachByUsername(username: String): Coach? {
        return coachRepository.getCoachByAccount_Username(username)
    }

    fun getTeam(coach: Coach): Team? {
        return coach.coachingTeam
    }

    fun count(): Long {
        return coachRepository.count()
    }
}
