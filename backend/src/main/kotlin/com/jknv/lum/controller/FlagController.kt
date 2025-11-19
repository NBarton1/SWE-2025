package com.jknv.lum.controller

import com.jknv.lum.config.Require
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.FlagService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping
import java.security.Principal

@RestController
@RequestMapping("/api/flags")
class FlagController(private val flagService: FlagService) {

    @DeleteMapping("/{id}")
    fun deleteFlag(
        @PathVariable id: Long,
        @AuthenticationPrincipal details: AccountDetails
    ): ResponseEntity<Void> {
        flagService.deleteFlag(id, details.id)
        return ResponseEntity.ok().build()
    }
}
