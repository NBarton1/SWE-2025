package com.jknv.lum.controller

import com.jknv.lum.LOGGER
import com.jknv.lum.model.Match
import com.jknv.lum.services.MatchService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api")
class MatchController(
    private val matchService: MatchService,
) {
    @PostMapping("/match/create")
    fun createMatch(@RequestBody match: Match): ResponseEntity<Match> {
        LOGGER.info("Received new Match")
        val newMatch = matchService.createMatch(match)
        return ResponseEntity.status(HttpStatus.CREATED).body(newMatch)
    }

    @PostMapping("/match/all")
    fun getMatches(@RequestBody match: Match): ResponseEntity<List<Match>> {
        LOGGER.info("Getting all Matches")
        val matches = matchService.getMatches()
        return ResponseEntity.status(HttpStatus.OK).body(matches)
    }
}
