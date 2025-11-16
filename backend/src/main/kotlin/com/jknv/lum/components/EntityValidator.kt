package com.jknv.lum.components

import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Post
import com.jknv.lum.model.type.LikeType
import com.jknv.lum.repository.CoachRepository
import com.jknv.lum.repository.PostRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Component
import kotlin.reflect.KClass

interface EntityValidator {
    val entityType: KClass<*>
    fun validateExists(entityId: Long)
}

@Component
class CoachValidator(
    private val coachRepository: CoachRepository
): EntityValidator {
    override val entityType: KClass<*>
        get() = Coach::class

    override fun validateExists(entityId: Long) {
        if (!coachRepository.existsById(entityId)) {
            throw EntityNotFoundException("Coach with id $entityId not found")
        }
    }
}

@Component
class PostValidator(
    private val postRepository: PostRepository
): EntityValidator {
    override val entityType: KClass<*>
        get() = Post::class

    override fun validateExists(entityId: Long) {
        if (!postRepository.existsById(entityId)) {
            throw EntityNotFoundException("Post with id $entityId not found")
        }
    }
}

@Component
class EntityValidatorRegistry(
    validators: List<EntityValidator>
) {
    private val validatorMap = validators.associateBy { it.entityType }

    fun validateExists(entityClass: KClass<*>, entityId: Long) {
        val validator = validatorMap[entityClass]
            ?: throw IllegalArgumentException("No validator for ${entityClass.simpleName}")

        validator.validateExists(entityId)
    }
}