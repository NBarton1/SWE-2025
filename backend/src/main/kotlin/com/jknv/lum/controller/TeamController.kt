package com.jknv.lum.controller

import com.jknv.lum.LOGGER
import com.jknv.lum.model.Team
import com.jknv.lum.services.TeamService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/team")
class TeamController (
    private val teamService: TeamService,
) {
    @PostMapping("/create")
    fun createTeam(@RequestBody team: Team): ResponseEntity<Team> {
        LOGGER.info("Creating new team")

        val newTeam = teamService.createTeam(team)
        return ResponseEntity.status(HttpStatus.CREATED).body(newTeam)
    }

    @GetMapping("/all")
    fun getTeams(): ResponseEntity<List<Team>> {
        LOGGER.info("Getting all teams")

        val teams = teamService.getTeams()
        return ResponseEntity.status(HttpStatus.OK).body(teams)
    }
}
