package com.jknv.lum.controller

import com.jknv.lum.LOGGER
import com.jknv.lum.config.PreAuthorizeAdmin
import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.request.match.MatchCreateRequest
import com.jknv.lum.model.request.match.MatchUpdateRequest
import com.jknv.lum.services.MatchService
import com.jknv.lum.services.TeamService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/matches")
class MatchController (
    private val matchService: MatchService,
    private val teamService: TeamService,
) {
    @PostMapping
    @PreAuthorizeAdmin
    fun createMatch(@RequestBody req: MatchCreateRequest): ResponseEntity<Match> {
        LOGGER.info("Creating new Match")

        val homeTeam = teamService.getTeamById(req.homeTeamId)
            ?: return ResponseEntity.notFound().build()
        val awayTeam = teamService.getTeamById(req.awayTeamId)
            ?: return ResponseEntity.notFound().build()

        val match = Match(
            date = req.date,
            type = req.type,
            homeTeam = homeTeam,
            awayTeam = awayTeam
        )

        val newMatch = matchService.createMatch(match)
        return ResponseEntity.status(HttpStatus.CREATED).body(newMatch)
    }

    @DeleteMapping("/{matchId}")
    @PreAuthorizeAdmin
    fun deleteMatch(@PathVariable matchId: Long): ResponseEntity<Void> {
        LOGGER.info("Deleting Match")

        matchService.deleteMatch(matchId)
        return ResponseEntity.status(HttpStatus.OK).build()
    }

    @PutMapping("/{matchId}")
    @PreAuthorizeAdmin
    fun updateMatch(@PathVariable matchId: Long, @RequestBody req: MatchUpdateRequest): ResponseEntity<Match> {
        LOGGER.info("Updating Match")

        val match = matchService.getMatchById(matchId)
            ?: return ResponseEntity.notFound().build()

        match.homeTeam = teamService.getTeamById(req.homeTeamId)
            ?: return ResponseEntity.notFound().build()
        match.awayTeam = teamService.getTeamById(req.awayTeamId)
            ?: return ResponseEntity.notFound().build()
        match.date = req.date
        match.type = req.type

        matchService.createMatch(match)
        return ResponseEntity.status(HttpStatus.OK).body(match)
    }

    @GetMapping
    fun getMatches(): ResponseEntity<List<Match>> {
        LOGGER.info("Getting all Matches")

        val matches = matchService.getMatches()
        return ResponseEntity.status(HttpStatus.OK).body(matches)
    }
}
