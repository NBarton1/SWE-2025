package com.jknv.lum.config

import org.springframework.security.access.prepost.PreAuthorize

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@PreAuthorize("hasRole('PLAYER') and !hasAnyRole('GUARDIAN','COACH','ADMIN')")
annotation class PreAuthorizePlayerOnly

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@PreAuthorize("hasRole('GUARDIAN')")
annotation class PreAuthorizeGuardian

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@PreAuthorize("hasRole('COACH')")
annotation class PreAuthorizeCoach

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@PreAuthorize("hasRole('ADMIN')")
annotation class PreAuthorizeAdmin

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
annotation class PreAuthorizeAdminOrAccountOwner