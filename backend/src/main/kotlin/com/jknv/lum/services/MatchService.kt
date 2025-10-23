package com.jknv.lum.services

import com.jknv.lum.model.entity.Match
import com.jknv.lum.repository.MatchRepository
import org.springframework.stereotype.Service

@Service
class MatchService (
    val matchRepository: MatchRepository,
) {

    fun create(match: Match): Match {
        return matchRepository.save(match)
    }

    fun getMatchById(id: Long): Match? {
        return matchRepository.findById(id).orElse(null)
    }

    fun deleteMatch(id: Long) {
        matchRepository.deleteById(id)
    }

    fun getMatches(): List<Match> {
        return matchRepository.findAll()
    }

    fun count(): Long {
        return matchRepository.count()
    }
}
