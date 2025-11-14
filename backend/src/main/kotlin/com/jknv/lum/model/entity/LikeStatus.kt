//package com.jknv.lum.model.entity
//
//import jakarta.persistence.Column
//import jakarta.persistence.Entity
//import jakarta.persistence.EnumType
//import jakarta.persistence.Enumerated
//import jakarta.persistence.FetchType
//import jakarta.persistence.GeneratedValue
//import jakarta.persistence.GenerationType
//import jakarta.persistence.Id
//import jakarta.persistence.ManyToOne
//import jakarta.persistence.Table
//
//@Entity
//@Table(name = "LikeStatus")
//class LikeStatus(
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    val id: Long,
//
//    @Column
//    @ManyToOne(fetch = FetchType.LAZY)
//    val account: Account,
//
//
//    val likedEntity: Likeable,
//
//    @Column
//    val liked: Boolean
//)