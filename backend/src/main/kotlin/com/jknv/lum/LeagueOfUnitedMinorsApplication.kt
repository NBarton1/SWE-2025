package com.jknv.lum

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaAuditing
import org.springframework.data.jpa.repository.config.EnableJpaRepositories


@SpringBootApplication
@EnableJpaRepositories("com.jknv.lum.repository")
@EnableJpaAuditing
class LeagueOfUnitedMinorsApplication

val LOGGER: Logger = LoggerFactory.getLogger(LeagueOfUnitedMinorsApplication::class.java)

fun main(args: Array<String>) {
    runApplication<LeagueOfUnitedMinorsApplication>(*args)
    LOGGER.info("Application started!")
}
