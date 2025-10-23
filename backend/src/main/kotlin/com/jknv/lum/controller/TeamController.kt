package com.jknv.lum.controller

import com.jknv.lum.model.entity.Team
import com.jknv.lum.services.TeamService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/teams")
class TeamController (
    private val teamService: TeamService
) {
    @PostMapping
    fun create(@RequestBody team: Team): ResponseEntity<Team> {
        val newTeam = teamService.create(team)
        return ResponseEntity.status(HttpStatus.CREATED).body(newTeam)
    }

    @GetMapping
    fun getAll(): ResponseEntity<List<Team>> {
        return ResponseEntity.ok(teamService.getTeams())
    }
}
