package com.jknv.lum.services

import com.jknv.lum.model.Match
import com.jknv.lum.repository.MatchRepository
import org.springframework.stereotype.Service

@Service
class MatchService (
    val matchRepository: MatchRepository,
) {

    fun createMatch(match: Match): Match {
        return matchRepository.save(match)
    }

    fun getMatches(): List<Match> {
        return matchRepository.findAll()
    }
}
