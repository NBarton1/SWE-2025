package com.jknv.lum.config

import org.springframework.security.access.prepost.PreAuthorize

annotation class Require {

    @Target(AnnotationTarget.FUNCTION)
    @Retention(AnnotationRetention.RUNTIME)
    @PreAuthorize("hasRole('PLAYER') and !hasAnyRole('GUARDIAN','COACH','ADMIN')")
    annotation class PlayerOnly

    @Target(AnnotationTarget.FUNCTION)
    @Retention(AnnotationRetention.RUNTIME)
    @PreAuthorize("hasRole('GUARDIAN')")
    annotation class Guardian

    @Target(AnnotationTarget.FUNCTION)
    @Retention(AnnotationRetention.RUNTIME)
    @PreAuthorize("hasRole('COACH')")
    annotation class Coach

    @Target(AnnotationTarget.FUNCTION)
    @Retention(AnnotationRetention.RUNTIME)
    @PreAuthorize("hasRole('ADMIN')")
    annotation class Admin

    @Target(AnnotationTarget.FUNCTION)
    @Retention(AnnotationRetention.RUNTIME)
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    annotation class AdminOrAccountOwner
}