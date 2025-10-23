package com.jknv.lum.controller

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.request.MatchCreateRequest
import com.jknv.lum.model.request.MatchDeleteRequest
import com.jknv.lum.model.request.MatchUpdateRequest
import com.jknv.lum.services.MatchService
import com.jknv.lum.services.TeamService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/match")
class MatchController (
    private val matchService: MatchService,
) {
    @PostMapping("/create")
    fun createMatch(@RequestBody req: MatchCreateRequest): ResponseEntity<Match> {
        LOGGER.info("Creating new Match")



        val newMatch = matchService.createMatch(req)
        return ResponseEntity.status(HttpStatus.CREATED).body(newMatch)
    }

    @DeleteMapping("/delete")
    fun deleteMatch(@RequestBody req: MatchDeleteRequest): ResponseEntity<Void> {
        LOGGER.info("Deleting Match")

        matchService.deleteMatch(req.id)
        return ResponseEntity.status(HttpStatus.OK).build()
    }

    @PostMapping("/update")
    fun updateMatch(@RequestBody req: MatchUpdateRequest): ResponseEntity<Match> {
        LOGGER.info("Updating Match")

        val match = matchService.getMatchById(req.id)

//        match.date = req.date
//        match.type = req.type
//        match.awayTeam = teamService.getTeamById(req.awayTeamId)
//        match.homeTeam = teamService.getTeamById(req.homeTeamId)
//
        matchService.updateMatch(req)

        return ResponseEntity.status(HttpStatus.OK).body(match)
    }

    @GetMapping("/all")
    fun getMatches(): ResponseEntity<List<Match>> {
        LOGGER.info("Getting all Matches")

        val matches = matchService.getMatches()
        return ResponseEntity.status(HttpStatus.OK).body(matches)
    }
}
