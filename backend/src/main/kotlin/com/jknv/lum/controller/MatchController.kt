package com.jknv.lum.controller

import com.jknv.lum.config.PreAuthorizeAdmin
import com.jknv.lum.model.request.match.MatchCreateRequest
import com.jknv.lum.model.request.match.MatchUpdateRequest
import com.jknv.lum.model.dto.MatchDTO
import com.jknv.lum.services.MatchService
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
) {
    @PostMapping
    @PreAuthorizeAdmin
    fun createMatch(@RequestBody req: MatchCreateRequest): ResponseEntity<MatchDTO> {
        val response = matchService.createMatch(req)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @DeleteMapping("/{matchId}")
    @PreAuthorizeAdmin
    fun deleteMatch(@PathVariable matchId: Long): ResponseEntity<Void> {
        matchService.deleteMatch(matchId)
        return ResponseEntity.status(HttpStatus.OK).build()
    }

    @PutMapping("/{matchId}")
    @PreAuthorizeAdmin
    fun updateMatch(@PathVariable matchId: Long, @RequestBody req: MatchUpdateRequest): ResponseEntity<MatchDTO> {
        val response = matchService.updateMatch(matchId, req)
        return ResponseEntity.status(HttpStatus.OK).body(response)
    }


    @GetMapping("/{matchId}")
    fun getMatch(@PathVariable matchId: Long): ResponseEntity<MatchDTO> {
        val response = matchService.getMatch(matchId)
        return ResponseEntity.status(HttpStatus.OK).body(response)
    }

    @GetMapping
    fun getMatches(): ResponseEntity<List<MatchDTO>> {
        val response = matchService.getMatches()
        return ResponseEntity.status(HttpStatus.OK).body(response)
    }
}
